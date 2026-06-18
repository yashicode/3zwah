import type { CaregiverProfile, CareGoal, CareNeed } from "./types";

// ## [WHAT CAN WE EDIT] How the questionnaire answers map to what we recommend.
// Left side = a need/goal the caregiver selected; right side = which service
// categories (match seed.ts service.category) and training topics (match
// seed.ts training.topic) become "relevant" for them.

const NEED_MAP: Record<CareNeed, { services: string[]; topics: string[] }> = {
  mobility: { services: ["home_nursing"], topics: ["medical_devices"] },
  chronic_illness: {
    services: ["clinical_appointment", "home_nursing"],
    topics: ["medical_devices"],
  },
  dementia: { services: ["home_nursing", "mental_health"], topics: ["mental_health"] },
  post_hospital: {
    services: ["home_nursing", "clinical_appointment"],
    topics: ["medical_devices"],
  },
  nutrition: { services: ["home_nursing"], topics: ["medical_devices"] },
  medical_devices: { services: ["home_nursing"], topics: ["medical_devices"] },
  palliative: {
    services: ["home_nursing", "mental_health"],
    topics: ["self_care", "mental_health"],
  },
};

const GOAL_MAP: Record<CareGoal, { services: string[]; topics: string[] }> = {
  skills: { services: [], topics: ["medical_devices", "self_care"] },
  self_care: {
    services: ["mental_health", "respite"],
    topics: ["mental_health", "self_care"],
  },
  financial: { services: ["financial_support"], topics: ["financial_literacy"] },
  respite: { services: ["respite"], topics: ["self_care"] },
  appointments: { services: ["clinical_appointment"], topics: [] },
};

function collect(profile: CaregiverProfile | undefined, key: "services" | "topics"): Set<string> {
  const out = new Set<string>();
  if (!profile) return out;
  for (const n of profile.needs) NEED_MAP[n]?.[key].forEach((v) => out.add(v));
  for (const g of profile.goals) GOAL_MAP[g]?.[key].forEach((v) => out.add(v));
  return out;
}

export function relevantServiceCategories(profile?: CaregiverProfile): Set<string> {
  return collect(profile, "services");
}

export function relevantTrainingTopics(profile?: CaregiverProfile): Set<string> {
  return collect(profile, "topics");
}

// Stable sort that floats relevant items to the top without hiding the rest,
// so a caregiver still sees everything but their matches come first.
export function sortByRelevance<T>(
  items: T[],
  isRelevant: (item: T) => boolean,
): T[] {
  return items
    .map((item, i) => ({ item, i, rel: isRelevant(item) ? 0 : 1 }))
    .sort((a, b) => a.rel - b.rel || a.i - b.i)
    .map((x) => x.item);
}
