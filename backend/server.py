from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import io
import csv
import logging
import uuid
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Literal
from datetime import datetime, timezone, timedelta
import httpx
from ghl_service import create_contact

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Mortgage Leads API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ============= Models =============

class CalcInputs(BaseModel):
    annual_income: float
    monthly_debt: float = 0
    down_payment: float = 0
    credit_score: Literal["below-580", "580-619", "620-679", "680-739", "740+"]
    state: str


class CalcResult(BaseModel):
    home_price_low: int
    home_price_high: int
    monthly_payment: int
    estimated_rate: float
    loan_programs: List[str]
    dti_ratio: float


class LeadCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    zip_code: str
    # Calculator context (optional)
    annual_income: Optional[float] = None
    monthly_debt: Optional[float] = None
    down_payment: Optional[float] = None
    credit_score: Optional[str] = None
    state: Optional[str] = None
    source: Optional[str] = "calculator"
    home_price_low: Optional[int] = None
    home_price_high: Optional[int] = None
    monthly_payment: Optional[int] = None


class LeadUpdate(BaseModel):
    status: Optional[Literal["new", "contacted", "qualified", "closed", "lost"]] = None
    notes: Optional[str] = None


class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    first_name: str
    last_name: str
    email: str
    phone: str
    zip_code: str
    annual_income: Optional[float] = None
    monthly_debt: Optional[float] = None
    down_payment: Optional[float] = None
    credit_score: Optional[str] = None
    state: Optional[str] = None
    home_price_low: Optional[int] = None
    home_price_high: Optional[int] = None
    monthly_payment: Optional[int] = None
    source: str = "calculator"
    status: str = "new"
    notes: str = ""
    created_at: str


class SubscriberCreate(BaseModel):
    email: EmailStr
    source: str = "lead-magnet"


class ChatMessage(BaseModel):
    message: str
    history: List[dict] = []


# ============= Helpers =============

def credit_score_to_rate(cs: str) -> float:
    return {
        "below-580": 8.5,
        "580-619": 7.8,
        "620-679": 7.2,
        "680-739": 6.7,
        "740+": 6.25,
    }.get(cs, 7.0)


def credit_score_programs(cs: str, down_payment_pct: float) -> List[str]:
    progs = []
    if cs in ("below-580", "580-619"):
        progs.append("FHA Loan")
        progs.append("VA Loan (if eligible)")
    elif cs == "620-679":
        progs.append("FHA Loan")
        progs.append("Conventional Loan")
        progs.append("VA Loan (if eligible)")
    else:
        progs.append("Conventional Loan")
        progs.append("Jumbo Loan (high-value)")
        progs.append("VA Loan (if eligible)")
    if down_payment_pct < 0.10:
        progs.append("First-Time Homebuyer Program")
    return progs


def calculate_affordability(inputs: CalcInputs) -> CalcResult:
    rate = credit_score_to_rate(inputs.credit_score)
    monthly_rate = rate / 100 / 12
    n = 360  # 30-year fixed

    # 28% front-end DTI rule for housing
    max_housing_monthly = (inputs.annual_income / 12) * 0.28
    # 43% back-end DTI total
    max_total_monthly = (inputs.annual_income / 12) * 0.43 - inputs.monthly_debt
    monthly_payment_cap = max(0, min(max_housing_monthly, max_total_monthly))

    # Reverse-amortize to principal (P&I only — approx, taxes/ins ~20% bump)
    pi_payment = monthly_payment_cap * 0.80
    if monthly_rate > 0:
        loan_principal = pi_payment * ((1 - (1 + monthly_rate) ** -n) / monthly_rate)
    else:
        loan_principal = pi_payment * n

    home_price_mid = loan_principal + inputs.down_payment
    home_price_low = int(max(50000, home_price_mid * 0.92))
    home_price_high = int(max(60000, home_price_mid * 1.08))
    monthly_payment = int(monthly_payment_cap)

    dp_pct = inputs.down_payment / home_price_mid if home_price_mid > 0 else 0
    programs = credit_score_programs(inputs.credit_score, dp_pct)

    dti_ratio = round((inputs.monthly_debt + monthly_payment) / (inputs.annual_income / 12) * 100, 1) if inputs.annual_income > 0 else 0

    return CalcResult(
        home_price_low=home_price_low,
        home_price_high=home_price_high,
        monthly_payment=monthly_payment,
        estimated_rate=rate,
        loan_programs=programs,
        dti_ratio=dti_ratio,
    )


