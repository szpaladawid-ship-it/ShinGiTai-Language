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

### 8.1.2 — New Lesson Dialog Guidance

Status: Completed in implementation pass.

Scope:
- Improve the new lesson dialog so users know what language and level to choose.
- Keep the existing lesson creation flow, backend behavior, and routes unchanged.
- Add safe loading and empty-state handling for language selection.

Implemented:
- Updated `src/routes/_authenticated/teacher.tsx` only.
- Added a short guidance panel inside the `New lesson` dialog.
- Added level-specific helper copy for A1 through C2.
- Added a loading placeholder for languages while active languages are being fetched.
- Disabled the language selector and start button when active languages are still loading or unavailable.
- Added an explicit no-active-languages message instead of allowing a confusing empty selector.
- Kept `createConversation`, `listConversations`, `deleteConversation`, routing, schema, auth, dependencies, and Supabase tables unchanged.

Acceptance:
- Users get guidance before starting a lesson.
- Beginners are nudged toward A1 without hiding advanced levels.
- The dialog handles loading and missing-language states safely.
- Existing teacher lesson creation behavior remains intact.

Recommended local checks:

```bash
npm install
npm run lint
npm run build
```

### 8.1.3 — Teacher Lesson Session Header

Status: Completed in implementation pass.

Scope:
- Improve the active teacher lesson header so users understand the session context immediately.
- Keep the change limited to existing lesson session UI and existing conversation data.
- Avoid backend, schema, auth, route, dependency, and AI behavior changes.

Implemented:
- Updated `src/components/tutor-chat.tsx` only.
- Added safe header fallbacks for missing title, language code, and level.
- Added a `Guided lesson` badge for AI Teacher sessions.
- Added a lightweight lesson phase label based on existing message count and streaming state: ready, warm-up, in progress, or teacher responding.
- Added three compact session guidance chips: follow the teacher prompt, answer in short steps, and ask for examples anytime.
- Kept the existing avatar picker, voice toggle, message flow, chat transport, and conversation persistence unchanged.

Acceptance:
- Active AI Teacher sessions now show clearer context at the top of the lesson.
- Users can tell whether the lesson is ready, warming up, in progress, or waiting for the teacher response.
- Conversation practice mode remains compatible because the extra lesson guidance only appears in teacher mode.
- No backend, schema, auth, route, dependency, Forge, OpenAI, Hub, or unrelated repository changes were made.

Recommended local checks:

```bash
npm install
npm run lint
npm run build
```

### 8.1.4 — Teacher Empty Lesson Starter Prompt

Status: Completed in implementation pass.

Scope:
- Improve the AI Teacher empty state with concrete starter prompt examples.
- Keep the change limited to the existing teacher index route.
- Avoid backend, schema, auth, route, dependency, and AI behavior changes.

Implemented:
- Updated `src/routes/_authenticated/teacher.index.tsx` only.
- Added a `Starter prompts` panel below the AI Teacher benefit cards.
- Added three beginner-friendly prompt examples for phrases, grammar practice, and real-life conversation.
- Kept the existing `New lesson` creation flow and avatar picker unchanged.
- No Supabase query, server function, AI prompt, chat transport, auth, routing, dependency, schema, or cross-repository changes were made.

Acceptance:
- Empty AI Teacher state now gives users concrete ideas for what to do first.
- Users are less likely to freeze after opening the AI Teacher area.
- Existing lesson creation and active lesson behavior remain unchanged.
- The change stays frontend-only and bounded to the teacher entry screen.

Recommended local checks:

```bash
npm install
npm run lint
npm run build
```

## Latest Run Summary

Finished `8.1.4 — Teacher Empty Lesson Starter Prompt` as a bounded AI Teacher empty-state improvement.

Changed files:
- `src/routes/_authenticated/teacher.index.tsx`
- `docs/sprints/sprint-8-execution.md`

Implementation notes:
- The AI Teacher entry screen now includes starter prompt examples for first-use confidence.
- The update is UI-only and uses static copy, so it does not affect backend behavior or lesson creation.
- No AI prompt, server function, Supabase schema, auth, routing, dependency, Forge, OpenAI, Hub, or other repository changes were made.

Local validation still required because this run only used the GitHub connector:

```bash
npm install
npm run lint
npm run build
```

## Next Action

Continue Sprint `8.1 — Learning Experience Foundation` with `8.1.5 — Teacher Lesson Starter Message Copy` using existing chat UI only.
