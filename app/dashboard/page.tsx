import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { listServices, listTrainings } from "@/lib/data/store";
import {
  relevantServiceCategories,
  relevantTrainingTopics,
} from "@/lib/tailoring";
import { DashboardView } from "./DashboardView";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!user.profile?.onboarded) redirect("/welcome");

  const topics = relevantTrainingTopics(user.profile);
  const cats = relevantServiceCategories(user.profile);

  const allWorkshops = listTrainings();
  const allServices = listServices();

  // Relevant-first; fall back to a default few if the profile matched nothing.
  const workshops = (
    topics.size ? allWorkshops.filter((w) => topics.has(w.topic)) : allWorkshops
  ).slice(0, 3);
  const services = (
    cats.size ? allServices.filter((s) => cats.has(s.category)) : allServices
  ).slice(0, 3);

  return (
    <DashboardView
      name={user.fullName}
      relationship={user.profile.careRelationship}
      workshops={workshops}
      services={services}
    />
  );
}
