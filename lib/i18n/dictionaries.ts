import "server-only";
import type { Locale } from "./config";
import en from "./dictionaries/en.json";
import ar from "./dictionaries/ar.json";
import tl from "./dictionaries/tl.json";
import hi from "./dictionaries/hi.json";

// English is the complete base. Other locales may be partial; any missing
// key falls back to English so the UI is never broken or blank.
export type Dictionary = typeof en;

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

const raw: Record<Locale, DeepPartial<Dictionary>> = {
  en,
  ar: ar as DeepPartial<Dictionary>,
  tl: tl as DeepPartial<Dictionary>,
  hi: hi as DeepPartial<Dictionary>,
};

function deepMerge<T>(base: T, override: DeepPartial<T>): T {
  if (override == null) return base;
  const out: Record<string, unknown> = Array.isArray(base)
    ? [...(base as unknown[])] as unknown as Record<string, unknown>
    : { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(override as Record<string, unknown>)) {
    const b = (base as Record<string, unknown>)[key];
    const o = (override as Record<string, unknown>)[key];
    if (b && o && typeof b === "object" && typeof o === "object" && !Array.isArray(b)) {
      out[key] = deepMerge(b, o as DeepPartial<typeof b>);
    } else if (o !== undefined) {
      out[key] = o;
    }
  }
  return out as T;
}

const cache = new Map<Locale, Dictionary>();

export function getDictionary(locale: Locale): Dictionary {
  const hit = cache.get(locale);
  if (hit) return hit;
  const merged = deepMerge(en, raw[locale] ?? {});
  cache.set(locale, merged);
  return merged;
}
