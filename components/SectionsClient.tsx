"use client";

import { useRef, useState, type FormEvent } from "react";
import { CONFIG } from "@/lib/data";
import { FARM_VIDEO } from "@/lib/media";
import { Decor, Icon } from "./ui";

/** Farm image with a play button. The video file is only requested when the visitor presses play. */
export function FarmVideo({ poster }: { poster: string }) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  return (
    <div className="farm-media" data-parallax="0.06">
      {playing ? (
        <video ref={ref} src={FARM_VIDEO.src} poster={poster} controls autoPlay playsInline muted preload="none" aria-label="Video of our farm (no speech)" />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={poster} alt="Rows of fresh lettuce growing in a greenhouse" loading="lazy" decoding="async" width={1100} height={720} />
          <button className="play" type="button" onClick={() => setPlaying(true)} aria-label="Play farm video">
            <Icon k="play" size={30} />
          </button>
        </>
      )}
      <small className="credit">{FARM_VIDEO.credit}</small>
    </div>
  );
}

/** Newsletter sign-up. Posts to CONFIG.formEndpoint when one is configured; otherwise says so honestly. */
export function Newsletter() {
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("nl-email") as HTMLInputElement).value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setMsg({ ok: false, t: "Enter a valid email address, like name@example.com." });
      return;
    }
    if (!CONFIG.formEndpoint) {
      setMsg({ ok: false, t: "Newsletter sign-up opens soon. For now, send us a message from the Contact page." });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(CONFIG.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ type: "Newsletter", email, source: location.href }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setMsg({ ok: true, t: "Thanks! You're on the list." });
    } catch {
      setMsg({ ok: false, t: "That didn't go through. Please try again in a moment." });
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="newsletter-wrap" aria-labelledby="nl-t">
      <div className="wrap">
        <div className="newsletter">
          <Decor k="carrot" cls="nl-carrot" />
          <Decor k="tomato" cls="nl-tomato" />
          <h2 id="nl-t">Stay Fresh with Salad Street</h2>
          <p>Get healthy recipes, new arrivals and offers straight to your inbox.</p>
          <form className="nl-form" onSubmit={onSubmit} noValidate>
            <label className="sr" htmlFor="nl-email">
              Email address
            </label>
            <input id="nl-email" name="nl-email" type="email" placeholder="Enter your email address" autoComplete="email" />
            <button type="submit" aria-label="Subscribe" disabled={busy}>
              <Icon k="send" size={20} />
            </button>
          </form>
          <p className={`nl-msg${msg ? (msg.ok ? " ok" : " bad") : ""}`} role="status" aria-live="polite">
            {msg?.t}
          </p>
        </div>
      </div>
    </section>
  );
}
