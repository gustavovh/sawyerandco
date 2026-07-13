# Production Deployment & Implementation Guide

## Overview

This is a **lead generation mortgage calculator** with NO backend. All calculations happen locally in React, and leads are sent directly to GoHighLevel via Netlify serverless functions.

### Architecture

```
React Frontend
    ↓
Local Calculator (no backend call)
    ↓
Display Result View
    ↓
React Lead Form
    ↓
Netlify Function: /.netlify/functions/createLead
    ↓
GoHighLevel REST API
    ↓
Create/Update Contact + Custom Fields + Tag
    ↓
Existing GHL Workflow (triggers automatically)
```

---

## Setup & Deployment

### 1. Environment Variables

Set these in your Netlify project settings (**Site Settings → Build & Deploy → Environment**):

```
GHL_API_KEY=<your-gohighlevel-api-key>
GHL_LOCATION_ID=<your-gohighlevel-location-id>
```

**How to get these:**
- Log in to GoHighLevel
- Go to **Settings → API Keys** (or **Account Settings → API**)
- Create a new API key (or copy existing)
- Copy your Location ID from **Settings → General** or **Account Settings**

### 2. Verify GoHighLevel Custom Fields

The serverless function expects these custom fields to exist in GoHighLevel. **DO NOT create new ones—use the existing field IDs.**

**Get your custom field IDs:**

1. In GoHighLevel, go to **Contacts**
2. Open any contact
3. Scroll to **Custom Fields** section
4. For each field, note its ID:
   - Annual Income
   - Monthly Debt
   - Down Payment
   - Credit Score
   - Estimated Home Price Low
   - Estimated Home Price High
   - Estimated Monthly Payment
   - Estimated Interest Rate
   - DTI Ratio
   - Loan Programs

**Update `netlify/functions/createLead.js`:**

Replace the custom field keys in the `customFields` object with your actual GoHighLevel field IDs:

```javascript
customFields: {
  "Annual_Income": payload.annual_income.toString(),           // Replace with your field ID
  "Monthly_Debt": payload.monthly_debt.toString(),             // Replace with your field ID
  "Down_Payment": payload.down_payment.toString(),             // Replace with your field ID
  "Credit_Score": payload.credit_score,                        // Replace with your field ID
  "Home_Price_Low": payload.home_price_low.toString(),         // Replace with your field ID
  "Home_Price_High": payload.home_price_high.toString(),       // Replace with your field ID
  "Monthly_Payment": payload.monthly_payment.toString(),       // Replace with your field ID
  "Estimated_Rate": payload.estimated_rate.toString(),         // Replace with your field ID
  "DTI_Ratio": payload.dti_ratio.toString(),                   // Replace with your field ID
  "Loan_Programs": payload.loan_programs,                      // Replace with your field ID
}
```

### 3. Verify the Tag

The function applies the tag **"Mortgage Calculator"** to each contact. Ensure this tag exists in GoHighLevel:

1. Go to **Settings → Tags**
2. Create the tag if it doesn't exist: **"Mortgage Calculator"**
3. The function will apply it automatically to all leads

### 4. Deploy

```bash
# Install dependencies
cd frontend
yarn install

# Build the frontend
yarn build

# Commit and push
git add .
git commit -m "Production: mortgage calculator with GoHighLevel integration"
git push origin main
```

Netlify will automatically:
- Detect the push
- Build React frontend from `frontend/` (via `netlify.toml`)
- Deploy serverless functions from `netlify/functions/`
- Set environment variables

---

## How It Works

### Calculator Flow (Local, No Backend)

1. **User fills out 5 questions:**
   - Annual Income
   - Monthly Debt
   - Down Payment
   - Credit Score (range)
   - State

2. **User clicks "Get My Estimate"**
   - React calls `calculateEstimate()` locally (NO backend call)
   - Generates realistic mortgage values based on:
     - Credit score → interest rate mapping
     - DTI ratio calculation
     - State-specific home price multipliers
   - Returns in < 1 second

3. **Result View displays:**
   - Home price range
   - Estimated monthly payment
   - Interest rate
   - Recommended loan programs
   - DTI ratio

### Lead Form Flow (GoHighLevel Integration)

4. **User sees the React Lead Form** (NOT an iframe)
   - First Name
   - Last Name
   - Email
   - Phone
   - Auto-populated from calculator (optional)

5. **User clicks Submit**
   - React validates form
   - Calls `/.netlify/functions/createLead`

