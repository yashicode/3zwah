import { getSessionUser } from "@/lib/auth";
import { listCenters, listTrainings } from "@/lib/data/store";
import { relevantTrainingTopics, sortByRelevance } from "@/lib/tailoring";
import { WorkshopsClient } from "./WorkshopsClient";

// Care Skills & Workshops: image session cards with venue detail and register,
// matched-first for signed-in caregivers.
export default async function WorkshopsPage() {
  const user = await getSessionUser();
  const topics = relevantTrainingTopics(user?.profile);
  const trainings = sortByRelevance(listTrainings(), (t) => topics.has(t.topic));
  const relevantIds = trainings.filter((t) => topics.has(t.topic)).map((t) => t.id);

  return (
    <WorkshopsClient
      trainings={trainings}
      centers={listCenters()}
      relevantIds={relevantIds}
    />
  );
}
