# ShinGiTai Language Agent Rules

Status: Active
Owner: ArticSakuraTech / ShinGiTai Holding Groupe

## Product Identity

This repository is the working codebase for ShinGiTai Language.

ShinGiTai Language belongs to ArticSakuraTech, the technology branch of ShinGiTai Holding Groupe.

## Operating Rules

- GitHub is the source of truth.
- Keep `main` stable.
- Use feature/cleanup branches for larger changes.
- Make changes in controlled batches.
- Test with `npm run lint` and `npm run build` before merging.
- Avoid vendor lock-in.
- Do not expose API keys or secrets.
- Do not commit `.env` values.
- Prefer modular code that can later connect to OdynAI.

## Current Migration Direction

The project is being migrated from a generated prototype into a ShinGiTai-owned product.

Current priorities:

1. Rebrand visible identity to ShinGiTai Language.
2. Remove generator-specific/legacy generator-specific dependencies.
3. Stabilize Supabase and auth.
4. Refactor AI access through a provider-neutral gateway.
5. Prepare future desktop/mobile packaging only after the web app is stable.

## Testing Commands

```bash
npm install
npm run lint
npm run build
npm run dev
```
