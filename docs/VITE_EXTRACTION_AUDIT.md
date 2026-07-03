# ShinGiTai Language - Vite Extraction Audit

Status: Batch 5.1 Active Audit
Owner: ArticSakuraTech / ShinGiTai Holding Groupe
Last updated: 2026-07-03

## Purpose

This document defines the technical audit for replacing the generated Vite/TanStack configuration with a ShinGiTai-owned build configuration.

This batch does not switch the project yet. It only documents what must be preserved before the extraction spike.

## Current State

The project currently uses `@lovable.dev/vite-tanstack-config` in `vite.config.ts`.

The current config is small, but the imported package hides most of the real build setup.

Current `vite.config.ts` behavior:

- imports `defineConfig` from the generated config package,
- sets TanStack Start server entry to `server`,
- relies on the package for all other Vite/TanStack/Nitro behavior.

## Hidden Responsibilities To Preserve

The existing config comments identify the following responsibilities as provided by the generated package:

- TanStack Start plugin,
- React plugin,
- Tailwind plugin,
- tsconfig paths,
- Nitro build configuration,
- Cloudflare default target,
- development component tagger,
- Vite environment injection,
- `@` path alias,
- React and TanStack dedupe,
- error logger plugins,
- sandbox detection,
- port, host and strictPort behavior.

## Existing Direct Dependencies Available

The project already has direct dependencies that can support a project-owned configuration:

Runtime dependencies:

- `@tanstack/react-start`
- `@tanstack/router-plugin`
- `@vitejs/plugin-react`
- `@tailwindcss/vite`
- `vite-tsconfig-paths`
- `nitro`
- `vite`

This means the generated package is likely a convenience wrapper, not the only possible way to build the app.

## Known Project Requirements

### Server entry

The current app uses a custom server wrapper in `src/server.ts`.

This must be preserved:

- SSR errors are normalized there,
- TanStack Start server entry must continue to point to `server`,
- build output must still use the wrapper.

### Alias

The app uses `@/` imports.

This is currently supported by `tsconfig.json` paths:

- `@/*` -> `./src/*`

The Vite config must also resolve this alias during dev/build.

### CSS and Tailwind

The project uses Tailwind v4 with the Vite plugin.

The replacement config must include the Tailwind Vite plugin.

### TanStack Start

The replacement must preserve:

- route generation,
- SSR behavior,
- server functions,
- client/server split,
- build integration.

### Nitro

Current build output indicates Nitro is involved.

The replacement must preserve:

- Nitro build behavior,
- server bundle generation,
- compatible deployment output.

### Environment variables

Current Supabase client reads:

- `import.meta.env.VITE_SUPABASE_URL`
- `import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY`
- `process.env.SUPABASE_URL`
- `process.env.SUPABASE_PUBLISHABLE_KEY`

Replacement config must not break Vite environment replacement.

## Proposed Replacement Direction

Create a project-owned Vite config using direct plugins.

Candidate structure:

```ts
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    viteReact(),
    tanstackStart({
      server: { entry: "server" },
    }),
  ],
  resolve: {
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-start"],
  },
});
```

Important: this is a candidate, not final code. Actual TanStack Start plugin import and options must be verified locally.

## Spike Plan

### Step 1 - Create spike branch

Branch name:

`spike/vite-config-extraction`

### Step 2 - Add parallel config

Add a separate candidate file first:

`vite.config.shingitai.ts`

Do not overwrite current `vite.config.ts` yet.

### Step 3 - Test manually

Run:

```bash
npm run lint
npm run build
npm run dev
```

If the alternate config cannot be selected directly through the current scripts, temporarily test by replacing `vite.config.ts` on the spike branch only.

### Step 4 - Compare build behavior

Compare:

- dev server starts,
- route generation works,
- SSR works,
- auth routes load,
- dashboard routes load,
- server functions compile,
- Supabase client does not throw unexpectedly,
- build output does not lose Nitro output.

### Step 5 - Decide

If successful:

- replace current config,
- remove generated config package,
- update lockfile locally,
- run full validation.

If not successful:

- keep generated config,
- document missing plugin behavior,
- create a smaller extraction target.

## Rollback Plan

Rollback is simple because this work must happen on a spike branch first.

If the custom config fails:

1. return to `cleanup/rebrand-foundation`,
2. keep the current generated config,
3. do not remove packages,
4. document the exact failure.

## Risk Level

Overall risk: high.

Reason:

The generated config currently hides several build behaviors. Replacing it may break dev, SSR, routing, server functions, or deployment output.

## Recommendation

Do not merge the Vite extraction until Dawid tests locally.

Minimum acceptance criteria:

- `npm install` succeeds,
- `npm run lint` succeeds,
- `npm run build` succeeds,
- `npm run dev` starts,
- landing page loads,
- auth page loads,
- dashboard route behavior is unchanged,
- no new obvious runtime errors in the browser console.
