# ShinGiTai Language

Status: Active Prototype  
Owner: ArticSakuraTech / ShinGiTai Holding Groupe  
Branch: Technology / AI language learning

ShinGiTai Language is an AI-assisted language learning application focused on one clear task: helping users learn, practice, speak, and retain languages through structured lessons, flashcards, grammar, conversation practice, and an adaptive AI tutor.

## Strategic Context

This product belongs to the ShinGiTai Holding Groupe ecosystem under ArticSakuraTech.

It follows the holding documentation rules:

- GitHub is the source of truth.
- Major decisions should be documented before they become code.
- Products should be modular.
- The project should avoid hard dependency on one external vendor.
- Users should remain in control.

## Current Scope

The current prototype includes:

- landing page,
- authentication flow,
- dashboard,
- onboarding,
- AI tutor views,
- teacher/avatar flows,
- flashcards,
- grammar,
- quizzes,
- exams,
- gamification,
- premium/admin screens,
- Supabase integration,
- AI gateway foundation.

## Current Technical Stack

- TypeScript
- React
- TanStack Router / TanStack Start
- Vite
- Supabase
- AI SDK
- Tailwind CSS
- Radix UI

## Current Cleanup Phase

The project is being migrated from a generated prototype into a ShinGiTai-owned product foundation.

Current priorities:

1. Rebrand user-facing identity from LinguaVerse to ShinGiTai Language.
2. Remove Lovable-specific dependencies and configuration.
3. Stabilize authentication and Supabase integration.
4. Refactor the AI gateway into a provider-neutral ShinGiTai AI Gateway layer.
5. Prepare desktop/mobile release strategy after the web version is stable.

## Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npm run build
```

## Ownership

This repository is proprietary to ShinGiTai.

All rights reserved.
