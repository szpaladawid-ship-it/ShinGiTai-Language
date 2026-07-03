# ShinGiTai Language — Productivity Sprint Cycle 2

Date: 2026-07-03
Scope: ShinGiTai Language only

## Focus

This cycle continues the post-Lovable cleanup with a practical focus on authentication stability and product readiness.

The goal is not a broad rebrand. The goal is to make the app safer to run, easier to test, and less dependent on Lovable-specific runtime code.

## Completed

- Replaced the Google OAuth flow in `src/routes/auth.tsx` with direct Supabase OAuth.
- Removed the runtime import of `@/integrations/lovable/index` from the auth route.
- Preserved the existing user flow:
  - email sign-in
  - email sign-up
  - Google sign-in
  - redirect to `/dashboard`
- Kept visual/UI changes out of scope for this cycle.

## Why this matters

The app had already started moving away from Lovable, but the auth route still referenced the Lovable integration. That means the app could still fail if the old wrapper was deleted or unavailable.

This cycle removes that runtime dependency from the Google login path and makes Supabase the single auth provider entry point in the route.

## Local validation checklist

Run locally before merging:

```bash
npm install
npm run lint
npm run build
npm run dev
```

Manual checks:

- Open `/auth`.
- Toggle between sign-in and sign-up.
- Confirm email fields and password visibility toggle still work.
- Test Google sign-in with Supabase OAuth configured.
- Confirm successful redirect to `/dashboard`.
- Confirm failed auth shows a toast error instead of a blank page.

## Known follow-up

The repository still includes Lovable package references in `package.json` and Lovable-based Vite config. Those should be removed only after replacing the Vite/TanStack config safely and testing the local build.

Do not remove those config dependencies blindly; that can break the app bootstrap.

## Next recommended cycle

Productivity/functionality work:

1. Add a small protected dashboard skeleton if it is missing.
2. Add a basic daily learning checklist or learning path preview.
3. Add a lightweight product readiness checklist to documentation.
4. Only then continue dependency cleanup.
