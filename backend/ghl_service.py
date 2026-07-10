 import os
import httpx

GHL_API_KEY = os.getenv("pit-52cdd6ab-def6-4836-8bf6-ded0803b4687")
GHL_LOCATION_ID = os.getenv("kbkSClcaSntRoJC3weuY")


async def create_contact(lead):

    headers = {
        "Authorization": f"Bearer {pit-52cdd6ab-def6-4836-8bf6-ded0803b4687}",
        "Version": "2021-07-28",
        "Content-Type": "application/json"
    }

    payload = {
        "locationId": kbkSClcaSntRoJC3weuY,
        "firstName": lead.first_name,
        "lastName": lead.last_name,
        "email": lead.email,
        "phone": lead.phone,
    }

    async with httpx.AsyncClient(timeout=20) as client:

        response = await client.post(
            "https://services.leadconnectorhq.com/contacts/",
            headers=headers,
            json=payload
        )

        response.raise_for_status()

        return response.json()
