import test from "node:test";
import assert from "node:assert/strict";
import { buildGatewayRequest } from "../src/integrations/shingitai-openai/language-ai.policy.ts";
import {
  assertLanguageCoreProject,
  resolveLanguageCoreProject,
} from "../src/integrations/shingitai-openai/language-core-projects.ts";

test("model is always selected server-side", () => {
  const request = buildGatewayRequest("en", [{ role: "user", content: "hello" }]);
  assert.equal(request.model, "shingitai-language");
  assert.equal(request.stream, false);
});
test("core projects use an explicit language allowlist", () => {
  assert.equal(resolveLanguageCoreProject("en"), "core_languages_english");
  assert.equal(resolveLanguageCoreProject("xx"), "core_languages");
  assert.throws(() => assertLanguageCoreProject("core_programming"));
  assert.throws(() => assertLanguageCoreProject("core_game_dev"));
});

for (const [language, project] of [
  ["english", "core_languages_english"],
  ["en", "core_languages_english"],
  ["norwegian", "core_languages_norwegian"],
  ["no", "core_languages_norwegian"],
  ["nb", "core_languages_norwegian"],
  ["nn", "core_languages_norwegian"],
  ["japanese", "core_languages_japanese"],
  ["ja", "core_languages_japanese"],
  ["polish", "core_languages_polish"],
  ["pl", "core_languages_polish"],
]) {
  test(`${language} maps to ${project}`, () => {
    assert.equal(resolveLanguageCoreProject(language), project);
  });
}
