# ShinGiTai Language — Productivity Cycle 3

Date: 2026-07-03
Scope: ShinGiTai Language only

## Sprint goal

Continue after the Lovable cleanup by improving the actual learner workflow instead of starting a broad rebrand.

The next functional improvement should make the authenticated dashboard answer one simple user question:

> What should I do next today?

## Current state found

The dashboard already has solid foundations:

- profile loading from Supabase `profiles`
- onboarding redirect when `onboarding_completed` is false
- user stats from `user_stats`
- active courses from `user_courses`
- quick actions for teacher, tutor, exams, flashcards, grammar, quizzes, leaderboard, achievements and premium
- add-language card backed by Supabase `languages` and `user_courses`

This is enough to build a lightweight productivity layer without changing the whole UI.

## Recommended bounded implementation

Add a small `Today's focus` panel on `/dashboard`, placed after level progress and before quick actions.

Behavior:

1. If courses are loading, show a skeleton.
2. If the user has no active course, show a prompt to add the first language.
3. If the user has an active course, show:
   - selected language flag/name
   - current level
   - daily goal minutes
   - three action shortcuts:
     - start AI Teacher session
     - start AI Conversation
     - review Flashcards

Why this matters:

- improves productivity immediately
- gives the learner a next action
- uses existing data and routes
- avoids database schema changes
- avoids broad visual redesign
- keeps the product moving toward a usable beta

## Secondary safe improvement

Improve the add-language flow:

- add local loading state while a language is being enrolled
- disable language buttons during enrollment
- show a spinner on the selected language
- keep existing duplicate-language error handling

Why this matters:

- prevents accidental double-click inserts
- makes Supabase latency feel intentional
- improves perceived quality without changing backend architecture

## Local validation checklist

```bash
npm install
npm run lint
npm run build
npm run dev
```

Manual checks:

- `/dashboard` loads for an authenticated user
- user without courses sees the add-language prompt
- user with courses sees the focus panel
- `Start plan` opens `/teacher`
- conversation shortcut opens `/tutor`
- flashcard shortcut opens `/flashcards`
- adding a language disables buttons while the insert is pending
- duplicate language still shows a friendly toast

## Blocker note

A direct large dashboard rewrite was attempted during this cycle but the tool safety layer blocked the update. To avoid unsafe or messy changes, this cycle records the exact bounded implementation plan and leaves the code change for the next safe edit path.

## Decision

Do not rebrand yet.
Do not remove Lovable Vite config yet.
Do not touch Forge, OpenAI or Hub.

Next priority: implement the `Today's focus` dashboard panel in a small, reviewable code change.
