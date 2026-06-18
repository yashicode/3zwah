import { enroll } from "@/lib/data/store";
import { ensureDemoUser } from "@/lib/demo-session";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const user = await ensureDemoUser();
  const result = enroll(user.id, id);
  if (!result.ok) {
    return Response.json({ ok: false, reason: result.reason }, { status: 400 });
  }
  return Response.json({ ok: true, enrollment: result.enrollment });
}
