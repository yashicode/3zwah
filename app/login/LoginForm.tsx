"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";

export function LoginForm() {
  const { t } = useI18n();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone, name }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error("login failed");
      router.push(data.onboarded ? "/dashboard" : "/welcome");
      router.refresh();
    } catch {
      setError(true);
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="text-3xl font-bold text-foreground">{t("login.title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("login.subtitle")}</p>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="login-phone" className="mb-1 block text-sm font-medium text-foreground">
            {t("login.phoneLabel")}
          </label>
          <input
            id="login-phone"
            type="tel"
            inputMode="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("login.phonePlaceholder")}
            className="min-h-12 w-full rounded-lg border border-border bg-surface px-4 text-base text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div>
          <label htmlFor="login-name" className="mb-1 block text-sm font-medium text-foreground">
            {t("login.nameLabel")}
          </label>
          <input
            id="login-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("login.namePlaceholder")}
            className="min-h-12 w-full rounded-lg border border-border bg-surface px-4 text-base text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {error && <p className="text-sm text-destructive">{t("common.error")}</p>}

        <button
          type="submit"
          disabled={busy}
          className="min-h-12 w-full rounded-lg bg-primary px-6 font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
        >
          {busy ? t("login.submitting") : t("login.submit")}
        </button>
      </form>

      <p className="mt-6 text-xs text-muted-foreground">{t("login.demoNote")}</p>
    </div>
  );
}
