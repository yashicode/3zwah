// Launch locale set from the brief (§2.3): English, Arabic (RTL),
// Tagalog/Filipino, Hindi. Phase-2 languages slot in here later.

export const locales = ["en", "ar", "tl", "hi"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeMeta: Record<
  Locale,
  { label: string; englishLabel: string; dir: "ltr" | "rtl" }
> = {
  en: { label: "English", englishLabel: "English", dir: "ltr" },
  ar: { label: "العربية", englishLabel: "Arabic", dir: "rtl" },
  tl: { label: "Tagalog", englishLabel: "Tagalog", dir: "ltr" },
  hi: { label: "हिन्दी", englishLabel: "Hindi", dir: "ltr" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dirOf(locale: Locale): "ltr" | "rtl" {
  return localeMeta[locale].dir;
}
