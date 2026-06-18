"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";
import type { Service } from "@/lib/types";

export function ServicesClient({
  services,
  categories,
}: {
  services: Service[];
  categories: string[];
}) {
  const { t, locale } = useI18n();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services.filter((s) => {
      if (category && s.category !== category) return false;
      if (!q) return true;
      const hay = [s.name.en, s.description.en, s.category, ...s.tags]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [services, query, category]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-foreground">{t("services.title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("services.subtitle")}</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="svc-search" className="sr-only">
            {t("services.search")}
          </label>
          <input
            id="svc-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("services.searchPlaceholder")}
            className="min-h-12 w-full rounded-lg border border-border bg-surface px-4 text-base text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div>
          <label htmlFor="svc-cat" className="sr-only">
            {t("services.category")}
          </label>
          <select
            id="svc-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="min-h-12 w-full rounded-lg border border-border bg-surface px-4 text-base text-foreground sm:w-56"
          >
            <option value="">{t("training.filterAll")}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {filtered.map((s) => (
          <ServiceCard key={s.id} service={s} locale={locale} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="mt-10 text-center text-muted-foreground">{t("services.empty")}</p>
      )}
    </div>
  );
}

function ServiceCard({ service, locale }: { service: Service; locale: string }) {
  const { t } = useI18n();
  const [elig, setElig] = useState<null | { eligible: boolean; messages: string[] }>(null);
  const [checking, setChecking] = useState(false);
  const [booking, setBooking] = useState<"idle" | "booking" | "booked">("idle");

  const name = service.name[locale as keyof typeof service.name] ?? service.name.en;
  const desc =
    service.description[locale as keyof typeof service.description] ??
    service.description.en;

  async function checkEligibility() {
    setChecking(true);
    try {
      const res = await fetch(`/api/services/${service.id}/eligibility`, {
        method: "POST",
      });
      setElig(await res.json());
    } catch {
      /* ignore */
    } finally {
      setChecking(false);
    }
  }

  async function book() {
    setBooking("booking");
    try {
      await fetch(`/api/services/${service.id}/book`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      });
      setBooking("booked");
    } catch {
      setBooking("idle");
    }
  }

  return (
    <div className="flex flex-col rounded-xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading text-lg font-semibold text-link">{name}</h3>
        {service.free && (
          <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
            Free
          </span>
        )}
      </div>
      <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{desc}</p>
      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {t("services.provider")}: {t(`services.providerType.${service.providerType}`)}
      </p>

      {elig && (
        <div
          className={`mt-3 rounded-lg px-3 py-2 text-sm ${
            elig.eligible
              ? "bg-success/10 text-success"
              : "bg-warning-surface text-warning"
          }`}
        >
          <p className="font-semibold">
            {elig.eligible ? t("services.eligible") : t("services.notEligible")}
          </p>
          {elig.messages.map((m, i) => (
            <p key={i}>{m}</p>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={checkEligibility}
          disabled={checking}
          className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-60"
        >
          {checking ? t("common.loading") : t("services.checkEligibility")}
        </button>
        <button
          type="button"
          onClick={book}
          disabled={booking !== "idle"}
          className="inline-flex min-h-11 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-70"
        >
          {booking === "idle"
            ? t("services.book")
            : booking === "booking"
              ? t("services.booking")
              : `✓ ${t("services.booked")}`}
        </button>
        <Link
          href="/support"
          className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-accent underline-offset-2 hover:underline"
        >
          {t("services.talkToPerson")}
        </Link>
      </div>
    </div>
  );
}
