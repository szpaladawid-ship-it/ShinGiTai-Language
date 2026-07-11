# TTS Gateway Migration

## Current state

`/api/tts` directly calls `https://api.openai.com/v1/audio/speech`, uses a provider-specific key, and selects `gpt-4o-mini-tts`. This is an explicit temporary exception to the provider-neutral Language architecture.

## Target contract

Language should call ShinGiTai OpenAi Gateway:

```http
POST /v1/audio/speech
Authorization: Bearer <server-only ShinGiTai key>
Content-Type: application/json
```

```json
{
  "model": "shingitai-language-pronunciation",
  "input": "Text to speak",
  "language": "nb",
  "voice": "teacher-default",
  "format": "mp3",
  "speed": 1
}
```

The Gateway returns an audio stream and resolves the logical model and voice to an allowed local provider. The alias must not be user-controlled.

## 0 NOK and local-first policy

Piper is the preferred initial provider because it can run locally without per-request fees. The Gateway must not silently fall back to a paid provider. If no approved local voice is available, return a controlled unavailable response.

Until the Gateway endpoint exists, production may disable TTS and hide or disable voice controls rather than preserve direct paid OpenAI coupling. Migrating or disabling TTS is intentionally outside the current change batch.
