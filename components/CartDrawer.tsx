"use client";

import Link from "next/link";
import { inr, orderText, waLink } from "@/lib/data";
import { Icon } from "./ui";
import Media from "./Media";
import { useApp } from "./Providers";

export function CartDrawer() {
  const { lines, count, total, set, items, closeCart } = useApp();

  const change = (id: string, d: number) => {
    set(id, (items[id] || 0) + d);
    // Keep keyboard focus on the same control (or the close button if the line vanished)
    setTimeout(() => {
      (
        document.querySelector<HTMLElement>(`#drawer [data-qty="${id}"][data-d="${d}"]`) ||
        document.querySelector<HTMLElement>("#drawer [data-close-cart]")
      )?.focus();
    }, 0);
  };

  return (
    <>
      <div className="scrim" id="scrim" onClick={closeCart} />
      <aside className="drawer" id="drawer" role="dialog" aria-modal="true" aria-labelledby="cartTitle">
        <div className="drawer-hd">
          <h2 id="cartTitle">Your Cart ({count})</h2>
          <button className="icon-btn" type="button" data-close-cart onClick={closeCart} aria-label="Close cart">
            <Icon k="close" size={22} />
          </button>
        </div>
        {lines.length ? (
          <ul className="cart-list">
            {lines.map(({ p, q }) => (
              <li className="cart-item" key={p.id}>
                <Media src={p.img} label="" alt="" />
                <div>
                  <div className="ci-name">
                    {p.name} <span lang="hi">({p.hi})</span>
                  </div>
                  <div className="ci-meta">
                    {p.weight} · {inr(p.price)}
                  </div>
                  <div className="qty">
                    <button type="button" data-qty={p.id} data-d="-1" aria-label={`Decrease ${p.name}`} onClick={() => change(p.id, -1)}>
                      −
                    </button>
                    <span aria-live="polite">{q}</span>
                    <button type="button" data-qty={p.id} data-d="1" aria-label={`Increase ${p.name}`} onClick={() => change(p.id, 1)}>
                      +
                    </button>
                  </div>
                </div>
                <div className="ci-right">
                  {inr(p.price * q)}
                  <button
                    type="button"
                    data-rm={p.id}
                    onClick={() => {
                      set(p.id, 0);
                      setTimeout(() => document.querySelector<HTMLElement>("#drawer [data-close-cart]")?.focus(), 0);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="cart-list">
            <div className="empty" style={{ marginTop: "20px" }}>
              <p>Your cart is empty.</p>
              <Link className="btn btn-solid btn-sm" href="/products" data-close-cart onClick={closeCart}>
                Browse products
              </Link>
            </div>
          </div>
        )}
        <div className="drawer-ft">
          <div className="total">
            <span>Subtotal</span>
            <span>{inr(total)}</span>
          </div>
          {lines.length ? (
            waLink() ? (
              <>
                <a className="btn btn-solid" target="_blank" rel="noopener" href={waLink(orderText(lines, total))}>
                  Place order on WhatsApp
                </a>
                <small>Your order details open in WhatsApp. Delivery and payment are confirmed there.</small>
              </>
            ) : (
              <>
                <button className="btn btn-solid" type="button" disabled>
                  Place order
                </button>
                <small>
                  Online ordering opens soon. To order now, send your list through the{" "}
                  <Link href="/contact" data-close-cart onClick={closeCart}>
                    enquiry form
                  </Link>
                  .
                </small>
              </>
            )
          ) : null}
        </div>
      </aside>
    </>
  );
}

export function Toast() {
  const { toastState, hideToast } = useApp();
  return (
    <div className={`toast${toastState.show ? " show" : ""}`} id="toast" role="status" aria-live="polite">
      <span>{toastState.text}</span>
      {toastState.action ? (
        <button
          type="button"
          onClick={() => {
            hideToast();
            toastState.action?.run();
          }}
        >
          {toastState.action.label}
        </button>
      ) : null}
    </div>
  );
}

