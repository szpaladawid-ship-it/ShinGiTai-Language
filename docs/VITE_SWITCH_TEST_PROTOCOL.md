# ShinGiTai Language - Vite Switch Test Protocol

Status: Batch 5.3 Switch Test
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

The new config is intended to preserve:

- TanStack Start,
- React,
- Tailwind,
- path aliases,
- custom server entry,
- dependency dedupe.

## Local Test Commands

```bash
git fetch
git checkout vite-config-switch-test
npm install
npm run lint
npm run build
npm run dev
```

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
