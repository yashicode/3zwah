"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/i18n/config";

type Outcome =
  | { kind: "emergency" }
  | { kind: "handoff"; reason: string; category?: string }
  | { kind: "suggestions"; category: string; confidence: number; serviceIds: string[] };

interface ServiceDTO {
  id: string;
  name: Partial<Record<Locale, string>> & { en: string };
  description: Partial<Record<Locale, string>> & { en: string };
  free: boolean;
}

interface AssistantResponse {
  outcome: Outcome;
  services?: ServiceDTO[];
  explanation?: string;
  llm: "llm" | "fallback";
}

type Phase = "consent" | "ask" | "loading" | "result";

// ## [WHAT CAN WE EDIT] example prompts shown in the assistant panel. The text
// lives in the i18n dictionaries under assistant.examples so it localizes
// (see en.json / ar.json); these are the keys to display.
const EXAMPLE_KEYS = ["overwhelmed", "notEating", "appointment", "money"];

export function AssistantPanel() {
  const { t, locale, dict } = useI18n();
  const [phase, setPhase] = useState<Phase>("consent");
  const [text, setText] = useState("");
  const [lastText, setLastText] = useState("");
  const [data, setData] = useState<AssistantResponse | null>(null);
  const [error, setError] = useState(false);

  // ## [WHAT CAN WE EDIT] Supportive intro messages rotate on each visit. The
  // text lives in the dictionaries under assistant.encouragements (localized).
  const encouragements = useMemo(() => {
    const list = (dict as { assistant?: { encouragements?: unknown } }).assistant?.encouragements;
    return Array.isArray(list) && list.length > 0 ? (list as string[]) : [t("assistant.subtitle")];
  }, [dict, t]);
  const [encIdx, setEncIdx] = useState(0);
  // Randomize after mount (server renders index 0 → no hydration mismatch).
  useEffect(() => {
    setEncIdx(Math.floor(Math.random() * encouragements.length));
  }, [encouragements.length]);

  const localized = (s: ServiceDTO["name"]) => s[locale] ?? s.en;

  async function handoff(category: string) {
    try {
      await fetch("/api/assistant/handoff", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          category,
          origin: "chatbot_handoff",
          context: [
            { role: "user", text: lastText },
            ...(data?.explanation ? [{ role: "assistant", text: data.explanation }] : []),
          ],
        }),
      });
    } catch {
      /* best-effort */
    }
  }

  async function ask(message: string) {
    if (!message.trim()) return;
    setLastText(message);
    setPhase("loading");
    setError(false);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: message, locale, consent: true }),
      });
      if (!res.ok) throw new Error("bad");
      const json = (await res.json()) as AssistantResponse;
      setData(json);
      setPhase("result");
      if (json.outcome.kind === "handoff") {
        void handoff(json.outcome.category ?? json.outcome.reason);
      }
    } catch {
      setError(true);
      setPhase("ask");
    }
  }

  async function book(serviceId: string) {
    try {
      await fetch(`/api/services/${serviceId}/book`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      });
    } catch {
      /* best-effort */
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="font-heading text-lg font-semibold text-foreground">
        {t("assistant.title")}
      </h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        {encouragements[encIdx] ?? t("assistant.subtitle")}
      </p>
      <p className="mt-3 rounded-lg bg-warning-surface px-3 py-2 text-xs text-warning">
        {t("assistant.disclaimer")}
      </p>

      {phase === "consent" && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{t("assistant.consentBody")}</p>
          <div className="mt-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setPhase("ask")}
              className="min-h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary hover:bg-primary-hover"
            >
              {t("assistant.consentAccept")}
            </button>
            <Link
              href="/contact"
              className="min-h-11 rounded-lg border border-border px-4 py-2.5 text-center text-sm font-semibold text-foreground hover:bg-muted"
            >
              {t("assistant.consentDecline")}
            </Link>
          </div>
        </div>
      )}

      {(phase === "ask" || phase === "loading") && (
        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            void ask(text);
          }}
        >
          <label htmlFor="panel-input" className="sr-only">
            {t("assistant.placeholder")}
          </label>
          <textarea
            id="panel-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("assistant.placeholder")}
            rows={3}
            className="w-full rounded-lg border border-border bg-surface p-3 text-sm text-foreground placeholder:text-muted-foreground"
          />
          {error && <p className="mt-2 text-sm text-destructive">{t("common.error")}</p>}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {EXAMPLE_KEYS.map((key) => {
              const ex = t(`assistant.examples.${key}`);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setText(ex)}
                  className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  {ex}
                </button>
              );
            })}
          </div>
          <button
            type="submit"
            disabled={phase === "loading" || !text.trim()}
            className="mt-3 min-h-11 w-full rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-50"
          >
            {phase === "loading" ? t("assistant.thinking") : t("assistant.send")}
          </button>
        </form>
      )}

      {phase === "result" && (
        <div className="mt-4 space-y-3">
          {lastText && (
            <p className="rounded-lg bg-muted px-3 py-2 text-sm text-foreground">“{lastText}”</p>
          )}

          {data?.outcome.kind === "emergency" && (
            <div className="rounded-lg border-2 border-destructive p-4">
              <p className="font-semibold text-destructive">{t("assistant.emergencyTitle")}</p>
              <p className="mt-1 text-sm text-foreground">{t("assistant.emergencyBody")}</p>
              <div className="mt-3 flex gap-2">
                <a href="tel:998" className="min-h-10 rounded-lg bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground">998</a>
                <a href="tel:999" className="min-h-10 rounded-lg border border-destructive px-4 py-2 text-sm font-bold text-destructive">999</a>
              </div>
            </div>
          )}

          {data?.outcome.kind === "handoff" && (
            <div className="rounded-lg border border-accent/30 p-4">
              <p className="font-semibold text-foreground">{t("assistant.handoffTitle")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("assistant.handoffBody")}</p>
              <Link href="/contact" className="mt-3 inline-flex min-h-10 items-center rounded-lg bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-hover">
                {t("assistant.talkToPerson")}
              </Link>
            </div>
          )}

          {data?.outcome.kind === "suggestions" && (
            <>
              <div className="rounded-lg border border-border p-4">
                <p className="text-sm leading-6 text-foreground">{data.explanation}</p>
                <p className="mt-2 text-[10px] uppercase tracking-wide text-muted-foreground">
                  {t("assistant.whyShown")} · {data.llm === "llm" ? "AI" : "rule-based"}
                </p>
              </div>
              {data.services?.map((s) => (
                <div key={s.id} className="rounded-lg border border-border p-4">
                  <p className="font-semibold text-link">{localized(s.name)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{localized(s.description)}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <BookButton onBook={() => book(s.id)} />
                    <Link href="/contact" className="inline-flex min-h-10 items-center rounded-lg border border-border px-4 text-sm font-semibold text-foreground hover:bg-muted">
                      {t("assistant.talkToPerson")}
                    </Link>
                  </div>
                </div>
              ))}
            </>
          )}

          <button
            type="button"
            onClick={() => {
              setText("");
              setData(null);
              setPhase("ask");
            }}
            className="text-sm font-semibold text-link hover:underline"
          >
            ← {t("common.back")}
          </button>
        </div>
      )}
    </div>
  );
}

function BookButton({ onBook }: { onBook: () => Promise<void> }) {
  const { t } = useI18n();
  const [state, setState] = useState<"idle" | "booking" | "done">("idle");
  return (
    <button
      type="button"
      disabled={state !== "idle"}
      onClick={async () => {
        setState("booking");
        await onBook();
        setState("done");
      }}
      className="inline-flex min-h-10 items-center rounded-lg bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-70"
    >
      {state === "idle" ? t("assistant.bookThis") : state === "booking" ? t("services.booking") : `✓ ${t("services.booked")}`}
    </button>
  );
}
