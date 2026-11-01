"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { CATEGORIES, REVIEWS, productsInCategory } from "@/lib/data";
import { Icon } from "./ui";
import Media from "./Media";

/** Scroll-snap rail logic shared by the category rail and the reviews carousel. */
function useRail() {
  const track = useRef<HTMLDivElement>(null);
  const [prevDis, setPrevDis] = useState(true);
  const [nextDis, setNextDis] = useState(false);
  const [pages, setPages] = useState(1);
  const [cur, setCur] = useState(0);

  const update = useCallback(() => {
    const t = track.current;
    if (!t) return;
    const max = t.scrollWidth - t.clientWidth - 2;
    setPrevDis(t.scrollLeft <= 2);
    setNextDis(t.scrollLeft >= max);
    setPages(Math.max(1, Math.round(t.scrollWidth / t.clientWidth)));
    setCur(Math.round(t.scrollLeft / t.clientWidth));
  }, []);

  const go = (p: number) => {
    const t = track.current;
    if (!t) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    t.scrollTo({ left: p * t.clientWidth, behavior: reduced ? "auto" : "smooth" });
  };

  useEffect(() => {
    const t = track.current;
    if (!t) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    t.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(t);
    update();
    return () => {
      t.removeEventListener("scroll", onScroll);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [update]);

  const curPage = () => {
    const t = track.current;
    return t ? Math.round(t.scrollLeft / t.clientWidth) : 0;
  };
  return {
    track,
    prevDis,
    nextDis,
    pages,
    cur,
    prev: () => go(Math.max(0, curPage() - 1)),
    next: () => go(curPage() + 1),
    go,
  };
}

export function CategoryRail() {
  const r = useRail();
  return (
    <div className="rail" data-rail>
      <button className="rail-btn" type="button" data-prev aria-label="Previous categories" disabled={r.prevDis} onClick={r.prev}>
        <Icon k="chevL" />
      </button>
      <div className="track cat-track" tabIndex={0} aria-label="Product categories" ref={r.track}>
        {CATEGORIES.map((c) => {
          const n = productsInCategory(c.id);
          return (
            <Link className="cat" href={`/products?cat=${c.id}`} key={c.id}>
              <Media src={c.img} label={c.name} alt={c.name} />
              <b>{c.name}</b>
              <small>{n ? `${n} ${n === 1 ? "product" : "products"}` : "Coming soon"}</small>
            </Link>
          );
        })}
      </div>
      <button className="rail-btn" type="button" data-next aria-label="Next categories" disabled={r.nextDis} onClick={r.next}>
        <Icon k="chevR" />
      </button>
    </div>
  );
}

export function ReviewCard({ name, text, stars, img }: { name: string; text: string; stars: number; img?: string }) {
  return (
    <article className="rcard">
      <Media src={img} label="Avatar" alt={name} />
      <div>
        <q>{text}</q>
        <div className="stars" aria-label={`${stars} out of 5 stars`}>
          {"★".repeat(stars)}
        </div>
        <b>{name}</b>
      </div>
      <span className="qmark" aria-hidden="true">
        ”
      </span>
    </article>
  );
}

export function ReviewCarousel(): ReactNode {
  const r = useRail();
  return (
    <div data-carousel>
      <div className="carousel">
        <button className="rail-btn" type="button" data-prev aria-label="Previous reviews" disabled={r.prevDis} onClick={r.prev}>
          <Icon k="chevL" />
        </button>
        <div className="track rv-track" tabIndex={0} aria-label="Customer reviews" ref={r.track}>
          {REVIEWS.map((rv) => (
            <ReviewCard key={rv.name} {...rv} />
          ))}
        </div>
        <button className="rail-btn" type="button" data-next aria-label="Next reviews" disabled={r.nextDis} onClick={r.next}>
          <Icon k="chevR" />
        </button>
      </div>
      <div className="dots" data-dots aria-label="Review pages">
        {r.pages > 1
          ? Array.from({ length: r.pages }, (_, k) => (
              <button type="button" key={k} aria-label={`Page ${k + 1}`} aria-current={k === r.cur} onClick={() => r.go(k)} />
            ))
          : null}
      </div>
    </div>
  );
}
