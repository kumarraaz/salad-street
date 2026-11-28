"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { CONFIG, inStock, inr, per100, type Product } from "@/lib/data";
import { Decor, Icon, SecTitle } from "./ui";
import { useApp } from "./Providers";
import { AddButton, Badge, Dew, WaOrder } from "./Products";
import { NotifyButton, OutBadge } from "./Notify";
import { leafBurst } from "./fx";

/* Packaged products with price, pack size and rating.
   Stars appear only for a genuine `rating` in lib/data.ts; until then the card shows a small "New" pill. */

function Stars({ p }: { p: Product }) {
  if (!p.rating)
    return (
      <p className="pk-rate">
        <span className="pk-new">New</span>
      </p>
    );
  const r = p.rating;
  return (
    <p className="pk-rate" aria-label={`Rated ${r} out of 5${p.reviews ? ` from ${p.reviews} reviews` : ""}`}>
      <span className="pk-stars" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={n <= Math.round(r) ? "on" : ""}>★</span>
        ))}
      </span>
      <b>{r.toFixed(1)}</b>
      {p.reviews ? <small>({p.reviews})</small> : null}
    </p>
  );
}

function PackCard({ p }: { p: Product }) {
  const { add, toast, openCart, wish, toggleWish } = useApp();
  // "" = default pack (the product's own weight/price); otherwise a variant key.
  const [vk, setVk] = useState("");
  const v = p.variants?.find((x) => x.key === vk);
  const weight = v ? v.weight : p.weight;
  const price = v ? v.price : p.price;
  const img = (v && v.pack) || p.pack || p.img;
  const key = v ? `${p.id}~${v.key}` : p.id;
  const href = `/products/${p.id}`;
  const saved = wish.includes(p.id);
  const sizes = p.variants?.length ? [{ key: "", weight: p.weight, price: p.price }, ...p.variants] : [];

  /* Motion: sliding background behind the active weight pill */
  const group = useRef<HTMLDivElement>(null);
  const [ind, setInd] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  useLayoutEffect(() => {
    const b = group.current?.querySelector<HTMLElement>('button[aria-pressed="true"]');
    if (b) setInd({ x: b.offsetLeft, y: b.offsetTop, w: b.offsetWidth, h: b.offsetHeight });
  }, [vk, sizes.length]);

  return (
    <article className={`pk-card${inStock(p) ? "" : " oos"}`}>
      <div className="pk-img" style={p.tint ? ({ "--tint": p.tint } as React.CSSProperties) : undefined}>
        <Link href={href} tabIndex={-1}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="pk-photo" src={img} alt={`${p.name}${weight ? ` ${weight}` : ""} pack from Salad Street Farms`} width={900} height={720} loading="lazy" decoding="async" />
          <Dew />
        </Link>
        {inStock(p) ? <Badge p={p} /> : <OutBadge />}
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
      </div>
      <div className="pk-body">
        <h3 className="pk-name">
          <Link href={href}>{p.name}</Link>
        </h3>
        <Stars p={p} />
        <p className="pk-price">
          <b key={price ?? "na"} className="pk-pv">{price == null ? "Price on request" : inr(price)}</b>
          {weight ? <span>/ {weight}</span> : null}
        </p>
        {per100(price, weight) ? <p className="p100">{per100(price, weight)}</p> : null}
        {sizes.length ? (
          <div className={`pk-sizes${ind ? " has-ind" : ""}`} role="group" aria-label={`${p.name} pack size`} ref={group}>
            {ind ? <span className="pk-ind" aria-hidden="true" style={{ width: ind.w, height: ind.h, transform: `translate(${ind.x}px,${ind.y}px)` }} /> : null}
            {sizes.map((s) => (
              <button type="button" key={s.key || "default"} aria-pressed={s.key === vk} onClick={() => setVk(s.key)}>
                {s.weight}
                {s.price != null ? ` · ₹${s.price}` : ""}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {!inStock(p) ? (
        <div className="pactions one">
          <NotifyButton p={p} />
        </div>
      ) : (
      <div className="pactions">
      <AddButton
        dataAdd={key}
        img={img}
        label={`Add ${p.name}${weight ? ` ${weight}` : ""} to cart`}
        onAdd={() => {
          add(key);
          toast(`${p.name}${weight ? ` (${weight})` : ""} added to cart`, { label: "View cart", run: openCart });
        }}
      />
      <WaOrder id={key} name={p.name} weight={weight} price={price} />
      </div>
      )}
    </article>
  );
}

/** Delivery facts strip: only the values the client has confirmed in CONFIG; nothing renders if none are set. */
export function DeliveryStrip() {
  const items = [CONFIG.city, CONFIG.minOrder && `Min. order ${CONFIG.minOrder}`, CONFIG.deliveryFee && `Delivery ${CONFIG.deliveryFee}`, CONFIG.deliveryDays, CONFIG.payment].filter(Boolean);
  return items.length ? <p className="dstrip">{items.join(" · ")}</p> : null;
}

export default function PackShop({ cls = "bg-c", exclude, id }: { cls?: string; exclude?: string; id?: string }) {
  const { products } = useApp();
  const list = products.filter((p) => p.id !== exclude);
  return (
    <section className={`sec deco-sec pk-sec ${cls}`} id={id} aria-labelledby="pk-t">
      <Decor k="leaf" cls="corner-tl" />
      <Decor k="leaf" cls="corner-tr" />
      <div className="wrap">
        <SecTitle id="pk-t" eyebrow="Shop Our Packs" title="Farm Fresh, Ready-to-Eat Salad Greens" />
        <DeliveryStrip />
        <div className="pk-grid">
          {list.map((p) => (
            <PackCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
