import { clientIp, rateLimit, sameOrigin } from "@/lib/auth";
import { bad, json, phoneOk, str } from "@/lib/api";
import { getProducts, newId, writeStore } from "@/lib/store";

/** Customer asks to be told when an out-of-stock product is back. Saved for the admin "Notify requests" list. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return bad("Forbidden", 403);
  if (!rateLimit("notify:" + clientIp(req), 10, 10 * 60_000)) return bad("Too many requests, please try again later.", 429);
  const b = await req.json().catch(() => ({}));
  const name = str(b.name, 80);
  const phone = str(b.phone, 20);
  const productId = str(b.productId, 80);
  if (!name || !phoneOk(phone)) return bad("Please enter your name and a valid mobile number.");
  const p = (await getProducts()).find((x) => x.id === productId);
  if (!p) return bad("Product not found.", 404);
  const r = await writeStore((s) => {
    const item = { id: newId("N"), createdAt: new Date().toISOString(), productId: p.id, productName: p.name, name, phone, done: false };
    s.notify.unshift(item);
    return item;
  });
  return json({ ok: true, id: r.id });
}
