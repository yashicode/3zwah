"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";
import { AppImage } from "@/app/_components/AppImage";
import type { CareRelationship, Service, TrainingSession } from "@/lib/types";

export function DashboardView({
  name,
  relationship,
  workshops,
  services,
}: {
  name: string;
  relationship: CareRelationship;
  workshops: TrainingSession[];
  services: Service[];
}) {
  const { t, locale } = useI18n();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("dashboard.greeting").replace("{name}", name)}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("dashboard.intro")}</p>
          <p className="mt-1 text-sm text-accent">
            {t("dashboard.basedOn").replace("{relationship}", t(`dashboard.relationships.${relationship}`))}
          </p>
        </div>
        <Link
          href="/welcome"
          className="inline-flex min-h-11 items-center rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-foreground hover:bg-muted"
        >
          {t("dashboard.editProfile")}
        </Link>
      </div>

      {/* Workshops */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            {t("dashboard.recommendedWorkshops")}
          </h2>
          <Link href="/workshops" className="text-sm font-semibold text-link hover:underline">
            {t("dashboard.viewAllWorkshops")} →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {workshops.map((w) => (
            <Link
              key={w.id}
              href="/workshops"
              className="group overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-md"
            >
              <AppImage
                src={`/images/workshops/${w.id}.jpg`}
                alt={w.title.en}
                label={w.title.en}
                className="h-36 w-full"
              />
              <div className="p-4">
                <h3 className="font-heading font-semibold text-link">
                  {w.title[locale as keyof typeof w.title] ?? w.title.en}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{w.trainerName}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Support */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            {t("dashboard.recommendedSupport")}
          </h2>
          <Link href="/find-support" className="text-sm font-semibold text-link hover:underline">
            {t("dashboard.viewAllSupport")} →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.id}
              href="/find-support"
              className="group overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-md"
            >
              <AppImage
                src={`/images/services/${s.id}.jpg`}
                alt={s.name.en}
                label={s.name.en}
                className="h-36 w-full"
              />
              <div className="p-4">
                <h3 className="font-heading font-semibold text-link">
                  {s.name[locale as keyof typeof s.name] ?? s.name.en}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {s.description[locale as keyof typeof s.description] ?? s.description.en}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
