import { clientIp, rateLimit, sameOrigin } from "@/lib/auth";
import { bad, json, phoneOk, str } from "@/lib/api";
import { cartProduct, inStock } from "@/lib/data";
import { getProducts, newId, writeStore, type OrderLine } from "@/lib/store";

/** Checkout saves the order here (for the admin), then the customer sends it on WhatsApp.
    Prices are taken from the server's product list, never from the browser. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return bad("Forbidden", 403);
  if (!rateLimit("order:" + clientIp(req), 15, 10 * 60_000)) return bad("Too many orders, please try again later.", 429);
  const b = await req.json().catch(() => ({}));
  const c = b.customer || {};
  const customer = { name: str(c.name, 80), phone: str(c.phone, 20), address: str(c.address, 400), pin: str(c.pin, 10), note: str(c.note, 300) };
  if (!customer.name || !phoneOk(customer.phone) || !customer.address) return bad("Please fill in your name, mobile number and address.");
  const delivery = { date: str(b.delivery?.date, 10), slot: str(b.delivery?.slot, 20) };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(delivery.date) || !delivery.slot) return bad("Please choose a delivery date and slot.");

  const products = await getProducts();
  const lines: OrderLine[] = [];
  for (const l of Array.isArray(b.lines) ? b.lines.slice(0, 50) : []) {
    const q = Math.min(99, Math.max(1, Math.floor(Number(l?.q) || 0)));
    const p = cartProduct(str(l?.id, 100), products);
    if (!p || !inStock(p) || p.price == null) continue;
    lines.push({ id: p.id, name: p.name, weight: p.weight, price: p.price, q });
  }
  if (!lines.length) return bad("Your cart is empty or the items are out of stock.");
  const total = lines.reduce((s, l) => s + l.price * l.q, 0);

  const order = await writeStore((s) => {
    const o = {
      id: newId("SS"),
      createdAt: new Date().toISOString(),
      status: "new" as const,
      customer,
      delivery,
      payment: str(b.payment, 60) || "Pay after confirmation",
      lines,
      total,
    };
    s.orders.unshift(o);
    return o;
  });
  return json({ ok: true, id: order.id, total });
}
