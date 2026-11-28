"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CONFIG, type Product } from "@/lib/data";
import { Icon } from "./ui";

/* "Notify me" for out-of-stock products.
   1. The request (name + mobile) is saved for the admin's "Notify requests" list.
   2. The customer gets a one-tap WhatsApp message to Salad Street, so the shop is pinged on WhatsApp too. */

function NotifyModal({ p, onClose }: { p: Product; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState<{ wa: string } | null>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    box.current?.querySelector<HTMLElement>("input")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [onClose]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: p.id, name: d.name, phone: d.phone }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Something went wrong.");
      const text = `Hi Salad Street, please notify me when ${p.name}${p.weight ? ` (${p.weight})` : ""} is back in stock.\nName: ${d.name}\nMobile: ${d.phone}`;
      setDone({ wa: `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}` });
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rc-scrim" onClick={onClose}>
      <div className="rc-modal nt-modal" role="dialog" aria-modal="true" aria-labelledby="nt-title" ref={box} onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn rc-close" type="button" onClick={onClose} aria-label="Close">
          <Icon k="close" size={22} />
        </button>
        <h3 id="nt-title" className="story-sub">Notify me</h3>
        {done ? (
          <div className="nt-done">
            <p>
              <b>Thank you!</b> We&apos;ll let you know as soon as {p.name} is back in stock.
            </p>
            <a className="btn btn-solid" href={done.wa} target="_blank" rel="noopener">
              <Icon k="wa" size={18} /> Also send on WhatsApp
            </a>
            <button className="btn btn-outline" type="button" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form className="nt-form" onSubmit={submit}>
            <p>
              <b>{p.name}</b>
              {p.weight ? ` (${p.weight})` : ""} is out of stock right now. Leave your details and we&apos;ll message you when it&apos;s back.
            </p>
            <label>
              Your name
              <input name="name" required maxLength={80} autoComplete="name" />
            </label>
            <label>
              WhatsApp / mobile number
              <input name="phone" required type="tel" inputMode="tel" pattern="[0-9+ ]{10,15}" autoComplete="tel" />
            </label>
            {err ? (
              <p className="nt-err" role="alert">
                {err}
              </p>
            ) : null}
            <button className="btn btn-solid" type="submit" disabled={busy}>
              <Icon k="bell" size={18} /> {busy ? "Saving…" : "Notify me"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/** Button shown instead of Add to Cart when a product is out of stock. */
export function NotifyButton({ p, cls = "" }: { p: Product; cls?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className={`btn-notify ${cls}`} type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label={`Notify me when ${p.name} is back in stock`}>
        <Icon k="bell" size={17} /> Notify
      </button>
      {open ? <NotifyModal p={p} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

export const OutBadge = () => <span className="oos-badge">Out of Stock</span>;
