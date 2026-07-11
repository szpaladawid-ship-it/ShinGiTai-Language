import { createLanguageGatewayClient, mapGatewayError } from "./client.server";
import { InvalidAiResponseError } from "./errors";
import { buildGatewayRequest } from "./language-ai.policy";
import type { LanguageAiRequest, LanguageAiResponse } from "./language-ai.types";

export async function completeLanguageAi(request: LanguageAiRequest): Promise<LanguageAiResponse> {
  try {
    const response = await createLanguageGatewayClient().chat(
      buildGatewayRequest(request.targetLanguageCode, request.messages),
      { signal: request.signal },
    );
    const text = response.choices?.[0]?.message?.content?.trim();
    if (!text) throw new InvalidAiResponseError("Language AI returned an empty response");
    return { text };
  } catch (error) {
    if (error instanceof InvalidAiResponseError) throw error;
    throw mapGatewayError(error);
  }
}
