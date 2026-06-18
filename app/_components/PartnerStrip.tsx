"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";
import { AppImage } from "./AppImage";
import { partners } from "@/lib/data/seed";

export function PartnerStrip() {
  const { t, locale } = useI18n();
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          {t("azwa.partnersTitle")}
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
          {partners.map((p) => (
            <li key={p.id} className="flex items-center gap-3">
              <AppImage
                src={p.logo}
                alt={p.name.en}
                label={p.name.en.slice(0, 2)}
                fit="contain"
                className="h-12 w-20 shrink-0 rounded-lg border border-border"
              />
              <span className="text-sm font-medium text-foreground">
                {p.name[locale as keyof typeof p.name] ?? p.name.en}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 text-center">
          <Link href="/partners" className="text-sm font-semibold text-link hover:underline">
            {t("nav.partners")} →
          </Link>
        </div>
      </div>
    </section>
  );
}
