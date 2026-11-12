"use client";

import { inr, type Product } from "@/lib/data";
import { Cta, Icon } from "./ui";
import Media from "./Media";
import { useApp } from "./Providers";

export function ProductCard({ p }: { p: Product }) {
  const { add, toast, openCart, wish, toggleWish } = useApp();
  const saved = wish.includes(p.id);
  return (
    <article className="pcard">
      <div className="pimg">
        <Media src={p.img} label={"Product photo · " + p.name} alt={`${p.name}, ${p.weight}`} />
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
      </div>
      <div className="pbody">
        <h3 className="pn">
          {p.name} <span lang="hi">({p.hi})</span>
        </h3>
        <p className="pmeta">
          <span className="pp">{inr(p.price)}</span>
          <span className="pw">/ {p.weight}</span>
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
        Add to Cart
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
