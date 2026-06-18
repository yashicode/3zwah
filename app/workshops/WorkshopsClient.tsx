"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { AppImage } from "@/app/_components/AppImage";
import type { Center, TrainingSession } from "@/lib/types";

const TOPICS = ["mental_health", "self_care", "financial_literacy", "medical_devices"] as const;
const FORMATS = ["in_person", "online", "hybrid"] as const;

export function WorkshopsClient({
  trainings,
  centers,
  relevantIds,
}: {
  trainings: TrainingSession[];
  centers: Center[];
  relevantIds: string[];
}) {
  const { t, locale } = useI18n();
  const [topic, setTopic] = useState("");
  const [format, setFormat] = useState("");

  const centerById = useMemo(
    () => Object.fromEntries(centers.map((c) => [c.id, c])),
    [centers],
  );
  const relevant = useMemo(() => new Set(relevantIds), [relevantIds]);

  const filtered = useMemo(
    () =>
      trainings.filter(
        (s) => (!topic || s.topic === topic) && (!format || s.format === format),
      ),
    [trainings, topic, format],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-foreground">{t("workshops.title")}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{t("workshops.subtitle")}</p>
      {relevantIds.length > 0 && (
        <p className="mt-2 text-sm font-medium text-accent">{t("workshops.relevantFirst")}</p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="w-topic" className="mb-1 block text-sm font-medium text-foreground">
            {t("training.filterTopic")}
          </label>
          <select
            id="w-topic"
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
          <label htmlFor="w-format" className="mb-1 block text-sm font-medium text-foreground">
            {t("training.filterFormat")}
          </label>
          <select
            id="w-format"
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

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <WorkshopCard
            key={s.id}
            session={s}
            center={s.centerId ? centerById[s.centerId] : undefined}
            locale={locale}
            tailored={relevant.has(s.id)}
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="mt-10 text-center text-muted-foreground">{t("training.empty")}</p>
      )}
    </div>
  );
}

function WorkshopCard({
  session,
  center,
  locale,
  tailored,
}: {
  session: TrainingSession;
  center?: Center;
  locale: string;
  tailored: boolean;
}) {
  const { t } = useI18n();
  const [state, setState] = useState<"idle" | "registering" | "registered">("idle");
  const full = session.seatsTaken >= session.capacity;

  const title = session.title[locale as keyof typeof session.title] ?? session.title.en;
  const summary = session.summary[locale as keyof typeof session.summary] ?? session.summary.en;
  const centerName = center
    ? (center.name[locale as keyof typeof center.name] ?? center.name.en)
    : null;
  const centerAddress = center
    ? (center.address[locale as keyof typeof center.address] ?? center.address.en)
    : null;
  const seatsLeft = Math.max(0, session.capacity - session.seatsTaken);
  const date = new Date(session.startsAt).toLocaleDateString(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  async function register() {
    setState("registering");
    try {
      const res = await fetch(`/api/trainings/${session.id}/enroll`, { method: "POST" });
      setState(res.ok ? "registered" : "idle");
    } catch {
      setState("idle");
    }
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface">
      <div className="relative">
        <AppImage
          src={`/images/workshops/${session.id}.jpg`}
          alt={title}
          label={title}
          className="h-44 w-full"
        />
        {tailored && (
          <span className="absolute start-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-on-primary">
            {t("workshops.tailoredNote")}
          </span>
        )}
        {session.certificationOffered && (
          <span className="absolute end-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-white">
            {t("training.certificate")}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="w-fit rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-link">
          {t(`training.format.${session.format}`)}
        </span>
        <h3 className="mt-2 font-heading text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 flex-1 text-sm leading-6 text-muted-foreground">{summary}</p>

        <dl className="mt-3 space-y-1.5 text-sm">
          <div className="text-muted-foreground">
            <span className="font-medium text-foreground">{session.trainerName}</span> · {date}
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("workshops.venueLabel")}
            </dt>
            <dd className="text-muted-foreground">
              {centerName ? (
                <>
                  {centerName} — {centerAddress}
                  <span className="mt-0.5 block text-xs">{t("workshops.hoursNote")}</span>
                </>
              ) : (
                t("workshops.onlineLabel")
              )}
            </dd>
          </div>
          {session.reviewedBy && session.reviewedAt && (
            <div className="text-xs text-muted-foreground">
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
            onClick={register}
            disabled={full || state !== "idle"}
            className="inline-flex min-h-11 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-60"
          >
            {state === "idle"
              ? t("workshops.register")
              : state === "registering"
                ? t("workshops.registering")
                : `✓ ${t("workshops.registered")}`}
          </button>
        </div>
      </div>
    </div>
  );
}
