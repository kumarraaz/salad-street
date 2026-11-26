"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType } from "react";
import { CONFIG, SLIDES } from "@/lib/data";
import { Cta, Decor, Icon } from "./ui";

const AUTOPLAY_MS = 4000;
const url = (p: string) => `url("${p.startsWith("/") ? p : "/" + p}")`;

export default function Hero() {
  const [i, setI] = useState(0);
  const [live, setLive] = useState("");
  const idx = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const hovered = useRef(false);
  const x0 = useRef<number | null>(null);
  const n = SLIDES.length;

  const set = (k: number) => {
    idx.current = (k + n) % n;
    setI(idx.current);
    setLive(`Slide ${idx.current + 1} of ${n}`);
  };
  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };
  const start = () => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && !timer.current && n > 1) timer.current = setInterval(() => set(idx.current + 1), AUTOPLAY_MS);
  };
  /* Manual navigation restarts the 4s countdown instead of stopping autoplay for good
     (touch devices never fire mouseleave, so a hard stop would freeze the slider). */
  const go = (k: number) => {
    stop();
    set(k);
    if (!hovered.current) start();
  };

  useEffect(() => {
    start();
    const vis = () => (document.hidden ? stop() : !hovered.current && start());
    document.addEventListener("visibilitychange", vis);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", vis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      className="hero hero-banner"
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={() => {
        hovered.current = true;
        stop();
      }}
      onMouseLeave={() => {
        hovered.current = false;
        start();
      }}
      onPointerDown={(e) => {
        x0.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (x0.current === null) return;
        const dx = e.clientX - x0.current;
        x0.current = null;
        if (Math.abs(dx) > 50) go(idx.current + (dx < 0 ? 1 : -1));
      }}
    >
      <Decor k="leaf" cls="hero-leaf" />
      <Decor k="leaf" cls="hero-leaf2" />
      <div className="slides">
        {SLIDES.map((s, k) => {
          const H = (k ? "h2" : "h1") as ElementType;
          const active = k === i;
          return (
            <div
              key={k}
              className={`slide ${active ? "active" : ""}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${k + 1} of ${n}`}
              aria-hidden={active ? undefined : "true"}
              inert={!active}
            >
              <div
                className="slide-bg"
                style={{ "--bg": url(s.img), "--bg-sm": url(s.imgSm) } as CSSProperties}
                aria-hidden="true"
              />
              <div className="slide-in">
                <div className="hero-copy">
                  <H className="hero-h">
                    {/* Real spaces between the block lines so the heading reads as words */}
                    <span>{s.lines[0]}</span>{" "}
                    <span>
                      {s.lines[1][0]}
                      <span className="light">{s.lines[1][1]}</span>
                    </span>{" "}
                    <span>{s.lines[2]}</span>
                  </H>
                  <p className="hero-p">{s.text}</p>
                  <div className="hero-ctas">
                    <Cta label="Shop Now" href="/products" solid />
                    <Cta label="Visit Our Farm" href="/highlights" />
                    {CONFIG.city ? (
                      <span className="hero-city">
                        <Icon k="pin" size={15} /> Delivering in {CONFIG.city}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button className="hero-arrow hero-prev" type="button" aria-label="Previous slide" onClick={() => go(idx.current - 1)}>
        <Icon k="chevL" size={22} />
      </button>
      <button className="hero-arrow hero-next" type="button" aria-label="Next slide" onClick={() => go(idx.current + 1)}>
        <Icon k="chevR" size={22} />
      </button>
      <div className="hero-dots">
        {SLIDES.map((_, k) => (
          <button
            key={k}
            type="button"
            className={`hero-dot ${k === i ? "on" : ""}`}
            aria-label={`Go to slide ${k + 1}`}
            aria-current={k === i ? "true" : undefined}
            onClick={() => go(k)}
          />
        ))}
      </div>
      <p className="sr" aria-live="polite" data-hero-live>
        {live}
      </p>
    </section>
  );
}
