"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES, inStock, logWaClick, per100, priceText, waOrderLink, type Product } from "@/lib/data";
import { NotifyButton, OutBadge } from "./Notify";
import { Cta, Icon } from "./ui";
import Media from "./Media";
import { useApp } from "./Providers";
import { useRail } from "./Rails";
import { flyToCart, leafBurst } from "./fx";
import PinCheck from "./PinCheck";

/* Product cards use only real data from lib/data.ts (name, price, weight, image).
   The rating row appears only for products with a genuine `rating` set. */

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
      onClick={(e) => {
        const now = toggleWish(p.id);
        if (now) leafBurst(e.currentTarget);
        toast(now ? `${p.name} saved to wishlist` : `${p.name} removed from wishlist`);
      }}
    >
      <Icon k="heart" size={18} />
    </button>
  );
}

/* Motion: hover dew — 3 sparkle dots + a small leaf, shown once on hover/focus */
export function Dew() {
  return (
    <span className="dew" aria-hidden="true">
      <i />
      <i />
      <i />
      <svg viewBox="0 0 24 24">
        <path d="M4 20C4 10 10.5 3.5 21 3.5c0 10.5-6.5 16.5-17 16.5z" />
      </svg>
    </span>
  );
}

/** Badge on the image, only when the product data sets one (e.g. "Bestseller"). */
export function Badge({ p }: { p: Product }) {
  return p.badge ? <span className="pbadge">{p.badge}</span> : null;
}

/* Motion: Add to Cart → squish, "Added ✓" with a self-drawing tick (reverts after 1.6s), image flies to the cart */
export function AddButton({ label, dataAdd, img, onAdd }: { label: string; dataAdd: string; img?: string; onAdd: () => void }) {
  const [added, setAdded] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  return (
    <button
      className={`btn-cart${added ? " is-added" : ""}`}
      type="button"
      data-add={dataAdd}
      aria-label={label}
      onClick={(e) => {
        const btn = e.currentTarget;
        onAdd();
        if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
          btn.animate([{ transform: "scale(1)" }, { transform: "scale(.94,.9)" }, { transform: "scale(1)" }], { duration: 300, easing: "cubic-bezier(.34,1.56,.64,1)" });
        const frame = btn.closest("article")?.querySelector(".pimg, .pk-img") ?? null;
        requestAnimationFrame(() => flyToCart(frame, img));
        setAdded(true);
        clearTimeout(t.current);
        t.current = setTimeout(() => setAdded(false), 1600);
      }}
    >
      <span className="ac-a">
        <Icon k="cart" size={17} />
        <span className="lbl-lg">Add to Cart</span>
        <span className="lbl-sm">Add</span>
      </span>
      <span className="ac-b" aria-hidden="true">
        Added
        <svg viewBox="0 0 16 16">
          <path d="M3 8.5l3 3 7-7" pathLength="1" />
        </svg>
      </span>
    </button>
  );
}

/** "Order on WhatsApp" link for one pack (opens a pre-filled chat). */
export function WaOrder({ id = "", name, weight, price }: { id?: string; name: string; weight?: string; price?: number | null }) {
  return (
    <a className="btn-wa" href={waOrderLink(name, weight, price)} target="_blank" rel="noopener" onClick={() => logWaClick("card", id, weight)} aria-label={`Order ${name}${weight ? " " + weight : ""} on WhatsApp`}>
      <Icon k="wa" size={17} />
      <span className="lbl-lg">WhatsApp</span>
    </a>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const { add, toast, openCart } = useApp();
  const href = productHref(p);
  return (
    <article className={`pcard${inStock(p) ? "" : " oos"}`}>
      <div className="pimg" style={p.tint ? ({ "--tint": p.tint } as React.CSSProperties) : undefined}>
        <Link href={href} tabIndex={-1} className="pimg-link">
          {p.pack ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="pk-photo" src={p.pack} alt={`${p.name}${p.weight ? ` ${p.weight}` : ""} pack from Salad Street Farms`} width={900} height={720} loading="lazy" decoding="async" />
          ) : (
            <Media src={p.img} label="" alt={`${p.name}${p.weight ? ` (${p.weight})` : ""}, fresh from Salad Street Farms`} cls="cutout" />
          )}
          <Dew />
        </Link>
        {inStock(p) ? <Badge p={p} /> : <OutBadge />}
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
        {per100(p.price, p.weight) ? <p className="p100">{per100(p.price, p.weight)}</p> : null}
        {p.rating ? (
          <p className="prate" aria-label={`Rated ${p.rating} out of 5${p.reviews ? ` from ${p.reviews} reviews` : ""}`}>
            <span className="prate-star" aria-hidden="true">★</span>
            <b>{p.rating.toFixed(1)}</b>
            {p.reviews ? <span>({p.reviews})</span> : null}
          </p>
        ) : null}
      </div>
      {!inStock(p) ? (
        <div className="pactions one">
          <NotifyButton p={p} />
        </div>
      ) : (
      <div className="pactions">
      <AddButton
        dataAdd={p.id}
        img={p.pack || p.img}
        label={`Add ${p.name} to cart`}
        onAdd={() => {
          add(p.id);
          toast(`${p.name} added to cart`, { label: "View cart", run: openCart });
        }}
      />
      <WaOrder id={p.id} name={p.name} weight={p.weight} price={p.price} />
      </div>
      )}
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
      {per100(p.price, p.weight) ? <p className="p100">{per100(p.price, p.weight)}</p> : null}
      {cat ? (
        <p className="pd-cat">
          Category: <Link href={`/products?cat=${cat.id}`}>{cat.name}</Link>
        </p>
      ) : null}
      {!inStock(p) ? (
        <div className="pd-actions">
          <span className="oos-badge static">Out of Stock</span>
          <NotifyButton p={p} cls="lg" />
          <WishBtn p={p} />
        </div>
      ) : (
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
      )}
      <PinCheck />
    </div>
  );
}
