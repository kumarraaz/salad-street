"use client";

import { inr, type Product } from "@/lib/data";
import { Cta } from "./ui";
import Media from "./Media";
import { useApp } from "./Providers";

export function ProductCard({ p }: { p: Product }) {
  const { add, toast, openCart } = useApp();
  return (
    <article className="pcard">
      <Media src={p.img} label={"Product photo · " + p.name} alt={`${p.name}, ${p.weight}`} />
      <div className="pbody">
        <span className="pw">{p.weight}</span>
        <h3 className="pn">
          {p.name} <span lang="hi">({p.hi})</span>
        </h3>
        <span className="pp">{inr(p.price)}</span>
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

