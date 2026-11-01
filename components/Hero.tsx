"use client";

import { useEffect, useRef, useState, type ElementType } from "react";
import { SLIDES } from "@/lib/data";
import { ILL } from "@/lib/svg";
import { Cta, Icon, LeafDeco, RawSvg } from "./ui";
import Media from "./Media";

export default function Hero() {
  const [i, setI] = useState(0);
  const [live, setLive] = useState("");
  const idx = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
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
    if (!reduced && !timer.current && n > 1) timer.current = setInterval(() => set(idx.current + 1), 6500);
  };

  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      className="hero ss-hero-bg"
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={stop}
      onFocus={stop}
      onMouseLeave={start}
      onPointerDown={(e) => {
        x0.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (x0.current === null) return;
        const dx = e.clientX - x0.current;
        x0.current = null;
        if (Math.abs(dx) > 50) {
          stop();
          set(idx.current + (dx < 0 ? 1 : -1));
        }
      }}
    >
      <LeafDeco x="46%" y="8%" s={34} r={-30} />
      <LeafDeco x="38%" y="72%" s={26} r={40} op={0.8} />
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
              <div className="slide-in">
                <div className="hero-copy">
                  <H className="hero-h">
                    <span>{s.lines[0]}</span>
                    <span>
                      {s.lines[1][0]}
                      <span className="light">{s.lines[1][1]}</span>
                    </span>
                    <span>{s.lines[2]}</span>
                  </H>
                  <p className="hero-p">{s.text}</p>
                  <Cta label="Shop Now" href="/products" solid />
                  <div className="feats">
                    <span className="feat">
                      <i>
                        <Icon k="leaf" size={20} />
                      </i>
                      100% Fresh
                      <br />
                      Ingredients
                    </span>
                    <span className="feat">
                      <i>
                        <Icon k="shield" size={20} />
                      </i>
                      No Preservatives
                    </span>
                    <span className="feat">
                      <i>
                        <Icon k="heart" size={20} />
                      </i>
                      Healthy &amp; Nutritious
                    </span>
                  </div>
                </div>
                <div className="hero-art">
                  <RawSvg html={ILL.bowl} />
                  <Media src={s.img} label="" alt="Fresh salad bowl" />
                  <p className="lettering" aria-hidden="true">
                    Good Food
                    <br />
                    &nbsp;&nbsp;Good Mood
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button
        className="hero-arrow hero-prev"
        type="button"
        aria-label="Previous slide"
        onClick={() => {
          stop();
          set(idx.current - 1);
        }}
      >
        <Icon k="chevL" size={22} />
      </button>
      <button
        className="hero-arrow hero-next"
        type="button"
        aria-label="Next slide"
        onClick={() => {
          stop();
          set(idx.current + 1);
        }}
      >
        <Icon k="chevR" size={22} />
      </button>
      <p className="sr" aria-live="polite" data-hero-live>
        {live}
      </p>
    </section>
  );
}
