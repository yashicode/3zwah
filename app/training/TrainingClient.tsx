"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import type { Center, TrainingSession } from "@/lib/types";

const TOPICS = [
  "mental_health",
  "self_care",
  "financial_literacy",
  "medical_devices",
] as const;
const FORMATS = ["in_person", "online", "hybrid"] as const;

export function TrainingClient({
  trainings,
  centers,
}: {
  trainings: TrainingSession[];
  centers: Center[];
}) {
  const { t, locale } = useI18n();
  const [topic, setTopic] = useState<string>("");
  const [format, setFormat] = useState<string>("");

  const centerById = useMemo(
    () => Object.fromEntries(centers.map((c) => [c.id, c])),
    [centers],
  );

  const filtered = useMemo(
    () =>
      trainings.filter(
        (s) => (!topic || s.topic === topic) && (!format || s.format === format),
      ),
    [trainings, topic, format],
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-foreground">{t("training.title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("training.subtitle")}</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="trn-topic" className="mb-1 block text-sm font-medium text-foreground">
            {t("training.filterTopic")}
          </label>
          <select
            id="trn-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="min-h-12 w-full rounded-lg border border-border bg-surface px-4 text-base text-foreground"
          >
            <option value="">{t("training.filterAll")}</option>
            {TOPICS.map((tp) => (
              <option key={tp} value={tp}>
                {t(`training.topics.${tp}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="trn-format" className="mb-1 block text-sm font-medium text-foreground">
            {t("training.filterFormat")}
          </label>
          <select
            id="trn-format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="min-h-12 w-full rounded-lg border border-border bg-surface px-4 text-base text-foreground"
          >
            <option value="">{t("training.filterAll")}</option>
            {FORMATS.map((f) => (
              <option key={f} value={f}>
                {t(`training.format.${f}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {filtered.map((s) => (
          <TrainingCard
            key={s.id}
            session={s}
            center={s.centerId ? centerById[s.centerId] : undefined}
            locale={locale}
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="mt-10 text-center text-muted-foreground">{t("training.empty")}</p>
      )}
    </div>
  );
}

function TrainingCard({
  session,
  center,
  locale,
}: {
  session: TrainingSession;
  center?: Center;
  locale: string;
}) {
  const { t } = useI18n();
  const [state, setState] = useState<"idle" | "enrolling" | "enrolled">("idle");
  const full = session.seatsTaken >= session.capacity;

  const title = session.title[locale as keyof typeof session.title] ?? session.title.en;
  const summary =
    session.summary[locale as keyof typeof session.summary] ?? session.summary.en;
  const centerName = center
    ? (center.name[locale as keyof typeof center.name] ?? center.name.en)
    : null;
  const seatsLeft = Math.max(0, session.capacity - session.seatsTaken);
  const date = new Date(session.startsAt).toLocaleDateString(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  async function enroll() {
    setState("enrolling");
    try {
      const res = await fetch(`/api/trainings/${session.id}/enroll`, { method: "POST" });
      setState(res.ok ? "enrolled" : "idle");
    } catch {
      setState("idle");
    }
  }

  return (
    <div className="flex flex-col rounded-xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-link">
          {t(`training.format.${session.format}`)}
        </span>
        {session.certificationOffered && (
          <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
            {t("training.certificate")}
          </span>
        )}
      </div>

      <h3 className="mt-3 font-heading text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 flex-1 text-sm leading-6 text-muted-foreground">{summary}</p>

      <dl className="mt-3 space-y-1 text-sm text-muted-foreground">
        <div className="flex gap-2">
          <dt className="font-medium text-foreground">{session.trainerName}</dt>
          <dd>· {date}</dd>
        </div>
        {centerName && <div>{centerName}</div>}
        {session.reviewedBy && session.reviewedAt && (
          <div className="text-xs">
            {t("training.reviewedBy")
              .replace("{name}", session.reviewedBy)
              .replace("{date}", session.reviewedAt)}
          </div>
        )}
      </dl>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">
          {full ? t("training.full") : t("training.seats").replace("{count}", String(seatsLeft))}
        </span>
        <button
          type="button"
          onClick={enroll}
          disabled={full || state !== "idle"}
          className="inline-flex min-h-11 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-60"
        >
          {state === "idle"
            ? t("training.enroll")
            : state === "enrolling"
              ? t("training.enrolling")
              : `✓ ${t("training.enrolled")}`}
        </button>
      </div>
    </div>
  );
}
