# Sprint 8 Run 16 — Lesson Flow Clarity Pass

## Objective

Complete `8.2.1 — Lesson Flow Clarity Pass` as a small, bounded Learning Experience improvement.

The goal was to make active AI Teacher lessons easier to follow by showing the learner what step they are currently in, without changing backend behavior, routing, persistence, AI prompts, schema, auth, or dependencies.

## Scope

Changed only the ShinGiTai Language repository.

Files changed:

- `src/components/tutor-chat.tsx`
- `docs/sprints/sprint-8-run-16.md`

No Forge, ShinGiTai OpenAI, Hub, or unrelated repositories were touched.

## Implemented

- Added a small `teacherFlowHint` helper in `src/components/tutor-chat.tsx`.
- Added a compact lesson-flow panel in AI Teacher mode only.
- The panel now shows:
  - `Step 1` for starting a new lesson.
  - `Step 2` for early warm-up answers.
  - `Step 3` for ongoing practice and recap readiness.
  - `Teacher turn` while the AI teacher is responding.
- Kept existing guided lesson badge, phase label, chips, review prompt, voice controls, message flow, and conversation practice behavior intact.
- Kept the change frontend-only and copy/UI-focused.

## Acceptance

- AI Teacher users can better understand what to do next inside a lesson.
- The flow guidance changes with the existing message count and busy state.
- Conversation mode remains unaffected.
- No backend, Supabase, auth, routing, dependency, AI prompt, schema, Forge, OpenAI, Hub, or unrelated repository changes were made.

## Recommended Local Validation

```bash
npm install
npm run lint
npm run build
```

## Blockers

None in this run.

## Next Planned Step

Continue Sprint 8 with:

`8.2.2 — Lesson Message Readability Pass`

Suggested bounded scope:

- Improve visual readability of lesson messages in AI Teacher mode.
- Keep changes inside existing chat/message rendering.
- Avoid backend, AI prompt, route, schema, auth, dependency, and persistence changes.
