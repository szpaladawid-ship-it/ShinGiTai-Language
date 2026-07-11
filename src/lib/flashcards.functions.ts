import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const CefrLevel = z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]);

// Resolve the learner's native language name (defaults to English).
async function getNativeName(supabase: SupabaseClient<Database>, userId: string): Promise<string> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("native_language_code")
    .eq("id", userId)
    .maybeSingle();
  if (!profile?.native_language_code) return "English";
  const { data: nativeLang } = await supabase
    .from("languages")
    .select("name")
    .eq("code", profile.native_language_code)
    .maybeSingle();
  return nativeLang?.name ?? "English";
}

// Level-appropriate topic sets for auto-generated starter decks.
const STARTER_TOPICS: Record<string, string> = {
  A1: "essential everyday words: greetings, numbers, common objects, family, food and drinks, days and colours",
  A2: "everyday life: shopping, travel, directions, daily routines, weather, hobbies and simple past-tense verbs",
  B1: "work and study, opinions and feelings, health, technology, travel plans and common phrasal expressions",
  B2: "abstract topics: environment, media, culture, relationships, argument connectors and nuanced adjectives",
  C1: "advanced vocabulary: politics, economics, science, idioms, formal register and precise synonyms",
  C2: "near-native mastery: rare idioms, literary and academic vocabulary, subtle connotations and collocations",
};

export const listDecks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: decks, error } = await supabase
      .from("flashcard_decks")
      .select("id, name, description, language_code, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);

    const today = new Date().toISOString().slice(0, 10);
    const { data: cards } = await supabase
      .from("flashcards")
      .select("deck_id, due_date")
      .eq("user_id", userId);

    const counts: Record<string, { total: number; due: number }> = {};
    for (const c of cards ?? []) {
      const entry = (counts[c.deck_id] ??= { total: 0, due: 0 });
      entry.total += 1;
      if (c.due_date <= today) entry.due += 1;
    }

    return (decks ?? []).map((d) => ({
      ...d,
      total: counts[d.id]?.total ?? 0,
      due: counts[d.id]?.due ?? 0,
    }));
  });

export const createDeck = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        name: z.string().min(1).max(80),
        language_code: z.string().min(2),
        description: z.string().max(300).optional(),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("flashcard_decks")
      .insert({
        user_id: userId,
        name: data.name,
        language_code: data.language_code,
        description: data.description ?? null,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteDeck = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("flashcard_decks")
      .delete()
      .eq("id", data.id)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getDeck = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { data: deck, error } = await supabase
      .from("flashcard_decks")
      .select("id, name, description, language_code")
      .eq("id", data.id)
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!deck) return null;

    const { data: cards, error: cardsError } = await supabase
      .from("flashcards")
      .select("id, front, back, example, emoji, due_date, repetitions")
      .eq("deck_id", data.id)
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    if (cardsError) throw new Error(cardsError.message);

    return { deck, cards: cards ?? [] };
  });

export const addCard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        deck_id: z.string().uuid(),
        front: z.string().min(1).max(200),
        back: z.string().min(1).max(200),
        example: z.string().max(300).optional(),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("flashcards").insert({
      deck_id: data.deck_id,
      user_id: userId,
      front: data.front,
      back: data.back,
      example: data.example ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteCard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("flashcards")
      .delete()
      .eq("id", data.id)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getDueCards = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ deckId: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const today = new Date().toISOString().slice(0, 10);
    const { data: cards, error } = await supabase
      .from("flashcards")
      .select("id, front, back, example, emoji, ease_factor, interval_days, repetitions")
      .eq("deck_id", data.deckId)
      .eq("user_id", userId)
      .lte("due_date", today)
      .order("due_date", { ascending: true })
      .limit(50);
    if (error) throw new Error(error.message);
    return cards ?? [];
  });

// SM-2 review. quality: 0 again, 1 hard, 2 good, 3 easy
const QUALITY_MAP = [2, 3, 4, 5];

export const reviewCard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        rating: z.number().int().min(0).max(3),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { data: card, error } = await supabase
      .from("flashcards")
      .select("id, ease_factor, interval_days, repetitions")
      .eq("id", data.id)
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!card) throw new Error("Card not found");

    const quality = QUALITY_MAP[data.rating];
    let { ease_factor, interval_days, repetitions } = card;

    if (quality < 3) {
      repetitions = 0;
      interval_days = 1;
    } else {
      if (repetitions === 0) interval_days = 1;
      else if (repetitions === 1) interval_days = 6;
      else interval_days = Math.round(interval_days * Number(ease_factor));
      repetitions += 1;
    }
    ease_factor =
      Math.round(
        (Math.max(
          1.3,
          Number(ease_factor) + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
        ) +
          Number.EPSILON) *
          100,
      ) / 100;

    const due = new Date();
    due.setUTCDate(due.getUTCDate() + interval_days);
    const due_date = due.toISOString().slice(0, 10);

    const { error: updError } = await supabase
      .from("flashcards")
      .update({
        ease_factor,
        interval_days,
        repetitions,
        due_date,
        last_reviewed_at: new Date().toISOString(),
      })
      .eq("id", data.id)
      .eq("user_id", userId);
    if (updError) throw new Error(updError.message);

    // small XP reward
    await bumpXp(supabase, userId, 2);

    return { ok: true, interval_days };
  });

