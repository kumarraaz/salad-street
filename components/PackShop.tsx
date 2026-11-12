"use client";

import Link from "next/link";
import { useState } from "react";
import { PRODUCTS, inr, type Product } from "@/lib/data";
import { Decor, Icon, SecTitle } from "./ui";
import { useApp } from "./Providers";

/* Packaged products with price, pack size and rating.
   Stars are filled only from a genuine `rating` in lib/data.ts; until then they show as empty with "No reviews yet". */

function Stars({ p }: { p: Product }) {
  const r = p.rating ?? 0;
  return (
    <p className="pk-rate" aria-label={p.rating ? `Rated ${r} out of 5${p.reviews ? ` from ${p.reviews} reviews` : ""}` : "No reviews yet"}>
      <span className="pk-stars" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={n <= Math.round(r) ? "on" : ""}>★</span>
        ))}
      </span>
      {p.rating ? (
        <>
          <b>{r.toFixed(1)}</b>
          {p.reviews ? <small>({p.reviews})</small> : null}
        </>
      ) : (
        <small>No reviews yet</small>
      )}
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
  const sizes = p.variants?.length ? [{ key: "", weight: p.weight }, ...p.variants] : [];
  return (
    <article className="pk-card">
      <div className="pk-img">
        <Link href={href} tabIndex={-1} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt="" width={900} height={720} loading="lazy" decoding="async" />
        </Link>
        <button
          className={`wish${saved ? " on" : ""}`}
          type="button"
          aria-pressed={saved}
          aria-label={saved ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`}
          onClick={() => toast(toggleWish(p.id) ? `${p.name} saved to wishlist` : `${p.name} removed from wishlist`)}
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
          <b>{price == null ? "Price on request" : inr(price)}</b>
          {weight ? <span>/ {weight}</span> : null}
        </p>
        {sizes.length ? (
          <div className="pk-sizes" role="group" aria-label={`${p.name} pack size`}>
            {sizes.map((s) => (
              <button type="button" key={s.key || "default"} aria-pressed={s.key === vk} onClick={() => setVk(s.key)}>
                {s.weight}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <button
        className="btn-cart"
        type="button"
        data-add={key}
        aria-label={`Add ${p.name}${weight ? ` ${weight}` : ""} to cart`}
        onClick={() => {
          add(key);
          toast(`${p.name}${weight ? ` (${weight})` : ""} added to cart`, { label: "View cart", run: openCart });
        }}
      >
        <Icon k="cart" size={17} /> Add to Cart
      </button>
    </article>
  );
}

export default function PackShop({ cls = "bg-c", exclude }: { cls?: string; exclude?: string }) {
  const list = PRODUCTS.filter((p) => p.id !== exclude);
  return (
    <section className={`sec deco-sec pk-sec ${cls}`} aria-labelledby="pk-t">
      <Decor k="leaf" cls="corner-tl" />
      <Decor k="leaf" cls="corner-tr" />
      <div className="wrap">
        <SecTitle id="pk-t" eyebrow="Shop Our Packs" title="Farm Fresh, Ready-to-Eat Salad Greens" />
        <div className="pk-grid">
          {list.map((p) => (
            <PackCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
