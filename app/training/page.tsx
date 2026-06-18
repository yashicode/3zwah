import { listCenters, listTrainings } from "@/lib/data/store";
import { TrainingClient } from "./TrainingClient";

export default function TrainingPage() {
  const trainings = listTrainings();
  const centers = listCenters();
  return <TrainingClient trainings={trainings} centers={centers} />;
}
