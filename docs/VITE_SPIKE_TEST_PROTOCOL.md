# ShinGiTai Language - Vite Spike Test Protocol

Status: Batch 5.2 Spike
Owner: ArticSakuraTech / ShinGiTai Holding Groupe
Last updated: 2026-07-03

## Purpose

This document defines how to test the candidate ShinGiTai-owned Vite config without replacing the current working config.

The candidate config file is:

`vite.config.shingitai.ts`

The current active config remains:

`vite.config.ts`

## Branch

Use:

`spike/vite-config-extraction`

## Local Test Commands

```bash
git fetch
git checkout spike/vite-config-extraction
npm install
```

## Baseline Test

First confirm the current active config still works:

```bash
npm run lint
npm run build
npm run dev
```

Stop the dev server after confirming it starts.

## Candidate Config Build Test

Run:

```bash
npx vite build --config vite.config.shingitai.ts
```

Expected result:

- build completes,
- TanStack Start routes compile,
- SSR output is generated,
- Nitro output still appears,
- no missing plugin/module errors.

## Candidate Config Dev Test

Run:

```bash
npx vite dev --config vite.config.shingitai.ts
```

Open the local URL and check:

- landing page loads,
- auth page loads,
- dashboard route behavior is unchanged,
- browser console has no new obvious runtime errors.

## What To Report Back

Paste the full terminal output if any command fails.

Especially important errors:

- missing `tanstackStart` import,
- invalid plugin option,
- Nitro output missing,
- route generation failure,
- SSR entry failure,
- `@/` alias resolution failure,
- Tailwind/CSS plugin failure,
- React duplicate/hydration errors.

## Decision Rules

If both candidate build and dev work:

- proceed to Batch 5.3 switch test.

If candidate build works but dev fails:

- inspect dev-only behavior missing from the generated config.

If candidate build fails:

- do not switch configs.
- keep current `vite.config.ts`.
- document the failing plugin/import/option.

## Rollback

No rollback is needed unless local files are manually modified.

This spike branch does not replace the active config.
