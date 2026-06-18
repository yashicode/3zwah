"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { AccessibilityControls } from "./AccessibilityControls";

// ## [WHAT CAN WE EDIT] top-nav links. `key` must match a nav.* label in the
// dictionaries (lib/i18n/dictionaries/*.json).
const LINKS = [
  { href: "/workshops", key: "workshops" },
  { href: "/find-support", key: "findSupport" },
  { href: "/partners", key: "partners" },
  { href: "/contact", key: "contact" },
] as const;

export function Header() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [me, setMe] = useState<{ signedIn: boolean; name?: string } | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => alive && setMe(d))
      .catch(() => alive && setMe({ signedIn: false }));
    return () => {
      alive = false;
    };
  }, [pathname]);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-2xl font-extrabold"
        >
          <span className="azwa-wordmark">{t("meta.appName")}</span>
        </Link>

        <nav aria-label="Main" className="ms-3 hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-muted text-link"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {t(`nav.${l.key}`)}
              </Link>
            );
          })}
        </nav>

        <div className="ms-auto flex flex-wrap items-center justify-end gap-2">
          <AccessibilityControls />
          <LanguageSwitcher />
          {me?.signedIn ? (
            <Link
              href="/dashboard"
              className="inline-flex min-h-9 items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
              {t("nav.dashboard")}
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex min-h-9 items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
              {t("nav.login")}
            </Link>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <nav aria-label="Main" className="flex gap-1 overflow-x-auto px-3 pb-2 md:hidden">
        {LINKS.map((l) => {
          const active = isActive(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? "page" : undefined}
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ${
                active ? "bg-muted text-link" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {t(`nav.${l.key}`)}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
