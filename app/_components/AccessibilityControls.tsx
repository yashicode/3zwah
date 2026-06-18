"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";

type Size = "base" | "lg" | "xl";

// A / A+ / A++ text-size control and a high-contrast toggle. Choices persist in
// localStorage and are re-applied before paint by the inline script in layout.
// Far friendlier for older users than pinch-zoom.
const SIZES: { value: Size; labelKey: string; cls: string }[] = [
  { value: "base", labelKey: "a11y.normal", cls: "text-xs" },
  { value: "lg", labelKey: "a11y.large", cls: "text-sm" },
  { value: "xl", labelKey: "a11y.xlarge", cls: "text-base" },
];

export function AccessibilityControls() {
  const { t } = useI18n();
  const [size, setSize] = useState<Size>("base");
  const [highContrast, setHighContrast] = useState(false);

  // Read what the inline init script already applied.
  useEffect(() => {
    const d = document.documentElement;
    setSize((d.getAttribute("data-text-size") as Size) || "base");
    setHighContrast(d.getAttribute("data-contrast") === "high");
  }, []);

  function chooseSize(next: Size) {
    setSize(next);
    document.documentElement.setAttribute("data-text-size", next);
    try {
      localStorage.setItem("azwa-text-size", next);
    } catch {
      /* private mode: ignore */
    }
  }

  function toggleContrast() {
    const next = !highContrast;
    setHighContrast(next);
    document.documentElement.setAttribute("data-contrast", next ? "high" : "normal");
    try {
      localStorage.setItem("azwa-contrast", next ? "high" : "normal");
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div
        role="group"
        aria-label={t("a11y.textSize")}
        className="flex items-center overflow-hidden rounded-md border border-border"
      >
        {SIZES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => chooseSize(s.value)}
            aria-pressed={size === s.value}
            aria-label={t(s.labelKey)}
            className={`flex min-h-9 min-w-9 items-center justify-center px-2 font-semibold leading-none ${s.cls} ${
              size === s.value
                ? "bg-primary text-on-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            A
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={toggleContrast}
        aria-pressed={highContrast}
        aria-label={t("a11y.contrast")}
        title={t("a11y.contrast")}
        className={`flex min-h-9 min-w-9 items-center justify-center rounded-md border border-border text-base leading-none ${
          highContrast
            ? "bg-primary text-on-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        <span aria-hidden>◐</span>
      </button>
    </div>
  );
}
