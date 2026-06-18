import { getSessionUser } from "@/lib/auth";
import { listServices, serviceCategories } from "@/lib/data/store";
import { relevantServiceCategories, sortByRelevance } from "@/lib/tailoring";
import { FindSupportClient } from "./FindSupportClient";

// Find the Right Support: image service cards (relevant-first for signed-in
// caregivers) beside the AI assistant panel.
export default async function FindSupportPage() {
  const user = await getSessionUser();
  const cats = relevantServiceCategories(user?.profile);
  const services = sortByRelevance(listServices(), (s) => cats.has(s.category));
  const relevantIds = services.filter((s) => cats.has(s.category)).map((s) => s.id);

  return (
    <FindSupportClient
      services={services}
      categories={serviceCategories()}
      relevantIds={relevantIds}
    />
  );
}
