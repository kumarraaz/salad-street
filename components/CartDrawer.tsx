"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { BLOCKED_DATES, CONFIG, DELIVERY_SLOTS, baseId, inr, orderText, waLink, priceText } from "@/lib/data";
import { Icon } from "./ui";
import Media from "./Media";
import { useApp } from "./Providers";

/* Reservable delivery days: tomorrow to +14 days. Sundays and BLOCKED_DATES are disabled. */
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const dayLabel = (d: Date) => d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
function deliveryDays() {
  const out: { key: string; label: string; off: boolean }[] = [];
  const t = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(t.getFullYear(), t.getMonth(), t.getDate() + i);
    out.push({ key: iso(d), label: dayLabel(d), off: d.getDay() === 0 || BLOCKED_DATES.includes(iso(d)) });
  }
  return out;
}

export function CartDrawer() {
  const { lines, count, total, set, items, closeCart } = useApp();
  const [step, setStep] = useState<"cart" | "checkout" | "done">("cart");
  const [pay, setPay] = useState<"upi" | "whatsapp">(CONFIG.upi ? "upi" : "whatsapp");
  const [done, setDone] = useState<{ upi: string; wa: string } | null>(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const days = step === "checkout" ? deliveryDays() : [];
  const dateText = date ? `${days.find((x) => x.key === date)?.label ?? date}${slot ? ` · ${slot}` : ""}` : "";
  const priced = lines.length > 0 && lines.every((l) => l.p.price != null);
  const upiOk = !!CONFIG.upi && priced && total > 0;

  const [saving, setSaving] = useState(false);
  const placeOrder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (saving) return;
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (!date || !slot) return; // native validation already blocks this; belt and braces
    const method = pay === "upi" && upiOk ? "UPI (online)" : "Pay after confirmation on WhatsApp";
    const useUpi = pay === "upi" && upiOk;
    // Open the WhatsApp tab now, while we still have the click (pop-up blockers), and fill it in after saving.
    const tab = useUpi ? null : window.open("", "_blank");
    setSaving(true);
    // 1) Save the order for the admin panel (prices are re-checked on the server).
    let orderId = "";
    try {
      const r = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: d.name, phone: d.phone, address: d.address, pin: d.pin, note: d.note },
          delivery: { date, slot },
          payment: method,
          lines: lines.map((l) => ({ id: l.p.id, q: l.q })),
        }),
      });
      if (r.ok) orderId = (await r.json()).id || "";
    } catch {
      /* still send the order on WhatsApp */
    }
    setSaving(false);
    // 2) The order message for WhatsApp.
    const text = `${orderId ? `Order ID: ${orderId}
