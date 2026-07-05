# Sprint 8 Run 17 — Teacher Exercise Prompt Clarity

## Sprint item

8.2.3 — Lesson Exercise Prompt Clarity

## Objective

Make the AI Teacher lesson flow clearer when the learner is ready for a focused practice exercise, without changing backend behavior, AI prompts, routing, persistence, schema, auth, dependencies, or unrelated repositories.

## Completed work

- Updated `src/components/tutor-chat.tsx` only.
- Added `teacherExercisePrompt(languageLabel, level)` for a concise exercise request template.
- Added an early-lesson `Need the next exercise?` nudge after a teacher reply.
- The nudge appears only in AI Teacher mode, only after the teacher has replied, and before the later review prompt phase.
- Kept conversation practice mode unchanged.
- Kept chat transport, Supabase session usage, voice controls, message rendering, routing, and persistence unchanged.

## Acceptance notes

- Learners now have a clear way to ask for one focused exercise instead of drifting into more theory.
- The exercise prompt is level-aware and language-aware using existing lesson metadata.
- The change remains frontend-only and bounded to the existing lesson UI.
- No Forge, OpenAI, Hub, `shingitai-docs`, backend, schema, auth, dependency, route, or broad rewrite changes were made.

## Commit refs

- Code: `9bdd93d7412231fa2f618ab50ff3a549606bc484`
- Docs: this run note commit

## Recommended local validation

```bash
npm install
npm run lint
npm run build
```

## Blockers

None in this run.

## Next planned step

8.2.4 — Lesson Correction Guidance Pass
