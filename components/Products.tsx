"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES, priceText, type Product } from "@/lib/data";
import { Cta, Icon } from "./ui";
import Media from "./Media";
import { useApp } from "./Providers";
import { useRail } from "./Rails";

/* Product cards use only real data from lib/data.ts (name, price, weight, image).
   No ratings are shown because none have been supplied. */

export const productHref = (p: Product) => `/products/${p.id}`;

function WishBtn({ p }: { p: Product }) {
  const { wish, toggleWish, toast } = useApp();
  const saved = wish.includes(p.id);
  return (
    <button
      className={`wish${saved ? " on" : ""}`}
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`}
      onClick={() => {
        const now = toggleWish(p.id);
        toast(now ? `${p.name} saved to wishlist` : `${p.name} removed from wishlist`);
      }}
    >
      <Icon k="heart" size={18} />
    </button>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const { add, toast, openCart } = useApp();
  const href = productHref(p);
  return (
    <article className="pcard">
      <div className="pimg">
        <Link href={href} tabIndex={-1} aria-hidden="true" className="pimg-link">
          <Media src={p.img} label={"Product photo · " + p.name} alt="" cls="cutout" />
        </Link>
        <WishBtn p={p} />
      </div>
      <div className="pbody">
        <h3 className="pn">
          <Link href={href}>
            {p.name} {p.hi ? <span lang="hi">({p.hi})</span> : null}
          </Link>
        </h3>
        <p className="pmeta">
          <span className={`pp${p.price == null ? " por" : ""}`}>{priceText(p)}</span>
          {p.weight ? <span className="pw">/ {p.weight}</span> : null}
        </p>
      </div>
      <button
        className="btn-cart"
        type="button"
        data-add={p.id}
        aria-label={`Add ${p.name} to cart`}
        onClick={() => {
          add(p.id);
          toast(`${p.name} added to cart`, { label: "View cart", run: openCart });
        }}
      >
        <Icon k="cart" size={17} /> Add to Cart
      </button>
    </article>
  );
}

export function ProductGrid({ list }: { list: Product[] }) {
  return list.length ? (
    <div className="pgrid">
      {list.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  ) : (
    <div className="empty">
      <p>No products in this category yet.</p>
      <Cta label="View all products" href="/products" />
    </div>
  );
}

/** 4 cards per slide on desktop, 3 on tablet, 2 on phones (swipe), with prev/next and page dots. */
export function ProductSlider({ list, label = "Products" }: { list: Product[]; label?: string }) {
  const r = useRail();
  return (
    <div className="pslider" data-carousel>
      <div className="pslider-row">
        <button className="rail-btn ps-prev" type="button" aria-label={`Previous ${label.toLowerCase()}`} disabled={r.prevDis} onClick={r.prev}>
          <Icon k="chevL" />
        </button>
        <div className="track ps-track" tabIndex={0} aria-label={label} ref={r.track}>
          {list.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
        <button className="rail-btn ps-next" type="button" aria-label={`Next ${label.toLowerCase()}`} disabled={r.nextDis} onClick={r.next}>
          <Icon k="chevR" />
        </button>
      </div>
      <div className="dots" aria-label={`${label} pages`}>
        {r.pages > 1
          ? Array.from({ length: r.pages }, (_, k) => (
              <button type="button" key={k} aria-label={`Page ${k + 1}`} aria-current={k === r.cur} onClick={() => r.go(k)} />
            ))
          : null}
      </div>
    </div>
  );
}

/** Buy box on the product detail page: quantity, add to cart, wishlist. */
export function BuyBox({ p }: { p: Product }) {
  const { add, toast, openCart } = useApp();
  const [q, setQ] = useState(1);
  const cat = CATEGORIES.find((c) => c.id === p.cat);
  return (
    <div className="buybox">
      <p className="pd-price">
        {priceText(p)} {p.weight ? <span>/ {p.weight}</span> : null}
      </p>
      {cat ? (
        <p className="pd-cat">
          Category: <Link href={`/products?cat=${cat.id}`}>{cat.name}</Link>
        </p>
      ) : null}
      <div className="pd-actions">
        <div className="qty" role="group" aria-label="Quantity">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQ((n) => Math.max(1, n - 1))}>
            −
          </button>
          <span aria-live="polite">{q}</span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQ((n) => Math.min(99, n + 1))}>
            +
          </button>
        </div>
        <button
          className="btn btn-solid"
          type="button"
          data-add={p.id}
          onClick={() => {
            add(p.id, q);
            toast(`${q} × ${p.name} added to cart`, { label: "View cart", run: openCart });
          }}
        >
          <Icon k="cart" size={18} /> Add to Cart
        </button>
        <WishBtn p={p} />
      </div>
    </div>
  );
}