export const generateFlashcards = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        deck_id: z.string().uuid(),
        topic: z.string().min(1).max(120),
        level: CefrLevel,
        count: z.number().int().min(3).max(15),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { data: deck } = await supabase
      .from("flashcard_decks")
      .select("id, language_code")
      .eq("id", data.deck_id)
      .eq("user_id", userId)
      .maybeSingle();
    if (!deck) throw new Error("Deck not found");

    const { data: language } = await supabase
      .from("languages")
      .select("name")
      .eq("code", deck.language_code)
      .maybeSingle();
    const languageName = language?.name ?? deck.language_code;
    const nativeName = await getNativeName(supabase, userId);

    const { completeLanguageAi } = await import("@/integrations/shingitai-openai");
    const { text } = await completeLanguageAi({
      mode: "teacher",
      targetLanguageCode: deck.language_code,
      messages: [
        {
          role: "user",
          content: `Generate ${data.count} vocabulary flashcards for a ${nativeName}-speaking learner of ${languageName} at CEFR level ${data.level}, on the topic "${data.topic}".
Each card: "front" is a word or short phrase in ${languageName}, "back" is the translation into ${nativeName} (the learner's native language, NOT English unless ${nativeName} is English), "example" is a short natural example sentence in ${languageName}, "emoji" is a single emoji that visually represents the word to aid memory (use a neutral one like ✨ only if nothing fits).
Keep them appropriate for level ${data.level}. Return only JSON: {"cards":[{"front":"","back":"","example":"","emoji":""}]}.`,
        },
      ],
    });
    const output = JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/gi, "")) as {
      cards?: Array<{ front: string; back: string; example: string; emoji: string }>;
    };

    const cards = (output?.cards ?? []).slice(0, data.count).filter((c) => c.front && c.back);
    if (cards.length === 0) throw new Error("No cards generated");

    const { error: insErr } = await supabase.from("flashcards").insert(
      cards.map((c) => ({
        deck_id: data.deck_id,
        user_id: userId,
        front: c.front,
        back: c.back,
        example: c.example || null,
        emoji: c.emoji || null,
      })),
    );
    if (insErr) throw new Error(insErr.message);

    return { inserted: cards.length };
  });

// Creates a ready-made starter deck for a language + CEFR level and fills it
// with AI-generated vocabulary translated into the learner's native language.
export const createStarterDeck = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        language_code: z.string().min(2),
        level: CefrLevel,
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    const { data: language } = await supabase
      .from("languages")
      .select("name")
      .eq("code", data.language_code)
      .maybeSingle();
    const languageName = language?.name ?? data.language_code;
    const nativeName = await getNativeName(supabase, userId);

    // Reuse an existing starter deck for this language + level if present.
    const deckName = `${languageName} · ${data.level} Starter`;
    const { data: existing } = await supabase
      .from("flashcard_decks")
      .select("id")
      .eq("user_id", userId)
      .eq("name", deckName)
      .maybeSingle();

    let deckId = existing?.id as string | undefined;
    if (!deckId) {
      const { data: row, error } = await supabase
        .from("flashcard_decks")
        .insert({
          user_id: userId,
          name: deckName,
          language_code: data.language_code,
          description: `Ready-made ${data.level} vocabulary for ${languageName}.`,
        })
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      deckId = row.id;
    }

    const { completeLanguageAi } = await import("@/integrations/shingitai-openai");
    const topics = STARTER_TOPICS[data.level] ?? STARTER_TOPICS.A1;
    const { text } = await completeLanguageAi({
      mode: "teacher",
      targetLanguageCode: data.language_code,
      messages: [
        {
          role: "user",
          content: `Generate 14 high-frequency vocabulary flashcards for a ${nativeName}-speaking learner of ${languageName} at CEFR level ${data.level}.
Cover a good spread of ${topics}.
Each card: "front" is a word or short phrase in ${languageName}, "back" is the translation into ${nativeName} (the learner's native language, NOT English unless ${nativeName} is English), "example" is a short natural example sentence in ${languageName}, "emoji" is a single emoji that visually represents the word to aid memory (use ✨ only if nothing fits).
Keep them appropriate for level ${data.level} and avoid duplicates. Return only JSON: {"cards":[{"front":"","back":"","example":"","emoji":""}]}.`,
        },
      ],
    });
    const output = JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/gi, "")) as {
      cards?: Array<{ front: string; back: string; example: string; emoji: string }>;
    };

    const cards = (output?.cards ?? []).filter((c) => c.front && c.back);
    if (cards.length === 0) throw new Error("No cards generated");

    const { error: insErr } = await supabase.from("flashcards").insert(
      cards.map((c) => ({
        deck_id: deckId,
        user_id: userId,
        front: c.front,
        back: c.back,
        example: c.example || null,
        emoji: c.emoji || null,
      })),
    );
    if (insErr) throw new Error(insErr.message);

    return { deck_id: deckId, inserted: cards.length };
  });

async function bumpXp(supabase: SupabaseClient<Database>, userId: string, amount: number) {
  const { data: stats } = await supabase
    .from("user_stats")
    .select("total_xp")
    .eq("user_id", userId)
    .maybeSingle();
  const current = stats?.total_xp ?? 0;
  await supabase
    .from("user_stats")
    .update({
      total_xp: current + amount,
      last_activity_date: new Date().toISOString().slice(0, 10),
    })
    .eq("user_id", userId);
}
