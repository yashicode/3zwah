import { listPartners } from "@/lib/data/store";
import { PartnersView } from "./PartnersView";

export default function PartnersPage() {
  return <PartnersView partners={listPartners()} />;
}
