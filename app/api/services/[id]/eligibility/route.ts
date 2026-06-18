import { checkEligibility } from "@/lib/data/store";
import { ensureDemoUser } from "@/lib/demo-session";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const user = await ensureDemoUser();
  const result = checkEligibility(id, user);
  return Response.json(result);
}
