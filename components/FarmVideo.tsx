"use client";

import { useEffect, useRef } from "react";
import { Cta } from "./ui";

/* Farm video: plays (muted, looping) only while on screen; nothing is downloaded until then.
   Text re-uses existing site copy (Day Highlights / Farm Tour). */
export default function FarmVideo({ cls = "", src, poster }: { cls?: string; src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || !("IntersectionObserver" in window)) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !still) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <section className={`sec fv ${cls}`} aria-labelledby="fv-t">
      <div className="wrap fv-in">
        <div className="fv-copy">
          <p className="script">A day of fresh food, fun and learning</p>
          <h2 id="fv-t" className="story-sub">Visit Our Farm</h2>
          <p>A guided farm walk to discover how food is grown and cared for, with fun for the whole family.</p>
          <Cta label="Visit Our Farm" href="/highlights" solid />
        </div>
        <div className="fv-media">
          <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" width={1280} height={720} aria-label="Video of the Salad Street farm (no sound)" />
        </div>
      </div>
    </section>
  );
}
