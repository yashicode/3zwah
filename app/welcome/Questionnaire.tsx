"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";

// ## [WHAT CAN WE EDIT] Questionnaire option values. Labels live in the i18n
// dictionaries under welcome.relationships / welcome.needs / welcome.goals so
// they localize (see en.json / ar.json).
const RELATIONSHIPS = ["parent", "spouse", "child", "sibling", "other"];
const AGE_BANDS = ["18-39", "40-59", "60-69", "70-79", "80+"];
const NEEDS = [
  "mobility",
  "chronic_illness",
  "dementia",
  "post_hospital",
  "nutrition",
  "medical_devices",
  "palliative",
];
const GOALS = ["skills", "self_care", "financial", "respite", "appointments"];

export function Questionnaire() {
  const { t } = useI18n();
  const router = useRouter();
  const [relationship, setRelationship] = useState("parent");
  const [ageBand, setAgeBand] = useState("70-79");
  const [livesWith, setLivesWith] = useState(true);
  const [needs, setNeeds] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          careRelationship: relationship,
          recipientAgeBand: ageBand,
          livesWithCaregiver: livesWith,
          needs,
          goals,
        }),
      });
    } catch {
      /* demo: proceed regardless */
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground">{t("welcome.title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("welcome.subtitle")}</p>

      <form onSubmit={submit} className="mt-8 space-y-8">
        {/* Q1 relationship */}
        <fieldset>
          <legend className="text-lg font-semibold text-foreground">{t("welcome.q1")}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {RELATIONSHIPS.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={relationship === r}
                onClick={() => setRelationship(r)}
                className={`min-h-11 rounded-lg border px-4 text-sm font-medium ${
                  relationship === r
                    ? "border-primary bg-primary text-on-primary"
                    : "border-border bg-surface text-foreground hover:bg-muted"
                }`}
              >
                {t(`welcome.relationships.${r}`)}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Q2 age */}
        <div>
          <label htmlFor="age" className="text-lg font-semibold text-foreground">
            {t("welcome.q2")}
          </label>
          <select
            id="age"
            value={ageBand}
            onChange={(e) => setAgeBand(e.target.value)}
            className="mt-3 min-h-12 w-full rounded-lg border border-border bg-surface px-4 text-base text-foreground sm:w-60"
          >
            {AGE_BANDS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* Q3 lives with */}
        <fieldset>
          <legend className="text-lg font-semibold text-foreground">{t("welcome.q3")}</legend>
          <div className="mt-3 flex gap-2">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                type="button"
                aria-pressed={livesWith === v}
                onClick={() => setLivesWith(v)}
                className={`min-h-11 rounded-lg border px-6 text-sm font-medium ${
                  livesWith === v
                    ? "border-primary bg-primary text-on-primary"
                    : "border-border bg-surface text-foreground hover:bg-muted"
                }`}
              >
                {v ? t("welcome.yes") : t("welcome.no")}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Q4 needs */}
        <fieldset>
          <legend className="text-lg font-semibold text-foreground">{t("welcome.q4")}</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {NEEDS.map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={needs.includes(n)}
                onClick={() => toggle(needs, setNeeds, n)}
                className={`min-h-12 rounded-lg border px-4 text-start text-sm font-medium ${
                  needs.includes(n)
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-surface text-foreground hover:bg-muted"
                }`}
              >
                {t(`welcome.needs.${n}`)}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Q5 goals */}
        <fieldset>
          <legend className="text-lg font-semibold text-foreground">{t("welcome.q5")}</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {GOALS.map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={goals.includes(g)}
                onClick={() => toggle(goals, setGoals, g)}
                className={`min-h-12 rounded-lg border px-4 text-start text-sm font-medium ${
                  goals.includes(g)
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-surface text-foreground hover:bg-muted"
                }`}
              >
                {t(`welcome.goals.${g}`)}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={busy}
            className="min-h-12 rounded-lg bg-primary px-7 font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {busy ? t("welcome.submitting") : t("welcome.submit")}
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            {t("welcome.skip")}
          </button>
        </div>
      </form>
    </div>
  );
}
