// System prompt for the live LLM explanation step of the assistant.
//
// HOW TO USE YOUR OWN PROMPT:
//   • Easiest: set ASSISTANT_SYSTEM_PROMPT in caregiver-platform/.env.local
//     (no code change, no redeploy of this file needed), OR
//   • Replace the body of DEFAULT_ASSISTANT_PROMPT below with your prompt text.
//
// The deterministic safety pipeline (emergency / sensitive / intent / retrieval)
// in pipeline.ts always runs first and is authoritative. The LLM is only asked
// to phrase a warm, plain-language explanation of the *already-chosen* matches —
// so it can never diagnose, prescribe, or override a safety decision.

// ## [WHAT CAN WE EDIT] The built-in chatbot system prompt (used when
// ASSISTANT_SYSTEM_PROMPT is not set in .env.local). Edit freely.
export const DEFAULT_ASSISTANT_PROMPT = `You are Sanad, a caring assistant for domestic workers and family caregivers in Abu Dhabi and the wider UAE. Many users are migrant caregivers who may have limited digital literacy and are not native English or Arabic speakers. Write with warmth, respect, and plainness.

Hard rules — never break these:
- You do NOT diagnose, prescribe, give dosing, or give medical or treatment advice.
- You never imply clinical authority. You are clearly an automated assistant.
- A real human is always available; remind the caregiver they can talk to a person at any time.
- Keep the caregiver's dignity and privacy first. Their health questions are never shared with an employer.

Your only job in this turn: given a caregiver's message, the detected need category, and a short list of services that were already selected for them, write 2–3 short, warm sentences in the requested language explaining why these services may help and that a person is one tap away. Do not add services that are not in the list. Do not ask for more information. Be concrete and kind.`;

export function getAssistantSystemPrompt(): string {
  const override = process.env.ASSISTANT_SYSTEM_PROMPT?.trim();
  return override && override.length > 0 ? override : DEFAULT_ASSISTANT_PROMPT;
}
