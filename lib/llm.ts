import "server-only";
import { getAssistantSystemPrompt } from "./assistant/prompt";
import type { Locale } from "./i18n/config";
import type { Service } from "./types";

// ============================================================================
// LLM client — talks to Groq's OpenAI-compatible Chat Completions API via fetch
// (no SDK needed). The deterministic safety pipeline in lib/assistant/pipeline.ts
// always runs first and is authoritative; this only phrases a warm, plain-language
// explanation of the services that were ALREADY chosen. If the key is missing or
// the call fails, we return a templated fallback so the demo never breaks.
//
// Provider is set in .env.local (GROQ_API_KEY / GROQ_MODEL / GROQ_BASE_URL).
// ============================================================================

const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  ar: "Arabic",
  tl: "Tagalog (Filipino)",
  hi: "Hindi",
};

function baseUrl(): string {
  // ## [WHAT CAN WE EDIT] default endpoint (override with GROQ_BASE_URL in .env.local)
  return process.env.GROQ_BASE_URL?.trim() || "https://api.groq.com/openai/v1";
}

function model(): string {
  // ## [WHAT CAN WE EDIT] default model (override with GROQ_MODEL in .env.local)
  return process.env.GROQ_MODEL?.trim() || "llama-3.3-70b-versatile";
}

export function llmConfigured(): boolean {
  return Boolean(process.env.GROQ_API_KEY?.trim());
}

export interface ExplanationResult {
  text: string;
  // "llm" when Groq produced the text; "fallback" when no key is set or the call failed.
  source: "llm" | "fallback";
}

function fallbackExplanation(services: Service[], locale: Locale): string {
  const names = services.map((s) => s.name[locale] ?? s.name.en);
  const list = names.join(locale === "ar" ? "، " : ", ");
  // ## [WHAT CAN WE EDIT] wording shown when the LLM is unavailable
  if (locale === "ar") {
    return `بناءً على ما وصفته، قد تساعدك هذه الخدمات: ${list}. يمكنك الحجز الآن، أو التحدث إلى شخص حقيقي في أي وقت.`;
  }
  return `Based on what you described, these may help: ${list}. You can book now, or talk to a real person at any time.`;
}

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

    // Abort if Groq is slow, so the request never hangs the UI.
    const controller = new AbortController();
    // ## [WHAT CAN WE EDIT] request timeout in milliseconds
    const timeout = setTimeout(() => controller.abort(), 20000);

    const res = await fetch(`${baseUrl()}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: model(),
        // ## [WHAT CAN WE EDIT] generation settings (temperature 0–2, max_tokens)
        temperature: 0.6,
        max_tokens: 512,
        stream: false,
        messages: [
          { role: "system", content: getAssistantSystemPrompt() },
          { role: "user", content: userTurn },
        ],
      }),
    }).finally(() => clearTimeout(timeout));

    if (!res.ok) {
      return { text: fallbackExplanation(services, locale), source: "fallback" };
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = json.choices?.[0]?.message?.content?.trim() ?? "";

    return text
      ? { text, source: "llm" }
      : { text: fallbackExplanation(services, locale), source: "fallback" };
  } catch {
    return { text: fallbackExplanation(services, locale), source: "fallback" };
  }
}
