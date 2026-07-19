#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
ENV_FILE="$ROOT/.env"
RESPONSE_FILE="$(mktemp)"

trap 'rm -f "$RESPONSE_FILE"' EXIT

read_env_value() {
  python3 - "$ENV_FILE" "$1" <<'PY'
from pathlib import Path
import sys

path = Path(sys.argv[1])
wanted = sys.argv[2]

for raw_line in path.read_text(encoding="utf-8").splitlines():
    line = raw_line.strip()

    if not line or line.startswith("#") or "=" not in line:
        continue

    key, value = line.split("=", 1)

    if key.strip() != wanted:
        continue

    value = value.strip()

    if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
        value = value[1:-1]

    print(value)
    raise SystemExit(0)

raise SystemExit(1)
PY
}

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE" >&2
  exit 1
fi

BASE_URL="$(read_env_value ODYNAI_BASE_URL)"
APP_KEY="$(read_env_value ODYNAI_LANGUAGE_APP_KEY)"

if [[ -z "$BASE_URL" || -z "$APP_KEY" ]]; then
  echo "OdynAI Language environment is incomplete." >&2
  exit 1
fi

echo "=== ODYNAI LANGUAGE HEALTH ==="

curl --silent --show-error --fail --max-time 15 \
  "$BASE_URL/v1/gateways/language/health" \
  -H "X-ShinGiTai-App-Key: $APP_KEY"

echo
echo "=== ODYNAI LANGUAGE CHAT ==="

STATUS="$(
  curl --silent --show-error --max-time 260 \
    --output "$RESPONSE_FILE" \
    --write-out '%{http_code}' \
    "$BASE_URL/v1/gateways/language/chat" \
    -H "X-ShinGiTai-App-Key: $APP_KEY" \
    -H "Content-Type: application/json" \
    --data '{
      "mode": "teacher",
      "target_language": "Norwegian",
      "native_language": "Polish",
      "level": "A2",
      "messages": [
        {
          "role": "user",
          "content": "Naucz mnie jednego krótkiego zdania po norwesku do przedstawiania się."
        }
      ],
      "max_tokens": 512,
      "temperature": 0.2
    }'
)"

if [[ "$STATUS" != "200" ]]; then
  echo "OdynAI Language chat failed with HTTP $STATUS" >&2
  cat "$RESPONSE_FILE" >&2
  exit 1
fi

python3 - "$RESPONSE_FILE" <<'PY'
import json
import sys
from pathlib import Path

payload = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))

assert isinstance(payload.get("request_id"), str), payload
assert isinstance(payload.get("content"), str) and payload["content"].strip(), payload
assert payload.get("finish_reason") == "stop", payload
assert payload.get("truncated") is False, payload
assert isinstance(payload.get("quality_retry_used"), bool), payload

print(
    "OdynAI Language contract verified: "
    f"finish_reason={payload['finish_reason']}, "
    f"truncated={payload['truncated']}, "
    f"quality_retry_used={payload['quality_retry_used']}"
)
print(payload["content"].strip())
PY

echo
echo "=== STATIC CHAT BOUNDARY ==="

if grep -RInE \
  "LOVABLE_API_KEY|ai\.gateway\.lovable\.dev|createLovableAiGatewayProvider|gemini-3-flash" \
  "$ROOT/src/routes/api/chat.ts" \
  "$ROOT/src/integrations/odynai"
then
  echo "Legacy provider reference remains in the Language chat boundary." >&2
  exit 1
fi

echo "Language chat legacy provider references: 0"
echo "=== LANG-002A LIVE CONTRACT PASS ==="
