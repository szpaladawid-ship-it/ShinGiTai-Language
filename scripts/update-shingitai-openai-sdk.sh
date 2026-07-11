#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 /path/to/shingitai-openai" >&2
  exit 2
fi

OPENAI_REPO="$(cd "$1" && pwd)"
SDK_DIR="$OPENAI_REPO/packages/shingitai-openai-sdk"
LANGUAGE_REPO="$(cd "$(dirname "$0")/.." && pwd)"
VENDOR_DIR="$LANGUAGE_REPO/vendor/shingitai-openai-sdk"
PACK_DIR="$(mktemp -d)"
trap 'rm -rf "$PACK_DIR"' EXIT

if [[ ! -f "$SDK_DIR/package.json" ]]; then
  echo "SDK package not found at: $SDK_DIR" >&2
  exit 1
fi

pnpm --dir "$OPENAI_REPO" --filter "@shingitai/openai-sdk" build
(cd "$SDK_DIR" && pnpm pack --pack-destination "$PACK_DIR")

PACKAGE_FILE="$(find "$PACK_DIR" -maxdepth 1 -type f -name 'shingitai-openai-sdk-*.tgz' -print -quit)"
if [[ -z "$PACKAGE_FILE" ]]; then
  echo "SDK package was not produced." >&2
  exit 1
fi

mkdir -p "$VENDOR_DIR"
find "$VENDOR_DIR" -maxdepth 1 -type f -name 'shingitai-openai-sdk-*.tgz' -delete
cp "$PACKAGE_FILE" "$VENDOR_DIR/"

cd "$LANGUAGE_REPO"
npm install

echo "ShinGiTai OpenAi SDK updated: vendor/shingitai-openai-sdk/$(basename "$PACKAGE_FILE")"
echo "Verify package.json points to this exact artifact before review."
