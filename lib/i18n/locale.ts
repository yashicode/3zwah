import "server-only";
import { cookies } from "next/headers";
import { defaultLocale, isLocale, type Locale } from "./config";

export const LOCALE_COOKIE = "sanad_locale";

// The chosen locale is stored in a plain (non-httpOnly) cookie so the
// LanguageSwitcher can set it client-side. The server reads it here to pick
// the dictionary and the document direction (LTR/RTL).
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return value && isLocale(value) ? value : defaultLocale;
}
