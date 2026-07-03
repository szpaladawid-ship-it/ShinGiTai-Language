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

Reason: this batch focuses only on visible product identity and should remain low-risk.

## Batch 3 — Lovable Runtime Audit

Goal: map all confirmed Lovable-related build/runtime touchpoints before removing anything dangerous.

Completed in this batch:

- Added `docs/LOVABLE_REMOVAL_PLAN.md`.
- Classified Lovable packages by risk.
- Identified Vite/TanStack config as the highest-risk dependency.
- Identified Lovable-specific error reporting as a low-risk replacement target.
- Identified root metadata and Supabase generated copy as safe cleanup targets.
- Defined safe phased removal order.

Reason: this batch is a map before the surgery.

## Batch 4 — Safe Internal Runtime Rebrand

Goal: replace low-risk internal Lovable/LinguaVerse references without removing build/runtime packages yet.

Completed in this batch:

- Added `src/lib/error-reporting.ts` as ShinGiTai-owned app error reporting.
- Replaced root route usage of `reportLovableError` with `reportAppError`.
- Updated root metadata to ShinGiTai Language.
- Updated author, Open Graph, Twitter and Apple Web App metadata.
- Updated Supabase missing environment message.
- Kept Lovable packages installed for now.

Not changed yet in this batch:

- Package removal.
- Vite config replacement.
- Auth implementation.
- Supabase runtime behavior.
- AI Gateway implementation.

Reason: this batch removes safe internal references while avoiding the high-risk Vite config extraction.

## Validation

```bash
npm install
npm run lint
npm run build
npm run dev
```

## Next Batch — Vite Config Extraction Spike

Planned changes:

- Create a separate spike branch.
- Replace generated Vite/TanStack config with explicit project-owned config.
- Preserve TanStack Start, React, Tailwind, Nitro, aliases and server entry behavior.
- Do not merge unless build and dev are confirmed locally.

This is the first high-risk Lovable removal step.
