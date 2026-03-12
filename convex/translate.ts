"use node";

/**
 * Google Cloud Translation API integration.
 * Set GOOGLE_TRANSLATE_API_KEY via: npx convex env set GOOGLE_TRANSLATE_API_KEY <your-key>
 */

import { action } from "./_generated/server";
import { v } from "convex/values";

export type Language = "en" | "sq" | "it";

const LANGUAGE_CODES: Record<Language, string> = {
  en: "en",
  sq: "sq",
  it: "it",
};

async function translateWithGoogle(
  text: string,
  sourceLang: Language,
  targetLang: Language
): Promise<string> {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_TRANSLATE_API_KEY is not configured");
  }

  const params = new URLSearchParams({
    q: text,
    target: LANGUAGE_CODES[targetLang],
    source: LANGUAGE_CODES[sourceLang],
    key: apiKey,
  });

  const res = await fetch(
    `https://translation.googleapis.com/language/translate/v2?${params.toString()}`,
    { method: "POST" }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Google Translation API error ${res.status}: ${body.slice(0, 200)}`
    );
  }

  const json = (await res.json()) as {
    data?: { translations?: Array<{ translatedText?: string }> };
  };
  const translated =
    json.data?.translations?.[0]?.translatedText ?? text;
  return translated;
}

export const translateToAllLanguages = action({
  args: {
    text: v.string(),
    sourceLanguage: v.union(v.literal("en"), v.literal("sq"), v.literal("it")),
  },
  returns: v.object({
    en: v.string(),
    sq: v.string(),
    it: v.string(),
  }),
  handler: async (ctx, args): Promise<{ en: string; sq: string; it: string }> => {
    const { text, sourceLanguage } = args;
    const trimmed = text.trim();
    if (!trimmed) {
      return { en: "", sq: "", it: "" };
    }

    const targets: Language[] = ["en", "sq", "it"].filter(
      (l) => l !== sourceLanguage
    ) as Language[];

    const result: { en: string; sq: string; it: string } = {
      en: sourceLanguage === "en" ? trimmed : "",
      sq: sourceLanguage === "sq" ? trimmed : "",
      it: sourceLanguage === "it" ? trimmed : "",
    };

    for (const target of targets) {
      try {
        const translated = await translateWithGoogle(
          trimmed,
          sourceLanguage,
          target
        );
        result[target] = translated;
      } catch (err) {
        console.error(`Translation failed for ${target}:`, err);
        result[target] = trimmed;
      }
    }

    return result;
  },
});
