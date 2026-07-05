# Sprint 8 Run 15 — Teacher Review Prompt Placement and Copy Check

## Objective

Complete a small follow-up pass on the AI Teacher lesson review prompt after `8.1.10`, focused only on placement and copy safety.

## Scope

- Repository: ShinGiTai Language only.
- Sprint: 8 — Learning Experience.
- Area: AI Teacher chat UI.
- No backend, schema, auth, route, dependency, AI prompt, persistence, Forge, OpenAI, Hub, or unrelated repository changes.

## Implemented

- Updated `src/components/tutor-chat.tsx`.
- Added a `lastMessageIsAssistant` guard for the review prompt.
- The `Ready for a lesson review?` nudge now appears only when:
  - the session is in teacher mode,
  - there are at least 6 messages,
  - chat status is ready,
  - the latest message is from the assistant.
- Refined the review nudge body copy so it explains why the prompt appears after the teacher has enough context.

## Why this matters

This prevents the review prompt from appearing immediately after the learner sends an answer. The learner now sees the review nudge after a teacher response, which is a cleaner moment to ask for recap, correction, and next step.

## Recommended local checks

```bash
npm install
npm run lint
npm run build
```

## Result

Completed. Continue with the next bounded Sprint 8 Learning Experience item.
