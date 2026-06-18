import { getSessionUser } from "@/lib/auth";
import { listTickets } from "@/lib/data/store";
import { SupportClient } from "./SupportClient";

export default async function SupportPage() {
  const user = await getSessionUser();
  const tickets = user ? listTickets(user.id) : [];
  return <SupportClient tickets={tickets} />;
}
