/**
 * Netlify Serverless Function: createLead
 *
 * Creates or updates a contact in HighLevel CRM using the official upsert endpoint
 * and applies the "Mortgage Calculator" tag.
 *
 * Environment variables required:
 * - GHL_API_KEY: HighLevel API key (Bearer token)
 * - GHL_LOCATION_ID: HighLevel location ID
 *
 * API Documentation:
 * https://developers.leadconnectorhq.com/docs/contacts
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const GHL_BASE_URL = "https://services.leadconnectorhq.com";

/**
 * Custom Field ID Mapping
 *
 * IMPORTANT: Replace these values with the actual custom field IDs from your
 * HighLevel account. To find them:
 *
 * 1. Log into HighLevel dashboard
 * 2. Go to Contacts → Open any contact
 * 3. Scroll to "Custom Fields" section
 * 4. Hover over or inspect each field to get its ID
 * 5. Replace the placeholder values below
 *
 * Example: If the "Annual Income" field ID is "cf_12345", use:
 * annual_income: "cf_12345"
 */
const FIELD_IDS = {
  annual_income: "REPLACE_ME", // Custom field ID for annual income
  monthly_debt: "REPLACE_ME", // Custom field ID for monthly debt
  down_payment: "REPLACE_ME", // Custom field ID for down payment
  credit_score: "REPLACE_ME", // Custom field ID for credit score
  home_price_low: "REPLACE_ME", // Custom field ID for estimated home price low
  home_price_high: "REPLACE_ME", // Custom field ID for estimated home price high
  monthly_payment: "REPLACE_ME", // Custom field ID for estimated monthly payment
  estimated_rate: "REPLACE_ME", // Custom field ID for estimated interest rate
  dti_ratio: "REPLACE_ME", // Custom field ID for DTI ratio
  loan_programs: "REPLACE_ME", // Custom field ID for loan programs
};

/**
 * Tag to apply to all leads
 * Must already exist in HighLevel account
 */
const LEAD_TAG = "Mortgage Calculator";

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Log request details without exposing sensitive data
 */
function logRequest(method, endpoint, statusCode, details) {
  const sanitizedEndpoint = endpoint.replace(/[&\?].*/, ""); // Remove query params
  console.log(
    `[${new Date().toISOString()}] ${method} ${sanitizedEndpoint} - Status: ${statusCode}`,
    details
  );
}

/**
 * Make authenticated request to HighLevel API
 */
