"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* Scroll-reveal + header shadow. Pure DOM attributes (no re-renders), so React output is untouched.
   Only elements that start below the fold are hidden, which means nothing on screen ever flickers.
   Reveal uses opacity + the `translate` property, so it never fights an element's own transform/hover. */
const SEL = [
  ".sec-title",
  ".hl-card",
  ".rail",
  ".pcard",
  ".founder-card",
  ".why",
  ".why-item",
  ".fitem",
  ".hv-item",
  ".pk-item",
  ".kits",
  ".farm-copy",
  ".farm-media",
  ".process-in",
  ".query",
  ".newsletter",
  ".carousel",
  ".rv-grid > *",
  ".bcard",
  ".faq-in",
  ".hl-row",
  ".info-card",
  ".form-card",
  ".article",
  ".empty",
  ".cta-row",
  ".decor",
].join(",");

export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const hdr = document.getElementById("siteHeader");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (hdr) hdr.dataset.scrolled = window.scrollY > 8 ? "1" : "0";
        if (reduced) return;
        /* Parallax: [data-parallax="0.15"] gets --py (px) while on screen; CSS applies it with `translate`. */
        const vh = window.innerHeight;
        document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.bottom < 0 || r.top > vh) return;
          const f = parseFloat(el.dataset.parallax || "0.15");
          const centre = r.top + r.height / 2 - vh / 2;
          el.style.setProperty("--py", `${(-centre * f).toFixed(1)}px`);
        });
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const root = document.getElementById("app");
    if (!root) return;

    const pending = new Set<HTMLElement>();
    const reveal = (el: HTMLElement) => {
      if (!pending.delete(el)) return;
      io.unobserve(el);
      el.dataset.rv = "1";
      // Hand the element back to its own CSS transitions once the reveal has played.
      setTimeout(() => el.removeAttribute("data-rv"), 1400);
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) reveal(e.target as HTMLElement);
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    /* Safety net for fast jumps (End key, anchor links): anything that has reached or passed
       the viewport is revealed, so nothing can stay invisible above the user. */
    let ticking = false;
    const sweep = () => {
      ticking = false;
      const vh = window.innerHeight;
      pending.forEach((el) => {
        if (el.getBoundingClientRect().top < vh * 0.95) reveal(el);
      });
    };
    const onScroll = () => {
      if (ticking || !pending.size) return;
      ticking = true;
      requestAnimationFrame(sweep);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const scan = () => {
      const vh = window.innerHeight;
      root.querySelectorAll<HTMLElement>(SEL).forEach((el) => {
        if (el.dataset.rvSeen) return;
        el.dataset.rvSeen = "1";
        if (el.getBoundingClientRect().top < vh * 0.92) return; // already visible: leave as is
        const sibs = el.parentElement ? Array.from(el.parentElement.children).filter((c) => c.matches(SEL)) : [];
        const i = Math.max(0, sibs.indexOf(el));
        el.style.setProperty("--rvd", `${Math.min(i, 5) * 80}ms`);
        el.dataset.rv = "0";
        pending.add(el);
        io.observe(el);
      });
    };

    scan();
    const mo = new MutationObserver(() => scan());
    mo.observe(root, { childList: true, subtree: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      mo.disconnect();
      io.disconnect();
      pending.forEach((el) => el.removeAttribute("data-rv"));
    };
  }, [pathname]);

  return null;
}
