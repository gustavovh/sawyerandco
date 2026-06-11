# Product Requirements Document — Northcrest Mortgage

## Original Problem Statement
Build a modern, high-converting Mortgage Lead Generation Landing Page for U.S. homebuyers, with an interactive affordability calculator gated by lead capture, AI chatbot, free downloadable resource, mortgage program cards, FAQ, SEO optimization, and an admin dashboard for lead management.

## User Choices (Dec 2025)
- MVP scope; all integrations (AI chat, email/SMS, CRM) are **MOCKED** (logged, not real)
- Admin auth: **Emergent-managed Google OAuth**
- Site language: English
- Visual design: agent decided (modern fintech, navy + electric blue, Outfit/Manrope)

## Architecture
- **Frontend**: React 19 + React Router 7 + Tailwind + shadcn/ui + framer-motion + recharts + sonner
- **Backend**: FastAPI + Motor (MongoDB async) + httpx
- **Auth**: Emergent OAuth, `session_token` httpOnly cookie + Bearer fallback, MongoDB session storage (7-day TTL)
- **Routes**:
  - `/` — Landing page (all marketing sections + calculator + chatbot)
  - `/admin/login` — Google sign-in
  - `/admin` — Protected dashboard
  - Hash-routed `#session_id=…` handled by AuthCallback synchronously during render

## What's Implemented (Dec 11, 2025)
- Hero with dual CTA, trust strip, floating estimate card, partner-style logos
- 6-step Affordability Calculator (income/debt/down payment/credit/state → lead capture)
- Lead capture form (First/Last/Email/Phone/ZIP) gates result view
- Result view: home price range, monthly payment, recommended loan programs, DTI, rate
- Trust section (4 badges + 3 testimonials)
- Benefits grid (4 cards)
- 2026 First-Time Homebuyer Guide lead-magnet (email subscription)
- 5 Loan Program cards (Conventional, FHA, VA, Jumbo, Investment)
- FAQ accordion (5 questions)
- Final CTA + Footer with mortgage disclaimer & legal links
- Floating AI Mortgage Assistant chatbot (mocked, keyword-based replies)
- SEO: title, meta description, OpenGraph, FinancialService schema, FAQPage schema
- Admin Dashboard: 4 metric cards, 7-day bar chart, source pie chart, lead table with search/status filter, inline status update, notes dialog, CSV export, logout
- **MOCKED**: AI chat replies (canned), email & SMS notifications (log only), CRM push (log only)

## Test Status
- Backend: 21/21 pytest pass (calculator math, lead/subscriber CRUD, auth gating, admin CRUD/analytics/CSV)
- Frontend: full landing + calculator + admin flow validated by testing agent

## Backlog (Not Implemented Yet)
- **P0**: Real email notifications (SendGrid/Resend)
- **P1**: Real SMS notifications (Twilio)
- **P1**: Real CRM push (HubSpot/Salesforce)
- **P1**: Real LLM-powered chatbot (Claude Sonnet 4.5 via Emergent LLM key)
- **P2**: Admin email allowlist for tenant restriction
- **P2**: Lead source tracking via UTM parameters
- **P2**: Lead scoring & auto-routing rules
- **P2**: A/B testing harness for hero copy & CTA placement
- **P2**: Conversion funnel analytics (drop-off per calculator step)
- **P3**: Multi-language support (Spanish)
- **P3**: Connect rate-lock API to show live rates
