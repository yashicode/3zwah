import type { NextRequest } from "next/server";
import { runAssistant } from "@/lib/assistant/pipeline";
import { getService, setConsent } from "@/lib/data/store";
import { ensureDemoUser } from "@/lib/demo-session";
import { explainSuggestions, llmConfigured } from "@/lib/llm";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import type { Service } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const text = String(body?.text ?? "").slice(0, 2000);
  const locale = isLocale(body?.locale) ? body.locale : defaultLocale;
  const consent = Boolean(body?.consent);

  const user = await ensureDemoUser();
  // The caregiver agreed to AI processing on the consent gate — log it so any
  // later human handoff is allowed to carry the conversation context.
  if (consent) setConsent(user.id, "ai_processing", true);

  const outcome = runAssistant(text);

  if (outcome.kind === "suggestions") {
    const services = outcome.serviceIds
      .map((id) => getService(id))
      .filter((s): s is Service => Boolean(s));
    const { text: explanation, source } = await explainSuggestions({
      userMessage: text,
      category: outcome.category,
      services,
      locale,
    });
    return Response.json({ outcome, services, explanation, llm: source });
  }

  return Response.json({ outcome, llm: llmConfigured() ? "llm" : "fallback" });
}
