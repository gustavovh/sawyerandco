/**
 * API Utilities
 *
 * Client-side utilities for calling Netlify serverless functions
 * and formatting values.
 */

/**
 * Call a Netlify serverless function
 *
 * @param {string} functionName - Name of the function (e.g., 'createLead')
 * @param {object} data - Payload to send to the function
 * @returns {Promise<object>} Response from the function
 */
export async function callNetlifyFunction(functionName, data) {
  try {
    const response = await fetch(`/.netlify/functions/${functionName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error || `Function call failed with status ${response.status}`
      );
    }

    return result;
  } catch (error) {
    console.error(`Error calling ${functionName}:`, error);
    throw error;
  }
}

/**
 * Format number as US currency
 *
 * @param {number} n - Number to format
 * @returns {string} Formatted currency string
 */
export const formatMoney = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n || 0);
