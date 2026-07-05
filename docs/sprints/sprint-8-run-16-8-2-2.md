# Sprint 8 Run 16 — 8.2.2 Lesson Message Readability Pass

## Objective

Improve readability of active AI Teacher lesson messages without changing backend behavior, AI prompts, routing, auth, schema, dependencies, or unrelated repositories.

## Scope

Changed only the ShinGiTai Language repository.

Files changed:

- `src/components/tutor-chat.tsx`
- `docs/sprints/sprint-8-run-16-8-2-2.md`

## Implemented

- Added teacher-only message readability helpers in `src/components/tutor-chat.tsx`.
- Gave AI Teacher assistant replies a full-width readable card treatment.
- Added comfortable line height and spacing for paragraphs, lists, and ordered lists in AI Teacher messages.
- Kept user replies compact while making them slightly easier to read in lesson mode.
- Kept conversation practice mode unchanged.
- Did not touch Forge, ShinGiTai OpenAI, Hub, or unrelated repositories.

## Acceptance

- AI Teacher lesson replies are easier to scan during guided learning.
- Longer lesson responses have better spacing without changing their generated content.
- Existing message submission, chat transport, voice controls, avatar picker, persistence, and review prompt behavior remain unchanged.
- The change is UI-only and bounded to the active lesson chat component.

## Recommended local checks

```bash
npm install
npm run lint
npm run build
```

## Next Action

Continue with `8.2.3 — Lesson Exercise Prompt Clarity` unless the roadmap defines a more specific next 8.2 item.
