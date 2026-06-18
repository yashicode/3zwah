import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { getAssistantSystemPrompt } from "./assistant/prompt";
import type { Locale } from "./i18n/config";
import type { Service } from "./types";

const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  ar: "Arabic",
  tl: "Tagalog (Filipino)",
  hi: "Hindi",
};

export function llmConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export interface ExplanationResult {
  text: string;
  // "llm" when a live Claude call produced the text; "fallback" when no key is
  // configured or the call failed (so the demo never breaks in front of people).
  source: "llm" | "fallback";
}

function fallbackExplanation(services: Service[], locale: Locale): string {
  const names = services.map((s) => s.name[locale] ?? s.name.en);
  const list = names.join(locale === "ar" ? "، " : ", ");
  if (locale === "ar") {
    return `بناءً على ما وصفته، قد تساعدك هذه الخدمات: ${list}. يمكنك الحجز الآن، أو التحدث إلى شخص حقيقي في أي وقت.`;
  }
  return `Based on what you described, these may help: ${list}. You can book now, or talk to a real person at any time.`;
}

// Asks the live model only to phrase an explanation of the already-selected
// services. Returns a templated fallback when no API key is set or on any error.
export async function explainSuggestions(opts: {
  userMessage: string;
  category: string;
  services: Service[];
  locale: Locale;
}): Promise<ExplanationResult> {
  const { userMessage, category, services, locale } = opts;

  if (!llmConfigured() || services.length === 0) {
    return { text: fallbackExplanation(services, locale), source: "fallback" };
  }

  try {
    const client = new Anthropic();
    const catalog = services
      .map((s) => `- ${s.name.en} (${s.category}): ${s.description.en}`)
      .join("\n");

    const userTurn = [
      `Caregiver message: "${userMessage}"`,
      `Detected need category: ${category}`,
      `Services already selected for them:`,
      catalog,
      ``,
      `Write the explanation in ${LOCALE_NAMES[locale]}.`,
    ].join("\n");

    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      thinking: { type: "adaptive" },
      system: getAssistantSystemPrompt(),
      messages: [{ role: "user", content: userTurn }],
    });

    const text = response.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("")
      .trim();

    return text
      ? { text, source: "llm" }
      : { text: fallbackExplanation(services, locale), source: "fallback" };
  } catch {
    return { text: fallbackExplanation(services, locale), source: "fallback" };
  }
}
