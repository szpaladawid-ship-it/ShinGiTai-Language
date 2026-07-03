# ShinGiTai Language - Lovable Removal Plan

Status: Active Audit
Owner: ArticSakuraTech / ShinGiTai Holding Groupe
Last updated: 2026-07-03

## Purpose

This document tracks the safe removal of Lovable-related build and runtime dependencies from ShinGiTai Language.

The goal is to move the project from a generated prototype to a ShinGiTai-owned product foundation without breaking the app.

## Summary

Lovable is still present in the project in three areas:

1. Build configuration.
2. Runtime/cloud auth dependency.
3. Error reporting and generated copy.

The visible landing page has already been rebranded to ShinGiTai Language, but internal references remain.

## Confirmed Touchpoints

### package.json

Confirmed packages:

- @lovable.dev/cloud-auth-js
- @lovable.dev/vite-tanstack-config

Classification:

- cloud-auth-js: inspect before removal
- vite-tanstack-config: replace with project-owned Vite/TanStack config

Risk:

- cloud-auth-js: medium
- vite-tanstack-config: high

### vite.config.ts

Current state:

- Imports defineConfig from @lovable.dev/vite-tanstack-config.
- Keeps a custom server entry named server.

Risk: high.

Reason:

The current config package appears to provide several important build features, including TanStack Start setup, React, Tailwind, path aliases, Nitro defaults, dedupe settings, env handling, and dev helpers.

Replacement must be tested on a separate branch.

### src/lib/lovable-error-reporting.ts

Current state:

- Uses a Lovable-specific browser event object.
- Exports reportLovableError.

Risk: low to medium.

Replacement:

- Create src/lib/error-reporting.ts.
- Export reportAppError.
- Use local console reporting now.
- Leave room for ShinGiTai Analytics, Sentry, PostHog, or OpenTelemetry later.

### src/routes/__root.tsx

Current state:

- Imports reportLovableError.
- Calls it inside the root error component.
- Root meta still contains LinguaVerse identity.

Risk: low.

Planned change:

- Replace reportLovableError with reportAppError.
- Update root metadata to ShinGiTai Language.

### src/integrations/supabase/client.ts

Current state:

- Contains generated copy.
- Missing environment message still mentions Lovable Cloud.

Risk: low.

Planned change:

- Replace message with ShinGiTai/local environment instructions.
- Keep runtime behavior unchanged.

### AGENTS.md

Current state:

- Already replaced with ShinGiTai project rules.

Status: done.

### Landing page

Current state:

- Rebranded from LinguaVerse to ShinGiTai Language.

Status: done, needs visual/local test.

## Safe Removal Order

### Phase 1 - Safe internal rebrand

No package removal.

Actions:

- Replace Lovable error reporting with ShinGiTai-owned error reporting.
- Update root metadata.
- Update Supabase environment error copy.
- Keep all current dependencies installed.

Validation:

- npm install
- npm run lint
- npm run build
- npm run dev

### Phase 2 - Vite config replacement spike

Separate branch only.

Actions:

- Replace the generated Vite config package with explicit project-owned config.
- Preserve current server entry behavior.
- Preserve build/dev behavior.

Validation:

- npm run lint
- npm run build
- npm run dev

Success condition:

- App builds and runs without the generated Vite config package.

### Phase 3 - Runtime dependency cleanup

Actions:

- Remove cloud-auth dependency only after confirming no active import path needs it.
- Regenerate lockfile.
- Confirm Supabase auth still works.
- Confirm build output no longer includes Lovable bundles.

### Phase 4 - Final cleanup

Actions:

- Search codebase for Lovable-related words and globals.
- Confirm package.json has no Lovable packages.
- Confirm no user-facing references remain.

## Risk Register

High risk:

- Replacing the Vite/TanStack config package.

Medium risk:

- Removing cloud-auth package.

Low risk:

- Replacing error reporting.
- Updating root metadata.
- Updating Supabase error copy.

## Recommended Next Batch

Batch 4 should be a safe internal rebrand batch.

Scope:

- Create src/lib/error-reporting.ts.
- Replace reportLovableError with reportAppError.
- Update root route metadata.
- Update Supabase error text.
- Do not remove Lovable packages yet.

This creates one safe step before the high-risk Vite config extraction.
