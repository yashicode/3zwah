"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";
import { AppImage } from "./AppImage";

export function BrandHero() {
  const { t } = useI18n();
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:py-28 lg:grid-cols-2">
        {/* Left: logo on top, message below it */}
        <div>
          <div className="flex justify-center lg:justify-start">
            {/* ## [WHAT CAN WE EDIT] Brand logo — public/images/brand/azwa-logo.jpg */}
            <AppImage
              src="/images/brand/azwa-logo.jpg"
              alt="3zwah — عِزوَة"
              label="3zwah"
              fit="contain"
              className="aspect-square w-full max-w-[15rem] rounded-2xl border border-border"
            />
          </div>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            {t("azwa.heroEyebrow")}
          </p>

          {/* Animated UAE-flag bar */}
          <div className="azwa-flagbar mt-5 flex h-2 w-44 overflow-hidden rounded-full">
            <span className="h-full flex-1 bg-[#009639]" />
            <span className="h-full flex-1 bg-white" />
            <span className="h-full flex-1 bg-black" />
            <span className="h-full w-3 bg-[#ef3340]" />
          </div>

          <h2 className="mt-8 text-3xl font-bold text-foreground sm:text-4xl">
            {t("azwa.heroTitle")}
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            {t("azwa.heroSubtitle")}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex min-h-12 items-center rounded-lg bg-primary px-7 text-base font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
              {t("azwa.heroCtaPrimary")}
            </Link>
            <Link
              href="/find-support"
              className="inline-flex min-h-12 items-center rounded-lg border border-border bg-surface px-7 text-base font-semibold text-foreground transition-colors hover:bg-muted"
            >
              {t("azwa.heroCtaSecondary")}
            </Link>
          </div>
        </div>

        {/* Right: care photo. Drop your image at public/images/brand/hero-care.jpg
            (a tidy gradient with "Your photo here" shows until then). */}
        <div>
          <AppImage
            src="/images/brand/hero-care.jpg"
            alt="A caregiver sitting with an elderly woman"
            label="Your photo here"
            fit="cover"
            className="aspect-[4/3] w-full rounded-2xl border border-border"
          />
        </div>
      </div>
    </section>
  );
}
