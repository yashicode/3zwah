"use client";

import { useI18n } from "@/lib/i18n/provider";
import { AppImage } from "@/app/_components/AppImage";
import type { Partner, PartnerCategory } from "@/lib/types";

const ORDER: PartnerCategory[] = [
  "government",
  "hospital",
  "clinic",
  "homecare",
  "insurance",
  "finance",
  "wellbeing",
  "staffing",
];

export function PartnersView({ partners }: { partners: Partner[] }) {
  const { t, locale } = useI18n();

  const byCategory = ORDER.map((cat) => ({
    cat,
    items: partners.filter((p) => p.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-foreground">{t("partners.title")}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{t("partners.subtitle")}</p>

      {byCategory.map((group) => (
        <section key={group.cat} className="mt-10">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            {t(`partners.categories.${group.cat}`)}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4"
              >
                <AppImage
                  src={p.logo}
                  alt={p.name.en}
                  label={p.name.en}
                  fit="contain"
                  className="h-16 w-24 shrink-0 rounded-lg border border-border"
                />
                <div>
                  <h3 className="font-heading font-semibold text-link">
                    {p.name[locale as keyof typeof p.name] ?? p.name.en}
                  </h3>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    {p.blurb[locale as keyof typeof p.blurb] ?? p.blurb.en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
