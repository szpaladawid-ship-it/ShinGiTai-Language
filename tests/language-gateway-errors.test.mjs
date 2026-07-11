import test from "node:test";
import assert from "node:assert/strict";
import {
  ApiResponseError,
  AuthenticationError,
  RateLimitError,
  TimeoutError,
} from "@shingitai/openai-sdk";
import {
  createLanguageGatewayClient,
  mapGatewayError,
} from "../src/integrations/shingitai-openai/client.server.ts";

test("missing API key returns a controlled configuration error", () => {
  const previous = process.env.SHINGITAI_OPENAI_API_KEY;
  delete process.env.SHINGITAI_OPENAI_API_KEY;
  assert.throws(() => createLanguageGatewayClient(), { name: "Error", message: /not configured/ });
  if (previous) process.env.SHINGITAI_OPENAI_API_KEY = previous;
});

test("401 is normalized without raw provider text", () => {
  const mapped = mapGatewayError(new AuthenticationError({ message: "raw secret", status: 401 }));
  assert.equal(mapped.constructor.name, "ShinGiTaiAuthenticationError");
  assert.doesNotMatch(mapped.message, /raw secret/);
});

test("429 is normalized", () => {
  const mapped = mapGatewayError(new RateLimitError({ message: "raw", status: 429 }));
  assert.equal(mapped.constructor.name, "ShinGiTaiRateLimitError");
});

test("timeout is normalized", () => {
  const mapped = mapGatewayError(new TimeoutError({ message: "raw timeout" }));
  assert.equal(mapped.constructor.name, "ShinGiTaiTimeoutError");
});

test("500 is normalized as unavailable", () => {
  const mapped = mapGatewayError(
    new ApiResponseError({ message: "provider exploded", status: 500 }),
  );
  assert.equal(mapped.constructor.name, "ShinGiTaiUnavailableError");
  assert.doesNotMatch(mapped.message, /provider exploded/);
});

test("normalized errors never contain an API key", () => {
  const secret = "sgt_example_secret";
  const mapped = mapGatewayError(new AuthenticationError({ message: secret, status: 401 }));
  assert.doesNotMatch(mapped.message, new RegExp(secret));
});