6. **Netlify Function:**
   - Receives all calculator + form data
   - Searches for existing contact by email (to avoid duplicates)
   - Creates or updates contact in GoHighLevel
   - Populates standard fields: firstName, lastName, email, phone, state
   - Populates custom fields with calculator results
   - Applies "Mortgage Calculator" tag
   - **Existing GHL workflow triggers automatically**

7. **User sees success message**
   - "Application Submitted! A loan advisor will contact you within 24 hours."

---

## File Structure

```
frontend/
├── src/
│   ├── lib/
│   │   ├── api.js                    # Netlify function helper (callNetlifyFunction)
│   │   └── calculator.js             # Local mortgage calculation (calculateEstimate)
│   ├── components/
│   │   └── sections/
│   │       └── Calculator.jsx        # Main calculator + result + lead form
│   └── ...
├── package.json
└── ...

netlify/
└── functions/
    └── createLead.js                 # Serverless function for GoHighLevel

netlify.toml                           # Netlify configuration
.env.example                           # Environment variables template
DEPLOYMENT_GUIDE.md                    # This file
```

---

## Key Changes from Previous Version

### ✅ Removed

- ✓ FastAPI backend
- ✓ MongoDB
- ✓ Express server
- ✓ `axios` backend calls
- ✓ `REACT_APP_BACKEND_URL`
- ✓ `/api/calculate` endpoint
- ✓ `/api/leads` endpoint
- ✓ Backend business logic
- ✓ GoHighLevel iframe form

### ✅ Added

- ✓ Local calculator function (`lib/calculator.js`)
- ✓ Netlify serverless function (`netlify/functions/createLead.js`)
- ✓ React Lead Form (replaces iframe)
- ✓ Fetch-based API calls (no axios needed)
- ✓ Production error handling & loading states
- ✓ Success/error feedback with animations
- ✓ `netlify.toml` configuration

---

## Calculator Logic

**NOT mathematically accurate—generates realistic-looking estimates for lead qualification.**

### Interest Rate by Credit Score
- Below 580: 8.5%
- 580-619: 8.0%
- 620-679: 7.3%
- 680-739: 6.7%
- 740+: 6.0%

### DTI Limits (Debt-to-Income Ratio)
- Below 580: 43%
- 580-619: 45%
- 620-679: 48%
- 680-739+: 50%

### Home Price Calculation
1. Calculate max monthly payment: `monthlyIncome × dtiLimit - monthlyDebt`
2. Conservative estimate: 70% of max payment
3. Convert to loan amount using mortgage formula (30-year fixed)
4. Add down payment to get home price
5. Apply state multiplier (CA: 1.2x, TX: 0.95x, etc.)
6. Generate ±10% range around estimate
7. Round to nearest $5,000

### Loan Programs Recommended
- **All scores:** Conventional 30-Year, FHA Loan
- **580+:** VA Loan
- **620+:** USDA Loan
- **740+:** Jumbo Loan

---

## Testing

### Local Testing with Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# From repository root
netlify dev

