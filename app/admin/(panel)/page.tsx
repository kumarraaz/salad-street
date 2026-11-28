import Link from "next/link";
import { inr } from "@/lib/data";
import { readStore } from "@/lib/store";

export const metadata = { title: "Dashboard" };

const fmt = (iso: string) => new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });

export default async function Dashboard() {
  const s = await readStore();
  const by = (st: string) => s.orders.filter((o) => o.status === st);
  const delivered = by("delivered");
  const unitsDelivered = delivered.reduce((n, o) => n + o.lines.reduce((m, l) => m + l.q, 0), 0);
  const revenue = delivered.reduce((n, o) => n + o.total, 0);
  const out = s.products.filter((p) => p.inStock === false).length;

  // Units delivered per product
  const perProduct = new Map<string, { name: string; q: number }>();
  for (const o of delivered)
    for (const l of o.lines) {
      const k = `${l.name} ${l.weight}`;
      const v = perProduct.get(k) || { name: k, q: 0 };
      v.q += l.q;
      perProduct.set(k, v);
    }
  const top = [...perProduct.values()].sort((a, b) => b.q - a.q);

  const stats = [
    { label: "Total orders", value: s.orders.length },
    { label: "New orders", value: by("new").length, href: "/admin/orders?status=new" },
    { label: "Confirmed", value: by("confirmed").length },
    { label: "Delivered orders", value: delivered.length },
    { label: "Items delivered", value: unitsDelivered },
    { label: "Delivered sales", value: inr(revenue) },
    { label: "Cancelled", value: by("cancelled").length },
    { label: "Products (out of stock)", value: `${s.products.length} (${out})`, href: "/admin/products" },
    { label: "Open notify requests", value: s.notify.filter((n) => !n.done).length, href: "/admin/notify" },
  ];

  return (
    <>
      <h1 className="adm-h1">Dashboard</h1>
      <div className="adm-stats">
        {stats.map((x) =>
          x.href ? (
            <Link key={x.label} className="adm-stat" href={x.href}>
              <span>{x.label}</span>
              <b>{x.value}</b>
            </Link>
          ) : (
            <div key={x.label} className="adm-stat">
              <span>{x.label}</span>
              <b>{x.value}</b>
            </div>
          ),
        )}
      </div>

      <div className="adm-grid2">
        <section className="adm-card">
          <h2>Recent orders</h2>
          {s.orders.length ? (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Delivery</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {s.orders.slice(0, 8).map((o) => (
                  <tr key={o.id}>
                    <td>
                      <b>{o.id}</b>
                      <small>{fmt(o.createdAt)}</small>
                    </td>
                    <td>{o.customer.name}</td>
                    <td>
                      {o.delivery.date} · {o.delivery.slot}
                    </td>
                    <td>{inr(o.total)}</td>
                    <td>
                      <span className={`adm-status s-${o.status}`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="adm-note">No orders yet. Orders placed on the website appear here.</p>
          )}
          <Link className="adm-link" href="/admin/orders">
            All orders →
          </Link>
        </section>
        <section className="adm-card">
          <h2>Items delivered by product</h2>
          {top.length ? (
            <table className="adm-table">
              <tbody>
                {top.map((t) => (
                  <tr key={t.name}>
                    <td>{t.name}</td>
                    <td className="r">
                      <b>{t.q}</b>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="adm-note">Mark orders as Delivered to see the counts here.</p>
          )}
        </section>
      </div>
    </>
  );
}
