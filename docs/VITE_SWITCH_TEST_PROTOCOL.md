# ShinGiTai Language - Vite Switch Test Protocol

Status: Batch 5.4A Switch Fix
Owner: ArticSakuraTech / ShinGiTai Holding Groupe
Last updated: 2026-07-03

## Purpose

This branch tests the active ShinGiTai-owned Vite configuration.

Branch:

`vite-config-switch-test`

## Important

This is a test branch.

Do not merge it until Dawid confirms local validation.

## What Changed

`vite.config.ts` now uses direct project dependencies instead of the previous generated configuration wrapper.

The config was updated after the first local test:

- TanStack Start now runs before React.
- Vite native tsconfig path resolution is used.
- `vite-tsconfig-paths` is no longer imported by the active config.

## Local Build/Dev Test Commands

Use these first:

```bash
git fetch
git checkout vite-config-switch-test
git pull
npm install
npm run build
npm run dev
```

## Lint Status

`npm run lint` currently reports many existing formatting issues across the codebase.

Those are mostly Prettier formatting problems and should be handled as a separate quality sprint.

For this Vite extraction test, the key validation is:

- build starts and completes,
- dev server starts,
- app loads in browser.

## Manual Checks

Open the local dev URL and check:

- landing page loads,
- auth page loads,
- dashboard behavior is unchanged,
- styles still load,
- navigation works,
- browser console does not show new obvious errors.

## If It Fails

Paste the full terminal output back into ChatGPT.

## Rollback

Return to the safe branch:

```bash
git checkout cleanup/rebrand-foundation
```
