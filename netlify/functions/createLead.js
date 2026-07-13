/**
 * Netlify Serverless Function: createLead
 * 
 * Creates or updates a contact in GoHighLevel CRM and applies the "Mortgage Calculator" tag.
 * 
 * Environment variables required:
 * - GHL_API_KEY: GoHighLevel API key
 * - GHL_LOCATION_ID: GoHighLevel location ID
 * 
 * API Documentation:
 * https://docs.gohighlevel.com/api-docs/
 */

const GHL_BASE_URL = "https://rest.gohighlevel.com/v1";

/**
 * Handler for creating/updating leads
 */
exports.handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const payload = JSON.parse(event.body);

    // Validate required fields
    const required = [
      "first_name",
      "last_name",
      "email",
      "phone",
      "state",
      "annual_income",
      "monthly_debt",
      "down_payment",
      "credit_score",
      "home_price_low",
      "home_price_high",
      "monthly_payment",
      "estimated_rate",
      "dti_ratio",
      "loan_programs",
    ];

    for (const field of required) {
      if (payload[field] === undefined || payload[field] === null) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `Missing required field: ${field}` }),
        };
      }
    }

    // Get API credentials from environment
    const apiKey = process.env.GHL_API_KEY;
    const locationId = process.env.GHL_LOCATION_ID;

    if (!apiKey || !locationId) {
      console.error("Missing GHL_API_KEY or GHL_LOCATION_ID");
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Server configuration error",
        }),
      };
    }

    // Step 1: Search for existing contact by email
    let contactId = null;
    try {
      const searchResponse = await fetch(
        `${GHL_BASE_URL}/contacts/search?locationId=${locationId}&email=${encodeURIComponent(payload.email)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        if (searchData.contacts && searchData.contacts.length > 0) {
          contactId = searchData.contacts[0].id;
          console.log(`Found existing contact: ${contactId}`);
        }
      }
    } catch (error) {
      console.error("Error searching for existing contact:", error);
    }

    // Step 2: Create or update contact
    const contactPayload = {
      firstName: payload.first_name,
      lastName: payload.last_name,
      email: payload.email,
      phone: payload.phone,
      state: payload.state,
      customFields: {
        // Map custom fields using their IDs
        // NOTE: Replace these with actual custom field IDs from your GoHighLevel account
        "Annual_Income": payload.annual_income.toString(),
        "Monthly_Debt": payload.monthly_debt.toString(),
        "Down_Payment": payload.down_payment.toString(),
        "Credit_Score": payload.credit_score,
        "Home_Price_Low": payload.home_price_low.toString(),
        "Home_Price_High": payload.home_price_high.toString(),
        "Monthly_Payment": payload.monthly_payment.toString(),
        "Estimated_Rate": payload.estimated_rate.toString(),
        "DTI_Ratio": payload.dti_ratio.toString(),
        "Loan_Programs": payload.loan_programs,
      },
    };

    let contactResponse;
    if (contactId) {
      // Update existing contact
      contactResponse = await fetch(
        `${GHL_BASE_URL}/contacts/${contactId}?locationId=${locationId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactPayload),
        }
      );
    } else {
      // Create new contact
      contactResponse = await fetch(
        `${GHL_BASE_URL}/contacts?locationId=${locationId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactPayload),
        }
      );
    }

    if (!contactResponse.ok) {
      const errorData = await contactResponse.json();
      console.error("Contact creation/update error:", errorData);
      return {
        statusCode: contactResponse.status,
        body: JSON.stringify({
          error: "Failed to create/update contact",
          details: errorData,
        }),
      };
    }

    const contactData = await contactResponse.json();
    const finalContactId = contactData.contact?.id || contactId;

    if (!finalContactId) {
      console.error("No contact ID returned from API");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "No contact ID returned" }),
      };
    }

    // Step 3: Apply the "Mortgage Calculator" tag
    try {
      const tagResponse = await fetch(
        `${GHL_BASE_URL}/contacts/${finalContactId}/tags?locationId=${locationId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tags: ["Mortgage Calculator"],
          }),
        }
      );

      if (!tagResponse.ok) {
        const errorData = await tagResponse.json();
        console.error("Tag application error:", errorData);
        // Non-blocking: continue even if tag fails
      }
    } catch (error) {
      console.error("Error applying tag:", error);
      // Non-blocking: continue even if tag fails
    }

    // Success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Lead created/updated successfully",
        contactId: finalContactId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
      }),
    };
  }
};
