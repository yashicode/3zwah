import type { NextRequest } from "next/server";
import { createTicket } from "@/lib/data/store";
import { ensureDemoUser } from "@/lib/demo-session";
import type { TicketPriority } from "@/lib/types";

const PRIORITIES: TicketPriority[] = ["low", "normal", "high", "urgent"];

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const user = await ensureDemoUser();

  const priority: TicketPriority = PRIORITIES.includes(body?.priority)
    ? body.priority
    : "normal";

  const context = Array.isArray(body?.context)
    ? body.context
        .filter(
          (m: unknown): m is { role: "user" | "assistant"; text: string } =>
            !!m &&
            typeof m === "object" &&
            "text" in m &&
            "role" in m,
        )
        .slice(0, 20)
    : undefined;

  // createTicket only persists contextSnapshot if the user consented to AI
  // processing — honored inside the store, not here.
  const ticket = createTicket({
    userId: user.id,
    origin: body?.origin === "direct" ? "direct" : "chatbot_handoff",
    category: String(body?.category ?? "general"),
    priority,
    contextSnapshot: context,
  });

  return Response.json({ ticket });
}
