"use client";

import { createContext, useContext, useMemo } from "react";
import type { Locale } from "./config";
import { dirOf } from "./config";
import { interpolate, resolvePath } from "./interpolate";

type Dict = Record<string, unknown>;

interface I18nValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: (path: string, vars?: Record<string, string | number>) => string;
  dict: Dict;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dict;
  children: React.ReactNode;
}) {
  const value = useMemo<I18nValue>(
    () => ({
      locale,
      dir: dirOf(locale),
      dict,
      t: (path, vars) => interpolate(resolvePath(dict, path), vars),
    }),
    [locale, dict],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
