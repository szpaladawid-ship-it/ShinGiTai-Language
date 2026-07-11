// Server-only helper: generates CEFR-style certification exam questions via the
// ShinGiTai OpenAI provider. Imported only by server functions (filename blocks it from
// the client bundle).

export type GeneratedQuestion = {
  section: string;
  prompt: string;
  options: string[];
  correct_index: number;
};

const SECTIONS = ["grammar", "vocabulary", "reading"];

function extractJson(raw: string): string {
  let s = raw.trim();
  // Strip ```json ... ``` fences if present.
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) s = fence[1].trim();
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    s = s.slice(start, end + 1);
  }
  return s;
}

function isValidQuestion(q: unknown): q is GeneratedQuestion {
  if (!q || typeof q !== "object") return false;
  const r = q as Record<string, unknown>;
  return (
    typeof r.prompt === "string" &&
    r.prompt.trim().length > 0 &&
    Array.isArray(r.options) &&
    r.options.length === 4 &&
    r.options.every((o) => typeof o === "string" && o.trim().length > 0) &&
    typeof r.correct_index === "number" &&
    r.correct_index >= 0 &&
    r.correct_index <= 3
  );
}

export async function generateExamQuestions(
  languageName: string,
  nativeName: string,
  level: string,
  count: number,
): Promise<GeneratedQuestion[]> {
  const system =
    "You are an expert CEFR language examiner who writes official-style certification exams. " +
    "You respond ONLY with valid JSON and nothing else.";

  const user = `Create a ${count}-question multiple-choice certification exam at CEFR level ${level} for learners of ${languageName} whose native language is ${nativeName}.

Requirements:
- Difficulty MUST match CEFR ${level} (A1 easiest, C2 hardest).
- Mix the sections: grammar, vocabulary, and short reading comprehension.
- Each question has EXACTLY 4 options and exactly one correct answer.
- Vary the position of the correct answer across questions.
- Test real ${languageName} usage. Write any instructions, question prompts and explanations in ${nativeName} (the learner's native language), but the language being tested is ${languageName}.

Return ONLY this JSON shape:
{"questions":[{"section":"grammar","prompt":"...","options":["...","...","...","..."],"correct_index":0}]}`;

  const { completeLanguageAi } = await import("@/integrations/shingitai-openai");
  const { text: content } = await completeLanguageAi({
    mode: "teacher",
    targetLanguageCode: languageName,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJson(content));
  } catch {
    throw new Error("Exam generation returned an invalid response. Please try again.");
  }

  const list = (parsed as { questions?: unknown }).questions;
  const questions = (Array.isArray(list) ? list : [])
    .filter(isValidQuestion)
    .map((q) => ({
      section: SECTIONS.includes(q.section) ? q.section : "grammar",
      prompt: q.prompt.trim(),
      options: q.options.map((o) => o.trim()),
      correct_index: q.correct_index,
    }))
    .slice(0, count);

  return questions;
}
