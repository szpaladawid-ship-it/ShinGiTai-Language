# Sprint 7 Execution Log — Productivity Foundation

## Goal

Make ShinGiTai Language feel more like a guided learning product after login, not just a collection of disconnected language-learning features.

Sprint 7 is intentionally split into small, safe changes so the repository stays stable and every change can be reviewed, tested, and reverted independently.

## Current Sprint Order

### 7.2.1 — Rebranding Foundation

Status: Completed in first implementation pass.

Scope:
- Replace visible `LinguaVerse` branding with `ShinGiTai Language` in small batches.
- Start with safe identity surfaces: metadata, header/logo text, footer, and hero copy.
- Avoid changing auth, routing, Supabase, or dependencies.

Implemented:
- Updated landing-page metadata title and Open Graph title.
- Updated primary logo text from `LinguaVerse` to `ShinGiTai Language`.
- Updated hero copy, language-section copy, image alt text, final CTA, and footer copyright.
- Kept routing, auth, Supabase, pricing structure, dependencies, and feature layout unchanged.

Acceptance:
- Landing page no longer exposes old brand in primary UI copy.
- Build should still pass with no functional behavior changes.

Recommended local checks:

```bash
npm install
npm run lint
npm run build
```

### 7.2.2 — Continue Learning Card

Status: In progress.

Scope:
- Add a dashboard card that tells the user what to continue next.
- Use static/demo data first if user progress data is not ready.
- Keep it UI-only unless existing progress data is already available.

Implemented:
- Added reusable `ContinueLearningCard` component in `src/components/dashboard/continue-learning-card.tsx`.
- Component supports loading state, empty state, active course state, and a recommended next-step CTA.
- No backend, schema, auth, routing, or dependency changes were made.

Remaining:
- Wire the component into `src/routes/_authenticated/dashboard.tsx` below the level progress card.
- Pass the newest active course from the existing `courses` query.
- Replace the remaining dashboard header brand string with `ShinGiTai Language` during the same small dashboard touch-up.

Acceptance:
- User can instantly see the next recommended learning action.
- No backend or schema migration required.

### 7.2.3 — Today's Focus

Scope:
- Add a focused daily learning block.
- Include a compact plan such as lesson, flashcards, and speaking practice.
- Keep the first version deterministic and stable.

Acceptance:
- Dashboard answers: "What should I do today?"

### 7.2.4 — Practice Stack

Scope:
- Rework scattered quick actions into an ordered practice stack.
- Prioritize learning flow: lesson → flashcards → speaking → review.

Acceptance:
- Dashboard feels more like a guided system than a launcher.

### 7.2.5 — UX Cleanup

Scope:
- Small spacing, CTA, label, and hierarchy improvements.
- No broad component rewrites.

Acceptance:
- Dashboard is cleaner and easier to scan.

## Guardrails

- One coherent objective per commit.
- No Forge, OpenAI, Hub, or unrelated repository changes.
- No large rewrites without a clear reason.
- Prefer demo/static data before backend complexity.
- Keep the app buildable after each change.

## Latest Run Summary

Started 7.2.2 as a bounded dashboard productivity update.

Changed files:
- `src/components/dashboard/continue-learning-card.tsx`
- `docs/sprints/sprint-7-execution.md`

Local validation still required because this run only used the GitHub connector:

```bash
npm install
npm run lint
npm run build
```

Note:
- The reusable card component is committed, but dashboard integration still needs the next small code update. A direct full-file dashboard update was blocked by the GitHub connector safety layer, so the safer next move is a targeted local patch or a smaller dashboard-only connector update.

## Next Action

Finish `7.2.2 — Continue Learning Card` by importing `ContinueLearningCard` into `src/routes/_authenticated/dashboard.tsx`, deriving the newest active course from the existing `courses` query, rendering the card below level progress, and updating the remaining dashboard header brand text.