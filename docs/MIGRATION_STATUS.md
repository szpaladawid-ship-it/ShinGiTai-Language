# ShinGiTai Language Migration Status

Status: Active  
Owner: ArticSakuraTech / ShinGiTai Holding Groupe  
Last updated: 2026-07-03

## Purpose

This document tracks the controlled migration of ShinGiTai Language from a generated prototype into a ShinGiTai-owned product foundation.

The project must remain testable after every major batch.

## Current Branch

`cleanup/rebrand-foundation`

## Batch 1 — Rebrand Foundation

Goal: establish ShinGiTai identity in repository metadata and documentation without touching fragile runtime systems yet.

Completed in this batch:

- Renamed package identity from `tanstack_start_ts` to `shingitai-language`.
- Added a product README for ShinGiTai Language.
- Replaced generator-focused agent instructions with ShinGiTai project rules.
- Documented migration direction and test commands.

Reason: this batch was intentionally low-risk and should not break the current build.

## Batch 2 — Visible UI Rebrand

Goal: remove visible LinguaVerse identity from the public landing page and replace it with ShinGiTai Language.

Completed in this batch:

- Replaced landing page meta title with ShinGiTai Language.
- Replaced Open Graph title and description.
- Rebranded header/logo text to ShinGiTai Language.
- Rebranded hero copy.
- Rebranded language section copy.
- Rebranded final CTA copy.
- Rebranded footer copyright.
- Updated image alt text.
- Kept routes, auth, Supabase and AI logic untouched.

Not changed yet in this batch:

- Lovable runtime dependencies.
- Lovable Vite/TanStack configuration.
- Auth implementation.
- Supabase integration.
- AI Gateway implementation.
- Final logo asset.
- Full design-system color update.

Reason: this batch focuses only on visible product identity and should remain low-risk.

## Validation

```bash
npm install
npm run lint
npm run build
npm run dev
```

## Later Batch — Remove Lovable

Planned changes:

- Replace Lovable Vite config with explicit project-owned Vite/TanStack config.
- Remove `@lovable.dev/cloud-auth-js` when auth is replaced or isolated.
- Remove Lovable-specific folders and comments.
- Regenerate lockfiles after dependency cleanup.

This should happen after visible branding is stable.
