# ShinGiTai Language - Identity System Status

Status: Batch 7.1 Started
Owner: ArticSakuraTech / ShinGiTai Holding Groupe
Last updated: 2026-07-03

## Branch

`identity-system-foundation`

Base branch:

`vite-config-switch-test`

## Completed

Added first identity system documentation:

- `docs/BRAND_GUIDELINES.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/UI_PRINCIPLES.md`
- `docs/ICONOGRAPHY.md`

## Important Logo Decision

The official logo must remain canonical.

No random replacement logo will be created or inserted.

Until approved logo assets are available in the repository, the project will use documented placeholders only in docs and will not ship a fake production logo.

## Logo Assets Needed

Add later after founder approval:

```text
public/brand/shingitai-holding-logo.svg
public/brand/articsakura-logo.svg
public/brand/shingitai-language-logo.svg
public/brand/shingitai-language-icon.svg
```

## Next Step

Sprint 7.1.2 should add code-level design tokens without replacing the official logo.

Candidate files:

```text
src/lib/design-tokens.ts
src/components/brand/ProductLogo.tsx
src/components/brand/AppMark.tsx
```

Rules:

- use existing approved mark if available,
- otherwise use text-based brand lockup,
- do not create a fake final logo.

## Validation

After code-level changes are added, run:

```bash
npm run build
npm run dev
```

Current documentation-only changes do not require a build.
