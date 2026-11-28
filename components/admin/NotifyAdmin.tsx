"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { NotifyReq } from "@/lib/store";
import { waNumber } from "./OrdersAdmin";

const fmt = (iso: string) => new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });

/** Customers who pressed "Notify" on an out-of-stock product. Message them on WhatsApp when it's back. */
export default function NotifyAdmin({ list }: { list: NotifyReq[] }) {
  const router = useRouter();
  const [showDone, setShowDone] = useState(false);
  const rows = list.filter((n) => showDone || !n.done);

  const call = async (n: NotifyReq, method: "PATCH" | "DELETE", body?: unknown) => {
    const r = await fetch(`/api/admin/notify/${encodeURIComponent(n.id)}`, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined }).catch(() => null);
    if (r?.status === 401) window.location.href = "/admin/login";
    router.refresh();
  };

  return (
    <>
      <div className="adm-head">
        <h1 className="adm-h1">Notify requests</h1>
        <label className="adm-check">
          <input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} /> Show completed
        </label>
      </div>
      <div className="adm-card">
        {rows.length ? (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Customer</th>
                <th className="r">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((n) => (
                <tr key={n.id} className={n.done ? "is-out" : ""}>
                  <td>{fmt(n.createdAt)}</td>
                  <td>
                    <b>{n.productName}</b>
                  </td>
                  <td>
                    {n.name}
                    <small>
                      <a href={`tel:${n.phone}`}>{n.phone}</a>
                    </small>
                  </td>
                  <td className="r">
                    <a
                      className="adm-btn primary"
                      href={`https://wa.me/${waNumber(n.phone)}?text=${encodeURIComponent(`Hi ${n.name}, good news! ${n.productName} is back in stock at Salad Street. Order here: https://www.saladstreet.in/products`)}`}
                      target="_blank"
                      rel="noopener"
                    >
                      WhatsApp customer
                    </a>{" "}
                    <button className="adm-btn ghost" type="button" onClick={() => call(n, "PATCH", { done: !n.done })}>
                      {n.done ? "Reopen" : "Mark done"}
                    </button>{" "}
                    <button className="adm-btn ghost danger-t" type="button" onClick={() => call(n, "DELETE")}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="adm-note">No open requests. When a customer presses “Notify” on an out-of-stock product, it shows up here.</p>
        )}
      </div>
    </>
  );
}
