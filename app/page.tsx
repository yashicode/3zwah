"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";
import { BrandHero } from "./_components/BrandHero";
import { PartnerStrip } from "./_components/PartnerStrip";

function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10V7a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="6" y="2" width="12" height="20" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// ## [WHAT CAN WE EDIT] landing "what you can do" cards → which page each opens.
const MODULES = [
  { key: "training", href: "/workshops" },
  { key: "services", href: "/find-support" },
  { key: "assistant", href: "/find-support" },
  { key: "support", href: "/contact" },
] as const;

export default function Home() {
  const { t } = useI18n();

  return (
    <>
      <BrandHero />

      {/* Journeys */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold text-foreground">{t("azwa.journeyTitle")}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((m) => (
            <Link
              key={m.key}
              href={m.href}
              className="group flex flex-col rounded-xl border border-border bg-surface p-5 transition-shadow hover:shadow-md focus-visible:shadow-md"
            >
              <h3 className="font-heading text-lg font-semibold text-link group-hover:text-accent-hover">
                {t(`modules.${m.key}Title`)}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t(`modules.${m.key}Body`)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <PartnerStrip />

      {/* Trust */}
      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-bold text-foreground">{t("home.trustTitle")}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              { icon: <ShieldIcon />, n: 1 },
              { icon: <LockIcon />, n: 2 },
              { icon: <PhoneIcon />, n: 3 },
            ].map((item) => (
              <div key={item.n} className="rounded-xl bg-surface p-6">
                <div className="text-accent">{item.icon}</div>
                <h3 className="mt-3 font-heading text-lg font-semibold text-foreground">
                  {t(`home.trust${item.n}Title`)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t(`home.trust${item.n}Body`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Human banner */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-accent/30 bg-surface p-6 sm:flex-row sm:items-center">
          <p className="text-lg font-medium text-foreground">{t("home.humanBanner")}</p>
          <Link
            href="/contact"
            className="inline-flex min-h-12 shrink-0 items-center rounded-lg bg-accent px-6 font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            {t("home.humanBannerCta")}
          </Link>
        </div>
      </section>
    </>
  );
}
