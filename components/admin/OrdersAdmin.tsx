"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { inr } from "@/lib/data";
import type { Order, OrderStatus, WaClick } from "@/lib/store";
import { Icon } from "../ui";

const STATUSES: OrderStatus[] = ["new", "confirmed", "delivered", "cancelled"];
const LABEL: Record<OrderStatus, string> = { new: "New", confirmed: "Confirmed", delivered: "Delivered", cancelled: "Cancelled" };
const fmt = (iso: string) => new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
/** wa.me needs digits with country code; Indian 10-digit numbers get 91. */
export const waNumber = (phone: string) => {
  const d = phone.replace(/\D/g, "");
  return d.length === 10 ? `91${d}` : d;
};

export default function OrdersAdmin({ orders, waClicks, initial }: { orders: Order[]; waClicks: WaClick[]; initial: string }) {
  const router = useRouter();
  const [filter, setFilter] = useState(initial);
  const [msg, setMsg] = useState("");
  const list = filter === "all" ? orders : filter === "whatsapp" ? [] : orders.filter((o) => o.status === filter);

  const setStatus = async (o: Order, status: OrderStatus) => {
    const r = await fetch(`/api/admin/orders/${encodeURIComponent(o.id)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }).catch(() => null);
    if (r?.status === 401) window.location.href = "/admin/login";
    setMsg(r?.ok ? `Order ${o.id} marked ${LABEL[status]}.` : "Could not update the order.");
    router.refresh();
  };

  return (
    <>
      <h1 className="adm-h1">
        <Icon k="cart" size={24} /> Orders
      </h1>
      <div className="adm-tabs" role="tablist" aria-label="Filter orders">
        {["all", ...STATUSES].map((s) => (
          <button key={s} type="button" role="tab" aria-selected={filter === s} onClick={() => setFilter(s)}>
            {s === "all" ? "All" : LABEL[s as OrderStatus]} ({s === "all" ? orders.length : orders.filter((o) => o.status === s).length})
          </button>
        ))}
        <button type="button" role="tab" aria-selected={filter === "whatsapp"} onClick={() => setFilter("whatsapp")}>
          WhatsApp taps ({waClicks.length})
        </button>
      </div>
      {msg ? (
        <p className="adm-msg" role="status">
          {msg}
        </p>
      ) : null}
      {filter === "whatsapp" ? (
        <div className="adm-card">
          <p className="adm-sub">
            Customers who tapped a “WhatsApp” order button on the website. The order itself is chatted on your WhatsApp, so only the product and time are recorded here.
          </p>
          {waClicks.length ? (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Product</th>
                  <th>From</th>
                </tr>
              </thead>
              <tbody>
                {waClicks.map((w) => (
                  <tr key={w.id}>
                    <td>{fmt(w.createdAt)}</td>
                    <td>{w.productName || "General order (no product chosen)"}</td>
                    <td>{w.source === "bar" ? "Mobile “Order on WhatsApp” bar" : "Product card"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="adm-note">No WhatsApp taps yet.</p>
          )}
        </div>
      ) : list.length ? (
        <div className="adm-orders">
          {list.map((o) => (
            <article className="adm-card adm-order" key={o.id}>
              <header>
                <div>
                  <b>{o.id}</b> <span className={`adm-status s-${o.status}`}>{LABEL[o.status]}</span>
                  <small>Placed {fmt(o.createdAt)}</small>
                </div>
                <label className="adm-inline">
                  Status
                  <select value={o.status} onChange={(e) => setStatus(o, e.target.value as OrderStatus)}>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {LABEL[s]}
                      </option>
                    ))}
                  </select>
                </label>
              </header>
              <div className="adm-ocols">
                <div>
                  <span className="adm-lbl">Customer</span>
                  <p>
                    <b>{o.customer.name}</b>
                    <br />
                    <a href={`tel:${o.customer.phone}`}>{o.customer.phone}</a> ·{" "}
                    <a href={`https://wa.me/${waNumber(o.customer.phone)}`} target="_blank" rel="noopener">
                      WhatsApp
                    </a>
                    <br />
                    {o.customer.address}
                    {o.customer.pin ? ` - ${o.customer.pin}` : ""}
                    {o.customer.note ? (
                      <>
                        <br />
                        <i>Note: {o.customer.note}</i>
                      </>
                    ) : null}
                  </p>
                </div>
                <div>
                  <span className="adm-lbl">Delivery</span>
                  <p>
                    {o.delivery.date} · {o.delivery.slot}
                    {o.delivery.charge ? (
                      <>
                        <br />
                        <b>{o.delivery.charge}</b>
                      </>
                    ) : null}
                    <br />
                    <small>{o.payment}</small>
                  </p>
                </div>
                <div>
                  <span className="adm-lbl">Items</span>
                  <ul className="adm-lines">
                    {o.lines.map((l, i) => (
                      <li key={i}>
                        <span>
                          {l.name} {l.weight ? `(${l.weight})` : ""} × {l.q}
                        </span>
                        <span>{inr(l.price * l.q)}</span>
                      </li>
                    ))}
                    <li className="t">
                      <span>Total</span>
                      <span>{inr(o.total)}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="adm-card adm-note">No orders here yet. Orders placed through the website checkout appear in this list.</p>
      )}
    </>
  );
}