# Visit: http://localhost:8888
# Test calculator and form
```

### Production Testing

1. Visit deployed site (https://your-site.netlify.app)
2. Fill calculator with test data
3. Click "Get My Estimate"
4. Verify estimate displays correctly
5. Fill lead form
6. Click "Submit"
7. Check GoHighLevel:
   - ✓ New/updated contact appears
   - ✓ Custom fields populated with calculator data
   - ✓ "Mortgage Calculator" tag applied
   - ✓ Existing workflow triggered

### Debugging

**Check Netlify function logs:**
- Netlify Dashboard → Deploys → Site name → Deploy → Functions tab
- Look for errors, especially API key issues

**Check browser console:**
- Open DevTools → Console
- Look for fetch errors or validation issues

**Test with unique email:**
- Use a test email that hasn't been used before
- This avoids duplicate detection issues

---

## Troubleshooting

### "Failed to create/update contact"

**Causes & Solutions:**
1. Check `GHL_API_KEY` and `GHL_LOCATION_ID` in Netlify settings
   - Netlify Dashboard → Site Settings → Build & Deploy → Environment
2. Verify API key has Contacts API access
   - Log into GoHighLevel → verify API key permissions
3. Check that location ID is correct (not account ID)
   - Location ID should be in Settings → General
4. Check Netlify function logs for exact error

### "Missing required field"

**Solution:**
- Verify React form is sending all required fields
- Check browser DevTools → Network → POST to createLead
- Verify payload includes all fields in createLead.js handler

### Lead doesn't appear in GoHighLevel

**Solution:**
1. Check Netlify function logs for errors
2. Verify custom field IDs match actual GoHighLevel field IDs
3. Try with an email that hasn't been used before
4. Check that API key has contact creation permissions

### Custom fields not populated

**Solution:**
1. Open `netlify/functions/createLead.js`
2. Verify custom field keys match your GoHighLevel field IDs
3. Redeploy: `git push origin main`
4. Test with fresh email

### Tag not applied

**Solution:**
1. Verify "Mortgage Calculator" tag exists in GoHighLevel
2. Check that function is reaching tag application code
3. Tag application is non-blocking—contact still created even if tag fails
4. Check Netlify function logs for tag errors

### Form submission timeout

**Solution:**
1. Check network speed and GoHighLevel API status
2. Verify all environment variables are set correctly
3. Try again—transient API timeouts can occur
4. Check Netlify function logs

---

## Security Best Practices

✅ **API Keys are NEVER exposed to React**
- Keys stored only in Netlify environment variables
- Serverless function reads from `process.env`
- React only calls the function endpoint (`/.netlify/functions/createLead`)

✅ **No hardcoded secrets**
- Use `.env.example` as template
- Set actual values in Netlify UI (never commit `.env`)

✅ **CORS handled by Netlify**
- Serverless functions automatically handle CORS
- React can safely POST to `/.netlify/functions/createLead`

✅ **Input validation**
- Netlify function validates all required fields
- React form validates before submission
- Email matching prevents duplicates

---

## GoHighLevel API Reference

**Official Docs:** https://docs.gohighlevel.com/api-docs/

### Endpoints Used

```
GET  /v1/contacts/search?locationId=X&email=Y
     → Search for existing contact by email

POST /v1/contacts?locationId=X
     → Create new contact

PUT  /v1/contacts/{id}?locationId=X
     → Update existing contact

POST /v1/contacts/{id}/tags?locationId=X
     → Apply tag to contact
```

### Standard Contact Fields

```javascript
{
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "+1234567890",
  state: "CA"
}
```

### Custom Fields Format

```javascript
customFields: {
  "field_id_1": "value_1",      // Use actual GoHighLevel field IDs
  "field_id_2": "value_2",
  // ... add all your custom fields
}
```

---

## Monitoring & Analytics

### Netlify Function Logs
- **Dashboard:** netlify.com → Site → Deploys → Functions
- Shows all serverless function executions
- Useful for debugging API errors

### GoHighLevel Logs
- **Dashboard:** GoHighLevel → (check if available in Settings)
- Tracks contact creation/updates
- Helps verify data mapping

### Analytics
- **Google Analytics:** Track calculator usage
- **GoHighLevel:** Track lead conversions
- **Netlify:** Monitor function performance/errors

---

## Performance Notes

- **Calculator:** ~1ms local calculation (no network latency)
- **Lead submission:** ~500-2000ms (depends on GoHighLevel API)
- **Contact deduplication:** Email search adds ~200-500ms

---

## Next Steps

1. ✅ Set environment variables in Netlify
2. ✅ Get custom field IDs from GoHighLevel
3. ✅ Update `netlify/functions/createLead.js` with field IDs
4. ✅ Verify "Mortgage Calculator" tag exists in GoHighLevel
5. ✅ Deploy: `git push origin main`
6. ✅ Test with real data
7. ✅ Monitor Netlify function logs
8. ✅ Verify leads appear in GoHighLevel

---

## Support & Troubleshooting

**For issues:**

1. Check Netlify function logs first (most informative)
2. Check browser console for client-side errors
3. Verify all environment variables are set
4. Verify GoHighLevel custom field IDs match code
5. Test with fresh email (avoids duplicates)
6. Check GoHighLevel API status

**Common mistakes to avoid:**

- ❌ Don't commit actual API keys (use `.env` locally, set in Netlify UI)
- ❌ Don't change custom field keys without updating function code
- ❌ Don't use iframe (already replaced with React form)
- ❌ Don't call backend endpoints (all local now)

---

**Last Updated:** 2026-07-13  
**Version:** 1.0.0  
**Status:** Production Ready  
**Backend:** None (Netlify Serverless + GoHighLevel)  
**Deployment:** Netlify  
