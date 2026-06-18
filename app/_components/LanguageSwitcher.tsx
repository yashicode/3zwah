"use client";

import { locales, localeMeta } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";

// Sets the locale cookie client-side, then reloads so the server re-renders
// with the right dictionary and document direction (RTL for Arabic).
export function LanguageSwitcher() {
  const { locale, t } = useI18n();

  function choose(next: string) {
    if (next === locale) return;
    document.cookie = `sanad_locale=${next}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  }

  return (
    <div role="group" aria-label={t("nav.language")} className="flex items-center gap-1">
      {locales.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => choose(l)}
            aria-pressed={active}
            lang={l}
            className={`min-h-9 cursor-pointer rounded-md px-2.5 py-1 text-sm font-medium transition-colors ${
              active
                ? "bg-primary text-on-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {localeMeta[l].label}
          </button>
        );
      })}
    </div>
  );
}