` : ""}${orderText(lines, total)}

Name: ${d.name}
Phone: ${d.phone}
Address: ${d.address}${d.pin ? ` - ${d.pin}` : ""}${d.note ? `
Note: ${d.note}` : ""}
Delivery date: ${dateText}
Payment: ${method}`;
    const wa = waLink(text);
    const upi = useUpi
      ? `upi://pay?pa=${encodeURIComponent(CONFIG.upi)}&pn=${encodeURIComponent("Salad Street")}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Salad Street order ${orderId} · delivery ${date} ${slot}`)}`
      : "";
    setDone({ upi, wa });
    setStep("done");
    if (upi) window.location.href = upi;
    else if (wa) {
      if (tab) {
        tab.opener = null;
        tab.location.href = wa;
      } else window.open(wa, "_blank", "noopener");
    }
  };

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
          <h2 id="cartTitle">{step === "cart" ? `Your Cart (${count})` : step === "checkout" ? "Checkout" : "Order Details Sent"}</h2>
          <button className="icon-btn" type="button" data-close-cart onClick={closeCart} aria-label="Close cart">
            <Icon k="close" size={22} />
          </button>
        </div>
        {step === "checkout" && lines.length ? (
          <form className="checkout" id="checkoutForm" onSubmit={placeOrder}>
            <button type="button" className="co-back" onClick={() => setStep("cart")}>
              <Icon k="chevL" size={16} /> Back to cart
            </button>
            <fieldset>
              <legend>Delivery details</legend>
              <label>Full name<input name="name" required autoComplete="name" /></label>
              <label>Mobile number<input name="phone" required type="tel" inputMode="tel" pattern="[0-9+ ]{10,15}" autoComplete="tel" /></label>
              <label>Delivery address<textarea name="address" required rows={3} autoComplete="street-address" /></label>
              <label>Pin code<input name="pin" inputMode="numeric" pattern="[0-9]{6}" autoComplete="postal-code" /></label>
              <label>Note (optional)<input name="note" /></label>
            </fieldset>
            <fieldset className="co-date">
              <legend>Reserve a delivery date</legend>
              <div className="co-days" role="radiogroup" aria-label="Delivery date">
                {days.map((x) => (
                  <label key={x.key} className={`co-day${x.off ? " off" : ""}`}>
                    <input type="radio" name="date" value={x.key} required disabled={x.off} checked={date === x.key} onChange={() => setDate(x.key)} />
                    <span>{x.label}</span>
                  </label>
                ))}
              </div>
              <div className="co-slots" role="radiogroup" aria-label="Time slot">
                {DELIVERY_SLOTS.map((s) => (
                  <label key={s} className="co-day">
                    <input type="radio" name="slot" value={s} required checked={slot === s} onChange={() => setSlot(s)} />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
              <small className="co-hint">Sundays are closed.</small>
            </fieldset>
            <fieldset className="co-pay">
              <legend>Payment method</legend>
              {CONFIG.upi ? (
                <label className={`co-opt${upiOk ? "" : " off"}`}>
                  <input type="radio" name="pay" value="upi" checked={pay === "upi"} disabled={!upiOk} onChange={() => setPay("upi")} />
                  <span>
                    <b>Pay online with UPI</b>
                    <small>Google Pay, PhonePe, Paytm or any UPI app · {inr(total)}</small>
                  </span>
                </label>
              ) : null}
              <label className="co-opt">
                <input type="radio" name="pay" value="whatsapp" checked={pay === "whatsapp" || !CONFIG.upi} onChange={() => setPay("whatsapp")} />
                <span>
                  <b>Pay after confirmation</b>
                  <small>We confirm your order and share payment details on WhatsApp</small>
                </span>
              </label>
            </fieldset>
            <div className="co-sum">
              <div className="co-when">
                <span>Delivery</span>
                <span>{dateText || "Choose a date and slot"}</span>
              </div>
              {lines.map(({ p, q }) => (
                <div key={p.id}>
                  <span>{p.name}{p.weight ? ` (${p.weight})` : ""} × {q}</span>
                  <span>{priceText(p, q)}</span>
                </div>
              ))}
            </div>
          </form>
        ) : step === "done" && done ? (
          <div className="checkout co-done">
            <p>
              <b>Thank you!</b> {done.upi ? "Complete the UPI payment in your UPI app, then send us your order on WhatsApp so we can confirm delivery." : "Your order details are ready in WhatsApp. Press send and our team will confirm delivery and payment."}
            </p>
            {done.upi ? (
              <a className="btn btn-solid" href={done.upi}>
                Open UPI app to pay {inr(total)}
              </a>
            ) : null}
            {done.wa ? (
              <a className={`btn ${done.upi ? "btn-outline" : "btn-solid"}`} href={done.wa} target="_blank" rel="noopener">
                {done.upi ? "Send order on WhatsApp" : "Open WhatsApp again"}
              </a>
            ) : null}
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                lines.forEach((l) => set(l.p.id, 0));
                setDone(null);
                setStep("cart");
                closeCart();
              }}
            >
              Done, clear my cart
            </button>
            <button type="button" className="co-back" onClick={() => setStep("cart")}>
              <Icon k="chevL" size={16} /> Back to cart
            </button>
          </div>
        ) : lines.length ? (
          <ul className="cart-list">
            {lines.map(({ p, q }) => (
              <li className="cart-item" key={p.id}>
                <Media src={p.img} label="" alt="" cls="cutout" />
                <div>
                  <Link className="ci-name" href={`/products/${baseId(p.id)}`} onClick={closeCart}>
                    {p.name} {p.hi ? <span lang="hi">({p.hi})</span> : null}
                  </Link>
                  <div className="ci-meta">
                    {p.weight ? `${p.weight} · ` : ""}{priceText(p)}
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
                  {priceText(p, q)}
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
              {/* Motion: small bobbing bowl */}
              <svg className="empty-bowl" viewBox="0 0 64 48" width="64" height="48" aria-hidden="true">
                <path d="M22 18c-2-7 3-12 9-10 2-6 10-6 12 0 6-1 9 5 6 10z" fill="#7CC24A" />
                <path d="M30 17c0-5 3-8 7-9" stroke="#4B781E" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M6 20h52c0 14-11 24-26 24S6 34 6 20z" fill="#F1F8EA" stroke="#4B781E" strokeWidth="2.4" />
              </svg>
              <p>Your cart is empty.</p>
              <Link className="btn btn-solid btn-sm" href="/products" data-close-cart onClick={closeCart}>
                Shop fresh greens
              </Link>
            </div>
          </div>
        )}
        <div className="drawer-ft">
          <div className="total">
            <span>Subtotal</span>
            <span>{lines.length && lines.every((l) => l.p.price == null) ? "On request" : inr(total)}</span>
          </div>
          {lines.some((l) => l.p.price == null) ? <small>Prices for some items are on request and will be confirmed with your order.</small> : null}
          {lines.length && step === "cart" ? (
            <>
              <button className="btn btn-solid" type="button" onClick={() => setStep("checkout")}>
                Proceed to Checkout
              </button>
              <small>Enter delivery details and choose how to pay.</small>
            </>
          ) : null}
          {lines.length && step === "checkout" ? (
            <>
              <button className="btn btn-solid" type="submit" form="checkoutForm" disabled={saving || (!waLink() && !(pay === "upi" && upiOk))}>
                {saving ? "Placing order…" : pay === "upi" && upiOk ? `Pay ${inr(total)} with UPI` : "Place Order"}
              </button>
              <small>{pay === "upi" && upiOk ? "Your UPI app opens with the amount filled in." : "Your order opens in WhatsApp to confirm. Payment details are shared there."}</small>
            </>
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

