# ShinGiTai Language - Productivity Dashboard Plan

Status: Batch 7.2 Started
Owner: ArticSakuraTech / ShinGiTai Holding Groupe
Last updated: 2026-07-03

## Purpose

Batch 7.2 moves ShinGiTai Language from migration cleanup into product value.

The goal is to improve the dashboard as a daily learning command center without starting another broad rebrand.

## Product Goal

The dashboard should answer three questions immediately:

1. What should I do next?
2. How am I progressing?
3. Where can I practice with AI?

## Scope

This sprint focuses on safe UI/product changes only.

Included:

- dashboard structure audit,
- productivity sections,
- daily learning actions,
- clearer next-step guidance,
- AI tutor entry point,
- flashcards and grammar entry points,
- progress-oriented copy.

Excluded for now:

- major backend changes,
- database schema migrations,
- full rebrand,
- final logo asset replacement,
- payment changes,
- new AI provider architecture.

## Proposed Dashboard Sections

### Continue Learning

Primary card for the next best action.

Examples:

- Resume today's lesson.
- Continue AI conversation.
- Review flashcards.
- Practice weak grammar topic.

### Daily Focus

Small daily target panel.

Initial version can be static or based on existing available data.

Future version can use real learning analytics.

### AI Tutor

Prominent shortcut to the tutor experience.

Purpose:

- conversation practice,
- correction,
- lesson suggestions,
- confidence building.

### Practice Stack

Fast access to:

- Lessons,
- Flashcards,
- Grammar,
- Exams.

### Progress Snapshot

Simple progress view.

Initial version:

- streak placeholder,
- XP placeholder,
- active level placeholder,
- completed lessons placeholder.

Future version:

- real data from Supabase.

## Design Direction

Use current UI components.

No large visual rewrite.

Apply principles from:

- `docs/UI_PRINCIPLES.md`,
- `docs/DESIGN_SYSTEM.md`,
- `docs/BRAND_GUIDELINES.md`.

## Implementation Strategy

1. Inspect current dashboard route.
2. Add or refactor only local dashboard components.
3. Avoid touching auth, Supabase schema or AI backend.
4. Keep changes testable through `npm run build` and `npm run dev`.

## Definition of Done

Batch 7.2 is complete when:

- dashboard has clearer learning priorities,
- main user actions are visible,
- build passes,
- dev server starts,
- no new Lovable/LinguaVerse references are introduced,
- documentation is updated.

## Next Technical Step

Inspect the current dashboard route and implement the first safe UI improvement branch.
