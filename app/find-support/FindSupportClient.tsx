"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";
import { AppImage } from "@/app/_components/AppImage";
import { AssistantPanel } from "@/app/_components/AssistantPanel";
import { PartnerStrip } from "@/app/_components/PartnerStrip";
import type { Service } from "@/lib/types";

export function FindSupportClient({
  services,
  categories,
  relevantIds,
}: {
  services: Service[];
  categories: string[];
  relevantIds: string[];
}) {
  const { t, locale } = useI18n();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const relevant = useMemo(() => new Set(relevantIds), [relevantIds]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services.filter((s) => {
      if (category && s.category !== category) return false;
      if (!q) return true;
      const hay = [s.name.en, s.description.en, s.category, ...s.tags].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [services, query, category]);

  return (
    <>
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-foreground">{t("findSupport.title")}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{t("findSupport.subtitle")}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Services */}
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("findSupport.searchPlaceholder")}
              aria-label={t("services.search")}
              className="min-h-12 flex-1 rounded-lg border border-border bg-surface px-4 text-base text-foreground placeholder:text-muted-foreground"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label={t("services.category")}
              className="min-h-12 rounded-lg border border-border bg-surface px-4 text-base text-foreground sm:w-52"
            >
              <option value="">{t("training.filterAll")}</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <h2 className="sr-only">{t("findSupport.servicesHeading")}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {filtered.map((s) => (
              <ServiceCard
                key={s.id}
                service={s}
                locale={locale}
                tailored={relevant.has(s.id)}
              />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="mt-8 text-center text-muted-foreground">{t("services.empty")}</p>
          )}
        </div>

        {/* Assistant panel */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <p className="mb-2 font-heading text-lg font-semibold text-foreground">
              {t("findSupport.assistantHeading")}
            </p>
            <AssistantPanel />
          </div>
        </aside>
      </div>
    </div>

    {/* Our care partners — shown on the service page too */}
    <PartnerStrip />
    </>
  );
}

function ServiceCard({
  service,
  locale,
  tailored,
}: {
  service: Service;
  locale: string;
  tailored: boolean;
}) {
  const { t } = useI18n();
  const [elig, setElig] = useState<null | { eligible: boolean; messages: string[] }>(null);
  const [checking, setChecking] = useState(false);
  const [booking, setBooking] = useState<"idle" | "booking" | "booked">("idle");

  const name = service.name[locale as keyof typeof service.name] ?? service.name.en;
  const desc =
    service.description[locale as keyof typeof service.description] ?? service.description.en;

  async function checkEligibility() {
    setChecking(true);
    try {
      const res = await fetch(`/api/services/${service.id}/eligibility`, { method: "POST" });
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
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface">
      <div className="relative">
        <AppImage
          src={`/images/services/${service.id}.jpg`}
          alt={name}
          label={name}
          className="h-40 w-full"
        />
        {tailored && (
          <span className="absolute start-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-on-primary">
            {t("findSupport.tailoredNote")}
          </span>
        )}
        {service.free && (
          <span className="absolute end-3 top-3 rounded-full bg-success px-2.5 py-1 text-xs font-semibold text-white">
            Free
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-lg font-semibold text-link">{name}</h3>
        <p className="mt-1 flex-1 text-sm leading-6 text-muted-foreground">{desc}</p>
        <p className="mt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t("services.provider")}: {t(`services.providerType.${service.providerType}`)}
        </p>

        {elig && (
          <div
            className={`mt-3 rounded-lg px-3 py-2 text-sm ${
              elig.eligible ? "bg-success/10 text-success" : "bg-warning-surface text-warning"
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
            className="inline-flex min-h-10 items-center rounded-lg border border-border px-3 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-60"
          >
            {checking ? t("common.loading") : t("services.checkEligibility")}
          </button>
          <button
            type="button"
            onClick={book}
            disabled={booking !== "idle"}
            className="inline-flex min-h-10 items-center rounded-lg bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-70"
          >
            {booking === "idle"
              ? t("services.book")
              : booking === "booking"
                ? t("services.booking")
                : `✓ ${t("services.booked")}`}
          </button>
          <Link
            href="/contact"
            className="inline-flex min-h-10 items-center px-2 text-sm font-semibold text-accent hover:underline"
          >
            {t("services.talkToPerson")}
          </Link>
        </div>
      </div>
    </div>
  );
}
