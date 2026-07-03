# ShinGiTai Language - Dependency Cleanup Audit

Status: Sprint 6.1.2
Owner: ArticSakuraTech / ShinGiTai Holding Groupe
Last updated: 2026-07-03

## Purpose

This document records the dependency cleanup audit for ShinGiTai Language after the successful Vite config switch test.

## Result

The project now uses the ShinGiTai-owned Vite configuration and no longer keeps Lovable packages in `package.json`.

A later local validation found one remaining source file:

- `src/integrations/lovable/index.ts`

That file imported `@lovable.dev/cloud-auth-js` and caused the build to fail after package removal.

## Removed From package.json

Removed dependencies:

- `@lovable.dev/cloud-auth-js`
- `@lovable.dev/vite-tanstack-config`
- `vite-tsconfig-paths`

## Removed From Source Code

Removed files:

- `src/integrations/lovable/index.ts`

Reason:

- The file imported the removed cloud auth package.
- Repository search found no active usage of its exported `lovable` object.
- Supabase auth remains the active auth integration.

## Current Lovable Search Status

Repository search for Lovable-related terms now returns no results for active source/config references.

Search terms checked:

- `lovable`
- `Lovable`
- `@lovable.dev`
- `createLovableAuth`

## Why This Is Safe

The project already built and ran using the ShinGiTai-owned Vite configuration before package cleanup.

The removed source file was not imported by active code paths.

The active Vite config uses:

- TanStack Start plugin,
- Tailwind Vite plugin,
- React Vite plugin,
- Vite native tsconfig path support,
- explicit `@` alias,
- React/TanStack dedupe.

## Local Validation Required

Run locally:

```bash
git fetch
git checkout vite-config-switch-test
git pull
npm install
npm run build
npm run dev
```

Then commit the updated lockfile if it changes:

```bash
git status
git add package-lock.json
git commit -m "Update lockfile after Lovable removal"
git push
```

## Known Non-Blocking Issues

`npm run lint` currently reports many existing formatting issues.

These are mostly Prettier formatting problems and should be handled in a separate quality sprint.

TanStack currently reports deprecated `createServerFn().inputValidator()` usage.

That should be handled in the next modernization sprint.

## Next Step

If build/dev pass after this cleanup, the project can move to TanStack API modernization.
