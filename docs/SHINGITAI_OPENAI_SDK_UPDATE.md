# Updating the ShinGiTai OpenAi SDK

Language vendors the official SDK as a packed npm artifact so a standalone clone can install without a sibling repository or registry.

## Automated update

From the Language repository:

```bash
./scripts/update-shingitai-openai-sdk.sh /absolute/path/to/shingitai-openai
```

The script builds `@shingitai/openai-sdk`, creates the `.tgz`, replaces the previous SDK artifact in `vendor/shingitai-openai-sdk/`, and runs `npm install` to update the lockfile.

## Manual equivalent

```bash
cd /path/to/shingitai-openai
pnpm --filter "@shingitai/openai-sdk" build
cd packages/shingitai-openai-sdk
pnpm pack --pack-destination /tmp
cp /tmp/shingitai-openai-sdk-<version>.tgz /path/to/ShinGiTai-Language/vendor/shingitai-openai-sdk/
cd /path/to/ShinGiTai-Language
npm install
```

Remove the superseded artifact and update the exact relative `file:vendor/...tgz` dependency in `package.json` when the SDK version changes.

## Verification

```bash
npm install
npm ls @shingitai/openai-sdk
npm run typecheck
npm test
npm run build
```

Confirm that `package-lock.json` resolves the dependency inside `vendor/`, not through `../shingitai-openai` or an absolute path.

## Future registry migration

When an approved registry is available, publish the same package and replace only the dependency value with an immutable version such as `0.1.0`. Application imports and integration-boundary code remain unchanged.
