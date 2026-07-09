# ShinGiTai Language — Productivity Sprint

Date: 2026-07-03
Scope: ShinGiTai Language only

## Sprint rule

This sprint prioritizes productivity, functionality, and stability after removing Lovable-specific project coupling. Branding changes are intentionally limited to avoid another broad rebuild.

## Completed in this cycle

- Replaced the Lovable-specific Google OAuth route with direct Supabase OAuth in `src/routes/auth.tsx`.
- Removed the obsolete Lovable integration wrapper from `src/integrations/lovable/index.ts`.
- Updated the Supabase setup error message so it no longer tells developers to connect Supabase through Lovable Cloud.

## Local validation required

Run these checks locally before merging or deploying:

```bash
npm install
npm run lint
npm run build
```

Then manually test:

1. Email sign up.
2. Email sign in.
3. Google OAuth redirect to `/dashboard`.
4. Missing Supabase env variables show a clear setup error.

## Follow-up backlog

- Remove `@lovable.dev/cloud-auth-js` from `package.json` and regenerate `package-lock.json` locally.
- Replace `@lovable.dev/vite-tanstack-config` with a standard TanStack Start/Vite config once the current build target is confirmed locally.
- Rename remaining public copy from `LinguaVerse AI` to ShinGiTai Language after the product naming decision is locked.
- Add a small developer setup guide for Supabase OAuth callback URLs.

## Not touched

- Forge repository.
- OpenAI repository.
- Hub repository.
- Broad UI redesign or rebrand.
