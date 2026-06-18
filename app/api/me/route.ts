import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ signedIn: false });
  return Response.json({
    signedIn: true,
    name: user.fullName,
    onboarded: Boolean(user.profile?.onboarded),
  });
}
