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

async function translateWithGoogle(text: string, targetLang: Language): Promise<string> {
  const target = LANGUAGE_CODES[targetLang];

  // Use the public Google Translate HTTP endpoint which doesn't require
  // a Cloud Translation API key. This avoids the 401
  // "API keys are not supported by this API" error that occurs when
  // using the Cloud Translation Advanced endpoint with an API key.
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "auto");
  url.searchParams.set("tl", target);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);

  const res = await fetch(url.toString(), { method: "GET" });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Google Translate HTTP error ${res.status}: ${body.slice(0, 200)}`
    );
  }

  // Response format is a nested array, we only need the first segment.
  const json = (await res.json()) as any;
  const translated = json?.[0]?.[0]?.[0];
  return typeof translated === "string" && translated.trim()
    ? translated
    : text;
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
    const { text } = args;
    const trimmed = text.trim();
    if (!trimmed) {
      return { en: "", sq: "", it: "" };
    }

    const result: { en: string; sq: string; it: string } = {
      en: "",
      sq: "",
      it: "",
    };

    for (const target of ["en", "sq", "it"] as Language[]) {
      try {
        const translated = await translateWithGoogle(
          trimmed,
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
