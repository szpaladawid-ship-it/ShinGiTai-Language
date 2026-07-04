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

Scope:
- Add a dashboard card that tells the user what to continue next.
- Use static/demo data first if user progress data is not ready.
- Keep it UI-only unless existing progress data is already available.

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

Completed 7.2.1 as a bounded landing-page branding update.

Changed files:
- `src/routes/index.tsx`
- `docs/sprints/sprint-7-execution.md`

Local validation still required because this run only used the GitHub connector:

```bash
npm install
npm run lint
npm run build
```

## Next Action

Start `7.2.2 — Continue Learning Card` by locating the dashboard route/component and adding a UI-only card with static/demo learning-progress data. Do not add backend schema changes yet.
