"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { CATEGORIES, REVIEWS, productsInCategory } from "@/lib/data";
import { useApp } from "./Providers";
import { Icon } from "./ui";
import Media from "./Media";

/** Scroll-snap rail logic shared by the category rail and the reviews carousel. */
export function useRail() {
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
  const { products: PRODUCTS } = useApp();
  const r = useRail();
  return (
    <div className="rail" data-rail>
      <button className="rail-btn" type="button" data-prev aria-label="Previous categories" disabled={r.prevDis} onClick={r.prev}>
        <Icon k="chevL" />
      </button>
      <div className="track cat-track" tabIndex={0} aria-label="Product categories" ref={r.track}>
        {CATEGORIES.map((c) => {
          const n = productsInCategory(c.id, PRODUCTS);
          return (
            <Link className="cat" href={`/products?cat=${c.id}`} key={c.id}>
              <Media src={c.img} label={c.name} alt={c.name} cls="cutout" />
              <span className="cat-meta">
                <span>
                  <b>{c.name}</b>
                  <small>{n ? `${n} ${n === 1 ? "product" : "products"}` : null}</small>
                </span>
                <span className="cat-go" aria-hidden="true">
                  <Icon k="chevR" size={16} />
                </span>
              </span>
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

/** "Shop by Product": category-style cards for the 7 products, each linking to its product page. */
export function ProductRail() {
  const { products: PRODUCTS } = useApp();
  const r = useRail();
  return (
    <div className="pslider" data-carousel>
      <div className="rail">
        <button className="rail-btn" type="button" aria-label="Previous products" disabled={r.prevDis} onClick={r.prev}>
          <Icon k="chevL" />
        </button>
        <div className="track cat-track" tabIndex={0} aria-label="Shop by product" ref={r.track}>
          {PRODUCTS.map((p) => (
            <Link className="cat" href={`/products/${p.id}`} key={p.id}>
              <Media src={p.img} label={p.name} alt={p.name} cls="cutout" />
              <span className="cat-meta">
                <span>
                  <b>{p.name}</b>
                  <small>{p.note}</small>
                </span>
                <span className="cat-go" aria-hidden="true">
                  <Icon k="chevR" size={16} />
                </span>
              </span>
            </Link>
          ))}
        </div>
        <button className="rail-btn" type="button" aria-label="Next products" disabled={r.nextDis} onClick={r.next}>
          <Icon k="chevR" />
        </button>
      </div>
      <div className="dots" aria-label="Product pages">
        {r.pages > 1
          ? Array.from({ length: r.pages }, (_, k) => (
              <button type="button" key={k} aria-label={`Page ${k + 1}`} aria-current={k === r.cur} onClick={() => r.go(k)} />
            ))
          : null}
      </div>
    </div>
  );
}

export function ReviewCard({ name, text, stars, img }: { name: string; text: string; stars: number; img?: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <article className="rcard">
      <span className="rq" aria-hidden="true">
        <Icon k="quote" size={26} />
      </span>
      <q>{text}</q>
      <div className="rfoot">
        {img ? <Media src={img} label="" alt={name} cls="ravatar" /> : <span className="ravatar ini" aria-hidden="true">{initials}</span>}
        <b>{name}</b>
        <span className="stars" role="img" aria-label={`${stars} out of 5 stars`}>
          {"★".repeat(stars)}
        </span>
      </div>
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

/** "Upcoming Harvest": cream cards for the 7 products, 4 per view on desktop, 2 on phones. */
export function HarvestRail() {
  const { products: PRODUCTS } = useApp();
  const r = useRail();
  return (
    <div className="hv-slider" data-carousel>
      <button className="rail-btn hv-prev" type="button" aria-label="Previous products" disabled={r.prevDis} onClick={r.prev}>
        <Icon k="chevL" />
      </button>
      <div className="track hv-rail" tabIndex={0} aria-label="Available next week" ref={r.track}>
        {PRODUCTS.map((p, i) => (
          <Link className="hv-card" href={`/products/${p.id}`} key={p.id}>
            <span className="hv-pic">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt={p.name} loading="lazy" decoding="async" width={360} height={300} style={{ ["--d" as string]: `${(i % 4) * -1.5}s` }} />
            </span>
            <span className="hv-meta">
              <span>
                <b>{p.name}</b>
                <small>{p.note}</small>
              </span>
              <span className="hv-go" aria-hidden="true">
                <Icon k="chevR" size={15} />
              </span>
            </span>
          </Link>
        ))}
      </div>
      <button className="rail-btn hv-next" type="button" aria-label="Next products" disabled={r.nextDis} onClick={r.next}>
        <Icon k="chevR" />
      </button>
      <div className="dots" aria-label="Harvest pages">
        {r.pages > 1
          ? Array.from({ length: r.pages }, (_, k) => (
              <button type="button" key={k} aria-label={`Page ${k + 1}`} aria-current={k === r.cur} onClick={() => r.go(k)} />
            ))
          : null}
      </div>
    </div>
  );
}
