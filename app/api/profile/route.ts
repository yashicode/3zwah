import type { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { setProfile } from "@/lib/data/store";
import type { CareGoal, CareNeed, CareRelationship, CaregiverProfile } from "@/lib/types";

const RELATIONSHIPS: CareRelationship[] = ["parent", "spouse", "child", "sibling", "other"];
const NEEDS: CareNeed[] = [
  "mobility", "chronic_illness", "dementia", "post_hospital",
  "nutrition", "medical_devices", "palliative",
];
const GOALS: CareGoal[] = ["skills", "self_care", "financial", "respite", "appointments"];

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return Response.json({ ok: false, error: "not_signed_in" }, { status: 401 });

  const body = await req.json().catch(() => ({}));

  const profile: CaregiverProfile = {
    careRelationship: RELATIONSHIPS.includes(body?.careRelationship)
      ? body.careRelationship
      : "other",
    recipientAgeBand: String(body?.recipientAgeBand ?? "70-79"),
    livesWithCaregiver: Boolean(body?.livesWithCaregiver),
    needs: Array.isArray(body?.needs)
      ? body.needs.filter((n: unknown): n is CareNeed => NEEDS.includes(n as CareNeed))
      : [],
    goals: Array.isArray(body?.goals)
      ? body.goals.filter((g: unknown): g is CareGoal => GOALS.includes(g as CareGoal))
      : [],
    onboarded: true,
    updatedAt: new Date().toISOString(),
  };

  setProfile(user.id, profile);
  return Response.json({ ok: true });
}
