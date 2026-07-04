# Sprint 7 Execution Log — Productivity Foundation

## Goal

Make ShinGiTai Language feel more like a guided learning product after login, not just a collection of disconnected language-learning features.

Sprint 7 is intentionally split into small, safe changes so the repository stays stable and every change can be reviewed, tested, and reverted independently.

## Current Sprint Order

### 7.2.1 — Rebranding Foundation

Status: Completed in first implementation pass.

Scope:
- Replace visible `LinguaVerse` branding with `ShinGiTai Language` in small batches.
- Start with safe identity surfaces: metadata, header/logo text, footer, and hero copy.
- Avoid changing auth, routing, Supabase, or dependencies.

Implemented:
- Updated landing-page metadata title and Open Graph title.
- Updated primary logo text from `LinguaVerse` to `ShinGiTai Language`.
- Updated hero copy, language-section copy, image alt text, final CTA, and footer copyright.
- Kept routing, auth, Supabase, pricing structure, dependencies, and feature layout unchanged.

Acceptance:
- Landing page no longer exposes old brand in primary UI copy.
- Build should still pass with no functional behavior changes.

Recommended local checks:

```bash
npm install
npm run lint
npm run build
```

### 7.2.2 — Continue Learning Card

Status: Completed in implementation pass.

Scope:
- Add a dashboard card that tells the user what to continue next.
- Use static/demo data first if user progress data is not ready.
- Keep it UI-only unless existing progress data is already available.

Implemented:
- Added reusable `ContinueLearningCard` component in `src/components/dashboard/continue-learning-card.tsx`.
- Component supports loading state, empty state, active course state, and a recommended next-step CTA.
- Wired the component into `src/routes/_authenticated/dashboard.tsx`.
- Reused the newest active course from the existing `courses` query instead of adding backend work.
- Updated the remaining dashboard header brand string from `LinguaVerse` to `ShinGiTai Language`.
- No backend, schema, auth, routing, or dependency changes were made.

Acceptance:
- User can instantly see the next recommended learning action.
- No backend or schema migration required.
- Dashboard keeps working for loading, empty-course, and active-course states.

Recommended local checks:

```bash
npm install
npm run lint
npm run build
```

### 7.2.3 — Today's Focus

Status: Completed in implementation pass.

Scope:
- Add a focused daily learning block.
- Include a compact plan such as lesson, flashcards, and speaking practice.
- Keep the first version deterministic and stable.

Implemented:
- Added reusable `TodaysFocusCard` component in `src/components/dashboard/todays-focus-card.tsx`.
- Added a deterministic three-step daily stack: core lesson, flashcard review, and speaking practice.
- Wired the card into the dashboard directly below `ContinueLearningCard`.
- Reused existing dashboard data: active course, daily goal minutes, current streak, and course loading state.
- Added empty-course CTA toward onboarding without backend or schema changes.

Acceptance:
- Dashboard answers: "What should I do today?"
- User sees one clear daily practice stack instead of only a feature launcher.
- No backend, schema, auth, routing, or dependency changes were made.

Recommended local checks:

```bash
npm install
npm run lint
npm run build
```

### 7.2.4 — Practice Stack

Status: Completed in implementation pass.

Scope:
- Rework scattered quick actions into an ordered practice stack.
- Prioritize learning flow: lesson → flashcards → speaking → review.
- Keep routes and backend behavior unchanged.

Implemented:
- Replaced the generic `QUICK_ACTIONS` launcher with `PRACTICE_STACK` and `SUPPORT_ACTIONS` groups.
- Main dashboard action order is now: Learn → Review → Speak → Test.
- Secondary actions are still available as support tools: Grammar, Exams, Leaderboard, Achievements, and Go Pro.
- Updated dashboard section copy from `Jump back in` to `Practice Stack` with a short learning-loop explanation.
- No routes, auth, Supabase queries, schema, dependency, or cross-repository changes were made.

Acceptance:
- Dashboard feels more like a guided system than a launcher.
- User sees the recommended order before optional support tools.
- Existing navigation destinations remain intact.

Recommended local checks:

```bash
npm install
npm run lint
npm run build
```

### 7.2.5 — UX Cleanup

Status: Completed in implementation pass.

Scope:
- Small spacing, CTA, label, and hierarchy improvements.
- No broad component rewrites.

Implemented:
- Tightened dashboard spacing on mobile and desktop with smaller top padding and responsive section spacing.
- Improved header behavior on narrow screens by preventing the brand and action icons from crowding each other.
- Added a small `Today’s mission` label to make the hero panel easier to scan.
- Improved hero copy so it points users toward the focused practice flow instead of generic streak copy.
- Improved level-progress layout on small screens with stacked text before horizontal layout on larger screens.
- Changed primary practice card CTA text from `Start` to `Continue` for better learning-product tone.
- Added visible keyboard focus rings to practice cards, support tools, and add-language buttons.
- Added helper copy under `Support tools` to clarify that those features are secondary.
- No database, auth, route, dependency, schema, or cross-repository changes were made.

Acceptance:
- Dashboard is cleaner and easier to scan.
- Primary learning path remains visually dominant.
- Secondary tools are still accessible but lower in hierarchy.
- Keyboard users get clearer focus states.

Recommended local checks:

```bash
npm install
npm run lint
npm run build
```

## Guardrails

- One coherent objective per commit.
- No Forge, OpenAI, Hub, or unrelated repository changes.
- No large rewrites without a clear reason.
- Prefer demo/static data before backend complexity.
- Keep the app buildable after each change.

## Latest Run Summary

Finished `7.2.5 — UX Cleanup` as a bounded dashboard polish update.

Changed files:
- `src/routes/_authenticated/dashboard.tsx`
- `docs/sprints/sprint-7-execution.md`

Implementation notes:
- The dashboard now has stronger scan hierarchy, better responsive spacing, clearer CTA language, and visible keyboard focus states.
- The update stayed UI-only and did not change app behavior, backend queries, routes, auth, dependencies, schema, or other repositories.
- This completes Sprint 7.2 dashboard productivity foundation.

Local validation still required because this run only used the GitHub connector:

```bash
npm install
npm run lint
npm run build
```

## Next Action

Start Sprint `7.3 — Learning Intelligence v1` with `7.3.1 — Next Step Recommendation` using existing dashboard data only.
