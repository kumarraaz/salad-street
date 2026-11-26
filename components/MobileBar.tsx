"use client";

import { CONFIG } from "@/lib/data";
import { Icon } from "./ui";
import { useApp } from "./Providers";

/** Phones only: sticky bottom bar with WhatsApp ordering and the cart. Floating buttons sit above it. */
export default function MobileBar() {
  const { count, openCart } = useApp();
  return (
    <nav className="mbar" aria-label="Quick order">
      <a className="mbar-wa" href={`https://wa.me/${CONFIG.whatsapp}`} target="_blank" rel="noopener">
        <Icon k="wa" size={20} /> Order on WhatsApp
      </a>
      <button className="mbar-cart" type="button" data-open-cart onClick={openCart} aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}>
        <Icon k="cart" size={20} /> Cart
        <span className="mbar-n">{count}</span>
      </button>
    </nav>
  );
}
