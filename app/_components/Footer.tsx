"use client";

import { useI18n } from "@/lib/i18n/provider";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl space-y-2 px-4 py-10 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">{t("footer.humanFirst")}</p>
        <p>{t("footer.notMedical")}</p>
        <p>{t("footer.compliance")}</p>
        <p className="pt-2 text-xs">{t("meta.reviewNote")}</p>
      </div>
    </footer>
  );
}
