"use client";

import { PRODUCTS } from "@/lib/data";
import { Cta } from "./ui";
import { ProductGrid } from "./Products";
import { useApp } from "./Providers";

/** Products saved with the heart button (stored in this browser only). */
export default function WishlistView() {
  const { wish } = useApp();
  const list = PRODUCTS.filter((p) => wish.includes(p.id));
  return list.length ? (
    <ProductGrid list={list} />
  ) : (
    <div className="empty">
      <p>Your wishlist is empty. Tap the heart on any product to save it here (saved in this browser).</p>
      <Cta label="Browse products" href="/products" />
    </div>
  );
}
