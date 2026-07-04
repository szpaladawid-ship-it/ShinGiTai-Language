# Sprint 8 Execution Log — Learning Experience

## Goal

Improve the actual learning experience after the dashboard foundation is in place.

Sprint 8 should make ShinGiTai Language feel more like a guided learning product inside lessons, practice, review, and speaking flows — without broad rewrites or premature backend complexity.

## Guardrails

- Work only in the ShinGiTai Language repository.
- Do not touch Forge, ShinGiTai OpenAI, Hub, or unrelated repositories.
- One coherent objective per implementation pass.
- Prefer UI and copy improvements before backend changes.
- Reuse existing routes, data, and components where possible.
- Avoid schema, auth, dependency, or routing changes unless the sprint item explicitly requires them.
- Keep the app buildable after every change.

## Current Sprint Order

### 8.1.1 — AI Teacher Entry UX

Status: Completed in implementation pass.

Scope:
- Improve the empty entry state for the AI Teacher area.
- Help users understand what the AI Teacher does before they start or select a lesson.
- Keep the change limited to the existing teacher index route.
- Avoid backend, schema, auth, dependency, and conversation-flow changes.

Implemented:
- Reworked `src/routes/_authenticated/teacher.index.tsx` into a stronger entry panel.
- Added a clear `AI Teacher` label and `Start a guided language lesson` headline.
- Added three compact benefit cards: structured lesson, active exercises, and voice support.
- Kept avatar selection available in the entry state.
- Updated the start hint from a generic lesson selector message to `Use New lesson to begin`.
- No Supabase query, server function, route destination, auth, dependency, schema, or cross-repository changes were made.

Acceptance:
- AI Teacher entry screen explains the lesson value before the user starts.
- Users can see what to expect from a lesson at a glance.
- Existing lesson creation, lesson selection, avatar picker, and conversation behavior remain unchanged.
- The change stays frontend-only and bounded to the entry experience.

Recommended local checks:

```bash
npm install
npm run lint
npm run build
```

## Latest Run Summary

Finished `8.1.1 — AI Teacher Entry UX` as a bounded learning-experience entry update.

Changed files:
- `src/routes/_authenticated/teacher.index.tsx`
- `docs/sprints/sprint-8-execution.md`

Implementation notes:
- The Teacher empty state now feels more like a guided learning product instead of a plain placeholder.
- The change did not touch backend logic, teacher conversations, Supabase, auth, dependencies, schema, Forge, OpenAI, Hub, or other repositories.

Local validation still required because this run only used the GitHub connector:

```bash
npm install
npm run lint
npm run build
```

## Next Action

Continue Sprint `8.1 — Learning Experience Foundation` with `8.1.2 — New Lesson Dialog Guidance` using existing lesson creation behavior only.