# ============= Auth =============

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("session_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    session = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")

    expires_at = session["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")

    user = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@api_router.post("/auth/session")
async def auth_session(request: Request, response: Response):
    session_id = request.headers.get("X-Session-ID")
    if not session_id:
        raise HTTPException(status_code=400, detail="X-Session-ID header required")

    async with httpx.AsyncClient() as hc:
        r = await hc.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id},
            timeout=15.0,
        )
    if r.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid session id")
    data = r.json()

    email = data["email"]
    existing = await db.users.find_one({"email": email}, {"_id": 0})
    if existing:
        user_id = existing["user_id"]
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"name": data.get("name"), "picture": data.get("picture")}}
        )
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": user_id,
            "email": email,
            "name": data.get("name"),
            "picture": data.get("picture"),
            "created_at": datetime.now(timezone.utc).isoformat(),
        })

    session_token = data["session_token"]
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60,
    )
    return {"user_id": user_id, "email": email, "name": data.get("name"), "picture": data.get("picture")}


@api_router.get("/auth/me")
async def auth_me(user: dict = Depends(get_current_user)):
    return {"user_id": user["user_id"], "email": user["email"], "name": user.get("name"), "picture": user.get("picture")}


@api_router.post("/auth/logout")
async def auth_logout(request: Request, response: Response):
    token = request.cookies.get("session_token")
    if token:
        await db.user_sessions.delete_one({"session_token": token})
    response.delete_cookie("session_token", path="/")
    return {"ok": True}


# ============= Public Endpoints =============

@api_router.get("/")
async def root():
    return {"message": "Mortgage Leads API", "version": "1.0"}


@api_router.post("/calculate", response_model=CalcResult)
async def calculate(inputs: CalcInputs):
    return calculate_affordability(inputs)


@api_router.post("/leads", response_model=Lead)
async def create_lead(lead: LeadCreate):
    lead_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "id": lead_id,
        **lead.model_dump(),
        "status": "new",
        "notes": "",
        "created_at": now,
    }
await db.leads.insert_one(doc)

try:

    ghl = await create_contact(lead)

    logger.info(f"GHL Contact Created: {ghl}")

except Exception as e:

    logger.exception(e)

doc.pop("_id", None)

return Lead(**doc)


