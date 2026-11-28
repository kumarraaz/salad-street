"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { inr } from "@/lib/data";
import type { Order, OrderStatus } from "@/lib/store";

const STATUSES: OrderStatus[] = ["new", "confirmed", "delivered", "cancelled"];
const LABEL: Record<OrderStatus, string> = { new: "New", confirmed: "Confirmed", delivered: "Delivered", cancelled: "Cancelled" };
const fmt = (iso: string) => new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
/** wa.me needs digits with country code; Indian 10-digit numbers get 91. */
export const waNumber = (phone: string) => {
  const d = phone.replace(/\D/g, "");
  return d.length === 10 ? `91${d}` : d;
};

export default function OrdersAdmin({ orders, initial }: { orders: Order[]; initial: string }) {
  const router = useRouter();
  const [filter, setFilter] = useState(initial);
  const [msg, setMsg] = useState("");
  const list = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const setStatus = async (o: Order, status: OrderStatus) => {
    const r = await fetch(`/api/admin/orders/${encodeURIComponent(o.id)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }).catch(() => null);
    if (r?.status === 401) window.location.href = "/admin/login";
    setMsg(r?.ok ? `Order ${o.id} marked ${LABEL[status]}.` : "Could not update the order.");
    router.refresh();
  };

  return (
    <>
      <h1 className="adm-h1">Orders</h1>
      <div className="adm-tabs" role="tablist" aria-label="Filter orders">
        {["all", ...STATUSES].map((s) => (
          <button key={s} type="button" role="tab" aria-selected={filter === s} onClick={() => setFilter(s)}>
            {s === "all" ? "All" : LABEL[s as OrderStatus]} ({s === "all" ? orders.length : orders.filter((o) => o.status === s).length})
          </button>
        ))}
      </div>
      {msg ? (
        <p className="adm-msg" role="status">
          {msg}
        </p>
      ) : null}
      {list.length ? (
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
