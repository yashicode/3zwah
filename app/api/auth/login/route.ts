import type { NextRequest } from "next/server";
import { upsertUserByPhone } from "@/lib/data/store";
import { setSession } from "@/lib/auth";

// Mock sign-in for the demo: any phone works, no code is sent. Creates (or
// reuses) the caregiver and binds the session cookie. Real UAE PASS / OTP
// replaces this later without changing the rest of the app.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const phone = String(body?.phone ?? "").trim();
  const name = String(body?.name ?? "").trim();

  if (phone.length < 4) {
    return Response.json({ ok: false, error: "phone_required" }, { status: 400 });
  }

  const user = upsertUserByPhone(phone, name || undefined);
  await setSession(user.id);

  return Response.json({
    ok: true,
    onboarded: Boolean(user.profile?.onboarded),
  });
}