@api_router.post("/subscribers")
async def create_subscriber(sub: SubscriberCreate):
    existing = await db.subscribers.find_one({"email": sub.email}, {"_id": 0})
    if existing:
        return {"ok": True, "duplicate": True}
    await db.subscribers.insert_one({
        "id": str(uuid.uuid4()),
        "email": sub.email,
        "source": sub.source,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    logger.info(f"[MOCK EMAIL] Sent 2026 First-Time Homebuyer Guide to {sub.email}")
    return {"ok": True, "duplicate": False}


@api_router.post("/chat")
async def chat(msg: ChatMessage):
    """MOCKED AI chatbot — returns canned responses based on keywords."""
    text = msg.message.lower()
    if any(k in text for k in ["afford", "how much", "budget", "price"]):
        reply = "Great question! Affordability depends on your income, debts, down payment, and credit. As a rule of thumb, lenders allow housing costs up to ~28% of your gross monthly income. Try our calculator above for a personalized estimate."
    elif any(k in text for k in ["credit", "score", "fico"]):
        reply = "Most conventional loans require a 620+ credit score, FHA loans go as low as 580 (or 500 with 10% down), and VA loans have flexible guidelines. Higher scores unlock better rates."
    elif any(k in text for k in ["down payment", "downpayment", "down"]):
        reply = "Down payment requirements: Conventional 3-5%, FHA 3.5%, VA & USDA 0%. Putting 20% down avoids private mortgage insurance (PMI)."
    elif any(k in text for k in ["fha"]):
        reply = "FHA loans are government-insured mortgages ideal for first-time buyers. Minimum 3.5% down with 580+ credit score. Loan limits vary by county."
    elif any(k in text for k in ["va"]):
        reply = "VA loans are available to eligible veterans, active service members, and surviving spouses. 0% down payment, no PMI, and competitive rates."
    elif any(k in text for k in ["rate", "interest"]):
        reply = "Today's average 30-year fixed rates range from 6.25% to 7.5% depending on credit profile and loan program. We'll match you with the best rate from our lender network."
    elif any(k in text for k in ["pre-qual", "prequal", "qualify", "pre approval"]):
        reply = "Pre-qualification takes about 60 seconds and uses a soft credit pull — no impact to your score. Click 'Get Pre-Qualified' to start."
    elif any(k in text for k in ["next", "step", "what now"]):
        reply = "Next steps: 1) Use our calculator for a budget. 2) Submit your info to get matched with a licensed loan officer. 3) Get a personalized rate quote. 4) Apply when you're ready."
    else:
        reply = "I'm your mortgage assistant. Ask me anything about loan programs, credit scores, down payments, rates, or how to qualify. (Note: this is a demo assistant with sample responses.)"
    return {"reply": reply, "mocked": True}


# ============= Admin Endpoints (Protected) =============

@api_router.get("/admin/leads", response_model=List[Lead])
async def list_leads(user: dict = Depends(get_current_user)):
    cursor = db.leads.find({}, {"_id": 0}).sort("created_at", -1).limit(500)
    docs = await cursor.to_list(length=500)
    return [Lead(**d) for d in docs]


@api_router.patch("/admin/leads/{lead_id}", response_model=Lead)
async def update_lead(lead_id: str, update: LeadUpdate, user: dict = Depends(get_current_user)):
    fields = {k: v for k, v in update.model_dump().items() if v is not None}
    if not fields:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.leads.update_one({"id": lead_id}, {"$set": fields})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    doc = await db.leads.find_one({"id": lead_id}, {"_id": 0})
    return Lead(**doc)


@api_router.delete("/admin/leads/{lead_id}")
async def delete_lead(lead_id: str, user: dict = Depends(get_current_user)):
    result = await db.leads.delete_one({"id": lead_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"ok": True}


@api_router.get("/admin/analytics")
async def analytics(user: dict = Depends(get_current_user)):
    total = await db.leads.count_documents({})
    qualified = await db.leads.count_documents({"status": {"$in": ["qualified", "closed"]}})
    by_status_cursor = db.leads.aggregate([
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ])
    by_status = {doc["_id"]: doc["count"] async for doc in by_status_cursor}

    by_source_cursor = db.leads.aggregate([
        {"$group": {"_id": "$source", "count": {"$sum": 1}}}
    ])
    by_source = {doc["_id"]: doc["count"] async for doc in by_source_cursor}

    # Last 7 days trend
    today = datetime.now(timezone.utc).date()
    trend = []
    for i in range(6, -1, -1):
        d = today - timedelta(days=i)
        start = datetime.combine(d, datetime.min.time()).replace(tzinfo=timezone.utc).isoformat()
        end = datetime.combine(d, datetime.max.time()).replace(tzinfo=timezone.utc).isoformat()
        count = await db.leads.count_documents({"created_at": {"$gte": start, "$lte": end}})
        trend.append({"date": d.isoformat(), "count": count})

    return {
        "total_leads": total,
        "qualified_leads": qualified,
        "conversion_rate": round((qualified / total * 100) if total else 0, 1),
        "by_status": by_status,
        "by_source": by_source,
        "trend": trend,
    }


@api_router.get("/admin/leads/export")
async def export_leads(user: dict = Depends(get_current_user)):
    cursor = db.leads.find({}, {"_id": 0}).sort("created_at", -1)
    docs = await cursor.to_list(length=10000)
    output = io.StringIO()
    if docs:
        fieldnames = ["id", "first_name", "last_name", "email", "phone", "zip_code", "state",
                      "annual_income", "monthly_debt", "down_payment", "credit_score",
                      "home_price_low", "home_price_high", "monthly_payment",
                      "source", "status", "notes", "created_at"]
        writer = csv.DictWriter(output, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for d in docs:
            writer.writerow(d)
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=leads.csv"},
    )


# ============= Register =============

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
