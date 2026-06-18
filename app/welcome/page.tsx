import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { Questionnaire } from "./Questionnaire";

export default async function WelcomePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return <Questionnaire />;
}
