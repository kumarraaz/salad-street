"use client";

import { useState, type FormEvent } from "react";

export default function LoginForm() {
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true);
    setErr("");
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) }).catch(() => null);
    setBusy(false);
    if (r?.ok) {
      window.location.href = "/admin";
      return;
    }
    setErr((await r?.json().catch(() => null))?.error || "Could not sign in. Please try again.");
  };
  return (
    <form className="adm-form" onSubmit={submit}>
      <label>
        Username
        <input name="user" required autoComplete="username" defaultValue="admin" />
      </label>
      <label>
        Password
        <input name="password" type="password" required autoComplete="current-password" />
      </label>
      {err ? (
        <p className="adm-err" role="alert">
          {err}
        </p>
      ) : null}
      <button className="adm-btn primary" type="submit" disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
