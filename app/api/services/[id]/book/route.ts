import type { NextRequest } from "next/server";
import { createAppointment } from "@/lib/data/store";
import { ensureDemoUser } from "@/lib/demo-session";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const user = await ensureDemoUser();

  const startsAt =
    typeof body?.startsAt === "string"
      ? body.startsAt
      : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

  const result = createAppointment(user.id, id, startsAt);
  if (!result.ok) {
    return Response.json({ ok: false, reason: result.reason }, { status: 400 });
  }
  return Response.json({ ok: true, appointment: result.appointment });
}
