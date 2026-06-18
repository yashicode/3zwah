import { listServices } from "../data/store";

// ---------------------------------------------------------------------------
// Caregiver-needs assistant pipeline (brief §5 and §7.3).
//
// This is a deterministic, rule-based stand-in for the production pipeline:
//   detect language -> safety check -> intent classification -> RAG retrieval.
// It deliberately mirrors the real contract so a hosted LLM + pgvector store
// can replace the internals without changing callers or the response shape.
//
// SAFETY NOTE: real deployment must run the safety check on a reliably
// understood form of the message (not a lossy machine translation) and must
// measure emergency-recall (false negatives) on a held-out test set. The
// keyword lists below are illustrative, English-biased, and NOT sufficient
// for production. This is exactly the gap flagged in analysis.
// ---------------------------------------------------------------------------

// ## [WHAT CAN WE EDIT] How sure the bot must be before suggesting (0–1).
// Lower = suggests more often; higher = hands off to a human more often.
export const INTENT_CONFIDENCE_THRESHOLD = 0.34;

// ## [WHAT CAN WE EDIT] Phrases that trigger the emergency stop screen (998/999).
const EMERGENCY_TERMS = [
  "can't breathe", "cant breathe", "not breathing", "stopped breathing",
  "chest pain", "heart attack", "stroke", "unconscious", "not waking",
  "bleeding a lot", "severe bleeding", "choking", "overdose", "seizure",
  "suicide", "kill myself", "end my life", "want to die",
];

// ## [WHAT CAN WE EDIT] Sensitive topics that route straight to a human
// (labour/abuse/safeguarding) instead of an automated suggestion.
const SENSITIVE_TERMS = [
  "abuse", "hitting me", "hit me", "beat me", "passport", "not paid",
  "no salary", "trapped", "locked", "threatened", "scared of my employer",
];

// ## [WHAT CAN WE EDIT] Keyword → need-category rules. Add categories or terms
// to make the bot recognise more needs. Categories should match service.category
// values in lib/data/seed.ts.
const INTENT_RULES: { category: string; terms: string[] }[] = [
  { category: "mental_health", terms: ["overwhelmed", "stressed", "stress", "burnout", "anxious", "anxiety", "sad", "depressed", "lonely", "cry", "exhausted mentally", "cant cope", "can't cope"] },
  { category: "home_nursing", terms: ["won't eat", "wont eat", "not eating", "feeding", "wound", "bedsore", "pressure sore", "change dressing", "bedridden", "catheter", "injection"] },
  { category: "clinical_appointment", terms: ["doctor", "appointment", "clinic", "fever", "pain", "sick", "check up", "checkup", "blood pressure", "diabetes", "medicine"] },
  { category: "financial_support", terms: ["money", "debt", "afford", "salary", "remittance", "send money", "financial", "loan", "cant pay", "can't pay"] },
  { category: "respite", terms: ["tired", "rest", "break", "no time", "exhausted", "respite", "relief", "cover for me"] },
  { category: "training:medical_devices", terms: ["how to use", "oxygen", "glucometer", "machine", "device", "wheelchair", "equipment"] },
];

export type AssistantOutcome =
  | { kind: "emergency" }
  | {
      kind: "handoff";
      reason: "sensitive" | "out_of_scope" | "low_confidence";
      category?: string;
    }
  | {
      kind: "suggestions";
      category: string;
      confidence: number;
      serviceIds: string[];
    };

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function matchScore(text: string, terms: string[]): number {
  let hits = 0;
  for (const term of terms) if (text.includes(term)) hits += 1;
  // Bounded confidence from keyword density.
  return Math.min(1, hits === 0 ? 0 : 0.34 + hits * 0.22);
}

export function runAssistant(rawText: string): AssistantOutcome {
  const text = normalize(rawText);

  // 1. Safety: emergencies stop everything.
  if (EMERGENCY_TERMS.some((t) => text.includes(t))) {
    return { kind: "emergency" };
  }

  // 2. Safety: sensitive/safeguarding topics go to a human immediately.
  if (SENSITIVE_TERMS.some((t) => text.includes(t))) {
    return { kind: "handoff", reason: "sensitive" };
  }

  // 3. Intent classification.
  let best: { category: string; score: number } | null = null;
  for (const rule of INTENT_RULES) {
    const score = matchScore(text, rule.terms);
    if (score > 0 && (!best || score > best.score)) {
      best = { category: rule.category, score };
    }
  }

  if (!best) {
    return { kind: "handoff", reason: "out_of_scope" };
  }
  if (best.score < INTENT_CONFIDENCE_THRESHOLD) {
    return { kind: "handoff", reason: "low_confidence", category: best.category };
  }

  // 4. Retrieval (RAG stand-in): map category, then rank by tag overlap.
  const serviceCategory = best.category.startsWith("training:")
    ? "home_nursing" // device questions still surface a nursing/clinical service
    : best.category;

  const candidates = listServices(undefined, undefined)
    .map((s) => {
      const overlap = s.tags.filter((tag) => text.includes(tag)).length;
      const categoryMatch = s.category === serviceCategory ? 2 : 0;
      return { id: s.id, rank: overlap + categoryMatch };
    })
    .filter((c) => c.rank > 0)
    .sort((a, b) => b.rank - a.rank);

  const serviceIds = (candidates.length
    ? candidates
    : listServices(undefined, serviceCategory).map((s) => ({ id: s.id, rank: 1 }))
  )
    .slice(0, 3)
    .map((c) => c.id);

  if (serviceIds.length === 0) {
    return { kind: "handoff", reason: "low_confidence", category: best.category };
  }

  return {
    kind: "suggestions",
    category: best.category,
    confidence: Number(best.score.toFixed(2)),
    serviceIds,
  };
}
