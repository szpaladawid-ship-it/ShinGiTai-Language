# Sprint 8 Run Note — 8.1.10 Teacher Lesson Review Prompt Polish

## Status

Completed.

## Objective

Add a lightweight review prompt inside AI Teacher lessons after enough chat context exists, so learners can close a lesson with a recap, correction, and next step.

## Scope

- Work only in the ShinGiTai Language repository.
- Keep the change bounded to existing AI Teacher chat UI and Sprint 8 documentation.
- Avoid backend, schema, auth, dependency, route, persistence, AI system prompt, Forge, OpenAI, Hub, and unrelated repository changes.

## Implemented

- Updated `src/components/tutor-chat.tsx`.
- Added `teacherReviewPrompt(languageLabel, level)` for a reusable review prompt.
- Added `reviewPrompt` and `shouldShowReviewPrompt` derived values from existing chat state.
- Added a small `Ready for a lesson review?` panel after the lesson has at least six messages and the chat status is ready.
- Kept the prompt UI copy-only: it suggests text the learner can send, but does not auto-submit or change chat behavior.
- Confirmed the teacher voice helper still renders inside the existing `aria-live="polite"` paragraph.

## Acceptance

- AI Teacher lessons now nudge the learner to ask for a recap once there is enough conversation context.
- The review prompt asks the teacher to summarize strengths, correct the biggest mistake, and give one next step.
- Conversation practice mode remains unaffected.
- Existing `useChat`, `DefaultChatTransport`, Supabase auth session handling, voice controls, avatar picker, routes, persistence, and AI prompt behavior remain unchanged.

## Commits

- Code: `823ea296d06af68a05739db194425f4acb8af139`
- Docs: this file commit

## Local validation

Run locally:

```bash
npm install
npm run lint
npm run build
```

## Blockers

None in this pass. Previous connector blocker was resolved by retrying the bounded code patch.

## Next planned step

Continue Sprint 8 with `8.1.11 — Teacher Review Prompt Placement and Copy Check` or move to the next Learning Experience item if the review prompt behaves well in local UI testing.
