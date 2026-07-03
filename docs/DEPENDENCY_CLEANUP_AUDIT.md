# ShinGiTai Language - Dependency Cleanup Audit

Status: Sprint 6.1.1
Owner: ArticSakuraTech / ShinGiTai Holding Groupe
Last updated: 2026-07-03

## Purpose

This document records the dependency cleanup audit for ShinGiTai Language after the successful Vite config switch test.

## Result

The codebase search found no active source-code usage of Lovable-specific imports or globals.

The remaining Lovable references were package-level dependencies.

## Removed From package.json

Removed dependencies:

- `@lovable.dev/cloud-auth-js`
- `@lovable.dev/vite-tanstack-config`
- `vite-tsconfig-paths`

## Why This Is Safe

The project now builds and runs using the ShinGiTai-owned Vite configuration.

The active Vite config uses:

- TanStack Start plugin,
- Tailwind Vite plugin,
- React Vite plugin,
- Vite native tsconfig path support,
- explicit `@` alias,
- React/TanStack dedupe.

## Local Validation Required

Because dependency removal changes must update `package-lock.json`, run locally:

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
git commit -m "Update lockfile after dependency cleanup"
git push
```

## Known Non-Blocking Issues

`npm run lint` currently reports many existing formatting issues.

These are mostly Prettier formatting problems and should be handled in a separate quality sprint.

## Next Step

If build/dev pass after lockfile refresh, this branch can become the base for the final Lovable removal merge.
