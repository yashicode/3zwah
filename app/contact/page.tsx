import { getSessionUser } from "@/lib/auth";
import { listTickets } from "@/lib/data/store";
import { SupportClient } from "../support/SupportClient";

// Talk to Our Team (human support + your requests).
export default async function ContactPage() {
  const user = await getSessionUser();
  const tickets = user ? listTickets(user.id) : [];
  return <SupportClient tickets={tickets} />;
}
