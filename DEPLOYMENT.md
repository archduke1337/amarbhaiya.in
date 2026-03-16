# Production Deployment (Vercel + amarbhaiya.in)

## 1) Vercel Project Settings

- Framework preset: Next.js
- Root directory: project root
- Build command: npm run build
- Install command: npm install
- Output: default Next.js output
- Node runtime: default from Vercel (latest supported)

## 2) Domain Setup

- Add custom domain: amarbhaiya.in
- Add redirect domain (optional): www.amarbhaiya.in -> amarbhaiya.in
- Verify DNS in Vercel until certificate is issued

## 3) Environment Variables (Production)

Set all variables from .env.example in Vercel Production scope.

Critical values:
- NEXT_PUBLIC_APP_URL=https://amarbhaiya.in
- NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
- NEXT_PUBLIC_APPWRITE_PROJECT_ID=<project-id>
- APPWRITE_API_KEY=<server-key>
- APPWRITE_DATABASE_ID=<database-id>
- WEBHOOK_ENROLLMENT_OWNER=next or appwrite-function

If using webhook app-secret hardening, set:
- RAZORPAY_WEBHOOK_APP_SECRET
- PHONEPE_WEBHOOK_APP_SECRET

### Vercel Sensitive Variable Limitation

Vercel does not allow creating Sensitive Environment Variables with target `development`.
Use this model:

- development: keep secrets in local `.env.local`
- preview: add secrets in Vercel with target `preview`
- production: add secrets in Vercel with target `production`

If you are using CLI, create two entries for each secret (preview + production), not development.

## 4) Appwrite Console Settings

- Add web platform for https://amarbhaiya.in
- Add preview platform if needed (optional): https://<preview-domain>.vercel.app
- Verify API key scopes include Databases and Storage as required by server routes/scripts
- Keep collection and bucket IDs exactly matching deployed env

## 5) Predeploy Verification

Run locally with production-like env loaded:

- npm run check:prod-env
- npm run check:appwrite-events
- npm run check:appwrite-schema-drift
- npm run build

## 6) Deploy

- Push to main branch connected to Vercel
- Confirm deployment succeeds
- Smoke test:
  - login/register/logout
  - enrollment + progress write
  - payment webhook flow
  - stream token endpoint

## 7) Post-Deploy Monitoring

- Check Vercel Functions logs for /api/webhooks/* and /api/stream/token
- Confirm no 401/403 spikes in protected API routes
- Re-run schema/event drift checks after major schema updates