async function makeGHLRequest(method, endpoint, body = null, apiKey) {
  const url = `${GHL_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      Version: "2021-07-28", // Required version header for HighLevel API
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    logRequest(method, url, response.status, {
      success: response.ok,
      endpoint: endpoint.split("?")[0],
    });

    return {
      ok: response.ok,
      status: response.status,
      data: await response.json(),
    };
  } catch (error) {
    console.error(`[Network Error] ${method} ${endpoint}:`, error.message);
    throw error;
  }
}

/**
 * Build custom fields array in HighLevel format
 * Converts calculator data to HighLevel custom fields array
 */
function buildCustomFieldsArray(payload) {
  const customFields = [];

  // Map each calculator field to its HighLevel custom field
  // Only include fields that have been configured with actual IDs

  if (FIELD_IDS.annual_income !== "REPLACE_ME") {
    customFields.push({
      id: FIELD_IDS.annual_income,
      fieldValue: payload.annual_income.toString(),
    });
  }

  if (FIELD_IDS.monthly_debt !== "REPLACE_ME") {
    customFields.push({
      id: FIELD_IDS.monthly_debt,
      fieldValue: payload.monthly_debt.toString(),
    });
  }

  if (FIELD_IDS.down_payment !== "REPLACE_ME") {
    customFields.push({
      id: FIELD_IDS.down_payment,
      fieldValue: payload.down_payment.toString(),
    });
  }

  if (FIELD_IDS.credit_score !== "REPLACE_ME") {
    customFields.push({
      id: FIELD_IDS.credit_score,
      fieldValue: payload.credit_score,
    });
  }

  if (FIELD_IDS.home_price_low !== "REPLACE_ME") {
    customFields.push({
      id: FIELD_IDS.home_price_low,
      fieldValue: payload.home_price_low.toString(),
    });
  }

  if (FIELD_IDS.home_price_high !== "REPLACE_ME") {
    customFields.push({
      id: FIELD_IDS.home_price_high,
      fieldValue: payload.home_price_high.toString(),
    });
  }

  if (FIELD_IDS.monthly_payment !== "REPLACE_ME") {
    customFields.push({
      id: FIELD_IDS.monthly_payment,
      fieldValue: payload.monthly_payment.toString(),
    });
  }

  if (FIELD_IDS.estimated_rate !== "REPLACE_ME") {
    customFields.push({
      id: FIELD_IDS.estimated_rate,
      fieldValue: payload.estimated_rate.toString(),
    });
  }

  if (FIELD_IDS.dti_ratio !== "REPLACE_ME") {
    customFields.push({
      id: FIELD_IDS.dti_ratio,
      fieldValue: payload.dti_ratio.toString(),
    });
  }

  if (FIELD_IDS.loan_programs !== "REPLACE_ME") {
    customFields.push({
      id: FIELD_IDS.loan_programs,
      fieldValue: payload.loan_programs,
    });
  }

  return customFields;
}

/**
 * Build contact payload for upsert using HighLevel format
 * Uses standard contact fields and custom fields array
 */
function buildContactPayload(payload) {
  return {
    email: payload.email,
    firstName: payload.first_name,
    lastName: payload.last_name,
    phone: payload.phone,
    state: payload.state,
    customFields: buildCustomFieldsArray(payload),
  };
}

/**
 * Extract contact ID from upsert response
 * Handles different response formats and validates before returning
 *
 * HighLevel upsert endpoint returns: { contact: { id: "...", ... } }
 */
function extractContactId(responseData) {
  // Expected format: { contact: { id: "contact_id", ... } }
  if (
    responseData &&
    responseData.contact &&
    responseData.contact.id &&
    typeof responseData.contact.id === "string"
  ) {
    return responseData.contact.id;
  }

  // Fallback: check for alternate formats
  if (responseData && responseData.id && typeof responseData.id === "string") {
    return responseData.id;
  }

  // If we got here, response format was unexpected
  console.error(
    "[Contact] Unexpected upsert response format:",
    JSON.stringify(responseData)
  );
  return null;
}

/**
 * Upsert contact in HighLevel
 * Creates new contact or updates existing contact matched by email
 */
async function upsertContact(contactPayload, locationId, apiKey) {
  try {
    console.log(
      `[Contact] Upserting contact with email: ${contactPayload.email}`
    );

    const response = await makeGHLRequest(
      "POST",
      `/contacts/upsert?locationId=${locationId}`,
      contactPayload,
      apiKey
    );

    if (!response.ok) {
      throw new Error(
        `Failed to upsert contact: ${response.status} - ${
          response.data.message || JSON.stringify(response.data)
        }`
      );
    }

    // Extract contact ID from response, handling various response formats
    const contactId = extractContactId(response.data);

    if (!contactId) {
      console.error(
        "[Contact] Unable to extract contact ID from upsert response"
      );
      throw new Error(
        "Contact upsert succeeded but response format was invalid. Unable to retrieve contact ID."
      );
    }

    console.log(`[Contact] Successfully upserted contact: ${contactId}`);
    return contactId;
  } catch (error) {
    console.error(`[Contact] Error upserting contact:`, error.message);
    throw error;
  }
}

/**
 * Apply tag to contact
 */
async function applyTag(contactId, locationId, apiKey) {
  try {
    console.log(
      `[Tag] Applying tag "${LEAD_TAG}" to contact: ${contactId}`
    );

    const response = await makeGHLRequest(
      "POST",
      `/contacts/${contactId}/tags?locationId=${locationId}`,
      {
        tags: [LEAD_TAG],
      },
      apiKey
    );

    if (!response.ok) {
      console.warn(
        `[Tag] Failed to apply tag, status ${response.status}:`,
        response.data
      );
      // Non-blocking: tag application failure doesn't stop lead creation
      return false;
    }

    console.log(`[Tag] Successfully applied tag to contact: ${contactId}`);
    return true;
  } catch (error) {
    console.error(`[Tag] Error applying tag:`, error.message);
    // Non-blocking: continue even if tag fails
    return false;
  }
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

exports.handler = async (event) => {
  console.log(`[Handler] Received ${event.httpMethod} request`);

  // Only accept POST requests
  if (event.httpMethod !== "POST") {
    console.warn(`[Validation] Invalid HTTP method: ${event.httpMethod}`);
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed. Use POST." }),
    };
  }

  try {
    // Parse request body
    let payload;
    try {
      payload = JSON.parse(event.body || "{}");
    } catch (error) {
      console.error(`[Validation] Invalid JSON payload:`, error.message);
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Invalid JSON in request body" }),
      };
    }

    console.log(`[Validation] Validating required fields`);

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

    const missingFields = required.filter(
      (field) => payload[field] === undefined || payload[field] === null
    );

    if (missingFields.length > 0) {
      console.warn(`[Validation] Missing required fields:`, missingFields);
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Missing required fields",
          missing: missingFields,
        }),
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      console.warn(`[Validation] Invalid email format:`, payload.email);
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Invalid email format" }),
      };
    }

    console.log(`[Validation] All required fields present and valid`);

    // Get API credentials from environment
    const apiKey = process.env.GHL_API_KEY;
    const locationId = process.env.GHL_LOCATION_ID;

    if (!apiKey || !locationId) {
      console.error(
        `[Config] Missing environment variables - GHL_API_KEY: ${!!apiKey}, GHL_LOCATION_ID: ${!!locationId}`
      );
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Server configuration error. Missing API credentials.",
        }),
      };
    }

    console.log(`[Init] Starting lead processing for email: ${payload.email}`);

    // Step 1: Build contact payload using standard fields and custom fields array
    const contactPayload = buildContactPayload(payload);

    // Step 2: Upsert contact (create if new, update if exists by email)
    const contactId = await upsertContact(
      contactPayload,
      locationId,
      apiKey
    );

    // Step 3: Apply tag to contact (non-blocking)
    await applyTag(contactId, locationId, apiKey);

    // Success response
    console.log(`[Success] Lead processing completed for contact: ${contactId}`);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        message: "Lead created/updated successfully",
        contactId: contactId,
      }),
    };
  } catch (error) {
    console.error(
      `[Error] Unexpected error during processing:`,
      error.message
    );

    // Return generic error to client (don't expose internal details)
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Failed to process lead. Please try again later.",
      }),
    };
  }
};
