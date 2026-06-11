"""
Backend API tests for Mortgage Lead Generation app.
Covers: public endpoints (calc/leads/subscribers/chat/auth), and admin endpoints
that require a synthetic session created directly in MongoDB.
"""
import os
import time
import uuid
from datetime import datetime, timezone, timedelta

import pytest
import requests
from pymongo import MongoClient

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://mortgage-prequalify.preview.emergentagent.com").rstrip("/")
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "test_database")

CREATED_LEAD_IDS = []
CREATED_TEST_EMAIL = f"TEST_lead_{uuid.uuid4().hex[:8]}@example.com"
CREATED_SUB_EMAIL = f"TEST_sub_{uuid.uuid4().hex[:8]}@example.com"


# ---------- Fixtures ----------

@pytest.fixture(scope="session")
def mongo():
    client = MongoClient(MONGO_URL)
    yield client[DB_NAME]
    client.close()


@pytest.fixture(scope="session")
def admin_session(mongo):
    """Create synthetic admin session in DB and return the session token."""
    user_id = f"test-user-{int(time.time())}"
    session_token = f"test_session_{uuid.uuid4().hex}"
    mongo.users.insert_one({
        "user_id": user_id,
        "email": f"test.admin.{int(time.time())}@example.com",
        "name": "Test Admin",
        "picture": "https://via.placeholder.com/150",
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    mongo.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    yield {"token": session_token, "user_id": user_id}
    # Teardown
    mongo.user_sessions.delete_one({"session_token": session_token})
    mongo.users.delete_one({"user_id": user_id})


@pytest.fixture(scope="session")
def auth_cookies(admin_session):
    return {"session_token": admin_session["token"]}


@pytest.fixture(scope="session")
def auth_headers(admin_session):
    return {"Authorization": f"Bearer {admin_session['token']}"}


# ---------- Public endpoints ----------

class TestPublic:
    def test_root_health(self):
        r = requests.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        data = r.json()
        assert "message" in data
        assert data["version"] == "1.0"

    def test_calculate(self):
        r = requests.post(f"{BASE_URL}/api/calculate", json={
            "annual_income": 85000,
            "monthly_debt": 400,
            "down_payment": 30000,
            "credit_score": "680-739",
            "state": "CA",
        })
        assert r.status_code == 200, r.text
        d = r.json()
        for k in ["home_price_low", "home_price_high", "monthly_payment",
                  "estimated_rate", "loan_programs", "dti_ratio"]:
            assert k in d, f"missing {k}"
        assert isinstance(d["loan_programs"], list) and len(d["loan_programs"]) > 0
        assert d["home_price_high"] >= d["home_price_low"] > 0
        assert d["estimated_rate"] == 6.7  # 680-739 bracket
        assert d["monthly_payment"] > 0

    def test_calculate_bad_credit_score(self):
        r = requests.post(f"{BASE_URL}/api/calculate", json={
            "annual_income": 50000,
            "monthly_debt": 0,
            "down_payment": 5000,
            "credit_score": "INVALID",
            "state": "TX",
        })
        assert r.status_code == 422


# ---------- Leads ----------

class TestLeads:
    def test_create_lead(self):
        payload = {
            "first_name": "TEST",
            "last_name": "User",
            "email": CREATED_TEST_EMAIL,
            "phone": "555-555-5555",
            "zip_code": "90001",
            "annual_income": 85000,
            "monthly_debt": 400,
            "down_payment": 30000,
            "credit_score": "680-739",
            "state": "CA",
            "home_price_low": 300000,
            "home_price_high": 350000,
            "monthly_payment": 1900,
            "source": "calculator",
        }
        r = requests.post(f"{BASE_URL}/api/leads", json=payload)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["email"] == CREATED_TEST_EMAIL
        assert d["status"] == "new"
        assert "id" in d and isinstance(d["id"], str)
        assert "created_at" in d
        CREATED_LEAD_IDS.append(d["id"])

    def test_create_lead_invalid_email(self):
        r = requests.post(f"{BASE_URL}/api/leads", json={
            "first_name": "A", "last_name": "B",
            "email": "not-an-email",
            "phone": "1", "zip_code": "1",
        })
        assert r.status_code == 422


# ---------- Subscribers ----------

class TestSubscribers:
    def test_subscribe_new(self):
        r = requests.post(f"{BASE_URL}/api/subscribers", json={"email": CREATED_SUB_EMAIL})
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["ok"] is True
        assert d["duplicate"] is False

    def test_subscribe_duplicate(self):
        r = requests.post(f"{BASE_URL}/api/subscribers", json={"email": CREATED_SUB_EMAIL})
        assert r.status_code == 200
        d = r.json()
        assert d["ok"] is True
        assert d["duplicate"] is True


# ---------- Chat (mocked) ----------

class TestChat:
    @pytest.mark.parametrize("msg,keyword", [
        ("how much can I afford", "afford"),
        ("what credit score do I need", "credit"),
        ("Tell me about FHA loan", "FHA"),
        ("random unrelated question xyz", "mortgage assistant"),
    ])
    def test_chat_canned(self, msg, keyword):
        r = requests.post(f"{BASE_URL}/api/chat", json={"message": msg, "history": []})
        assert r.status_code == 200, r.text
        d = r.json()
        assert d.get("mocked") is True
        assert isinstance(d.get("reply"), str) and len(d["reply"]) > 0


# ---------- Auth ----------

class TestAuth:
    def test_me_without_session(self):
        r = requests.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 401

    def test_admin_endpoints_without_session(self):
        for path in ["/api/admin/leads", "/api/admin/analytics", "/api/admin/leads/export"]:
            r = requests.get(f"{BASE_URL}{path}")
            assert r.status_code == 401, f"{path} returned {r.status_code}"

    def test_me_with_session_cookie(self, auth_cookies):
        r = requests.get(f"{BASE_URL}/api/auth/me", cookies=auth_cookies)
        assert r.status_code == 200, r.text
        d = r.json()
        assert "email" in d
        assert "user_id" in d

    def test_me_with_bearer_token(self, auth_headers):
        r = requests.get(f"{BASE_URL}/api/auth/me", headers=auth_headers)
        assert r.status_code == 200, r.text


# ---------- Admin endpoints ----------

class TestAdmin:
    def test_list_leads(self, auth_cookies):
        r = requests.get(f"{BASE_URL}/api/admin/leads", cookies=auth_cookies)
        assert r.status_code == 200, r.text
        leads = r.json()
        assert isinstance(leads, list)
        # Our created lead should be present
        emails = [l["email"] for l in leads]
        assert CREATED_TEST_EMAIL in emails

    def test_analytics(self, auth_cookies):
        r = requests.get(f"{BASE_URL}/api/admin/analytics", cookies=auth_cookies)
        assert r.status_code == 200, r.text
        d = r.json()
        for k in ["total_leads", "qualified_leads", "conversion_rate", "by_status", "by_source", "trend"]:
            assert k in d, f"missing {k}"
        assert isinstance(d["trend"], list) and len(d["trend"]) == 7
        assert d["total_leads"] >= 1

    def test_patch_lead(self, auth_cookies):
        assert CREATED_LEAD_IDS, "No lead created earlier"
        lead_id = CREATED_LEAD_IDS[0]
        r = requests.patch(
            f"{BASE_URL}/api/admin/leads/{lead_id}",
            json={"status": "qualified", "notes": "Followed up via phone"},
            cookies=auth_cookies,
        )
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["status"] == "qualified"
        assert d["notes"] == "Followed up via phone"

        # Verify persistence
        r2 = requests.get(f"{BASE_URL}/api/admin/leads", cookies=auth_cookies)
        match = next((l for l in r2.json() if l["id"] == lead_id), None)
        assert match is not None
        assert match["status"] == "qualified"

    def test_patch_lead_not_found(self, auth_cookies):
        r = requests.patch(
            f"{BASE_URL}/api/admin/leads/nonexistent-id-xxx",
            json={"status": "closed"},
            cookies=auth_cookies,
        )
        assert r.status_code == 404

    def test_export_csv(self, auth_cookies):
        r = requests.get(f"{BASE_URL}/api/admin/leads/export", cookies=auth_cookies)
        assert r.status_code == 200, r.text
        assert "text/csv" in r.headers.get("content-type", "")
        assert "attachment" in r.headers.get("content-disposition", "")
        text = r.text
        assert "id,first_name,last_name,email" in text.splitlines()[0]
        assert CREATED_TEST_EMAIL in text


# ---------- Cleanup ----------

def test_cleanup(mongo, admin_session):
    """Delete all data we created."""
    for lid in CREATED_LEAD_IDS:
        mongo.leads.delete_one({"id": lid})
    mongo.subscribers.delete_one({"email": CREATED_SUB_EMAIL})
    # Sanity
    assert mongo.subscribers.find_one({"email": CREATED_SUB_EMAIL}) is None
