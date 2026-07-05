# Sprint 8 Run 13 — Teacher Lesson Completion Nudge

## Objective

Complete `8.1.9 — Teacher Lesson Completion Nudge` as a small, safe frontend step in the AI Teacher experience.

## Completed

- Updated `src/routes/_authenticated/teacher.index.tsx`.
- Added a `Finish strong` panel to the AI Teacher entry screen.
- Added three wrap-up prompt examples:
  - `Recap what I learned in this lesson.`
  - `Show my mistakes and corrected examples.`
  - `Give me one next step for tomorrow.`
- Kept the existing lesson creation flow, active lesson behavior, avatar picker, AI prompt behavior, and conversation mode unchanged.

## Guardrails Observed

- Worked only in the ShinGiTai Language repository.
- Did not touch Forge, ShinGiTai OpenAI, Hub, or unrelated repositories.
- No backend, schema, routing, dependency, or broad rewrite changes.
- One coherent objective: lesson wrap-up guidance.

## Local Validation

Run locally:

```bash
npm install
npm run lint
npm run build
```

## Next Planned Step

Continue Sprint 8 with `8.1.10 — Teacher Lesson Review Prompt Polish`, unless local tests reveal an issue that should be fixed first.
