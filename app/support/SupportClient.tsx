"use client";

import { useI18n } from "@/lib/i18n/provider";
import type { SupportTicket } from "@/lib/types";

export function SupportClient({ tickets }: { tickets: SupportTicket[] }) {
  const { t, locale } = useI18n();

  // ## [WHAT CAN WE EDIT] support contact channels + their real links/numbers
  const channels = [
    { key: "chat", href: "#", primary: true },
    { key: "whatsapp", href: "https://wa.me/97150000000" },
    { key: "phone", href: "tel:+97180000000" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-foreground">{t("support.title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("support.subtitle")}</p>

      <h2 className="mt-8 font-heading text-xl font-semibold text-foreground">
        {t("support.channels")}
      </h2>
      <div className="mt-4 flex flex-wrap gap-3">
        {channels.map((c) => (
          <a
            key={c.key}
            href={c.href}
            className={`inline-flex min-h-12 items-center rounded-lg px-6 font-semibold transition-colors ${
              c.primary
                ? "bg-accent text-white hover:bg-accent-hover"
                : "border border-border bg-surface text-foreground hover:bg-muted"
            }`}
          >
            {t(`support.${c.key}`)}
          </a>
        ))}
      </div>

      <h2 className="mt-10 font-heading text-xl font-semibold text-foreground">
        {t("support.myTickets")}
      </h2>
      {tickets.length === 0 ? (
        <p className="mt-3 text-muted-foreground">{t("support.noTickets")}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {tickets.map((ticket) => (
            <li
              key={ticket.id}
              className="rounded-xl border border-border bg-surface p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-foreground">
                  {ticket.category.replace(/_/g, " ")}
                </span>
                <div className="flex gap-2">
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-link">
                    {t(`support.priority.${ticket.priority}`)}
                  </span>
                  <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                    {t(`support.ticketStatus.${ticket.status}`)}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("support.respondBy").replace(
                  "{time}",
                  new Date(ticket.sla.respondBy).toLocaleString(locale, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }),
                )}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
