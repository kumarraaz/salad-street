import { clientIp, rateLimit, sameOrigin } from "@/lib/auth";
import { bad, json, str } from "@/lib/api";
import { getProducts, newId, writeStore } from "@/lib/store";

/** Records a tap on a "WhatsApp" order button so the admin can see it (the order itself is chatted on WhatsApp). */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return bad("Forbidden", 403);
  if (!rateLimit("wa:" + clientIp(req), 20, 10 * 60_000)) return json({ ok: true }); // quietly ignore floods
  const raw = await req.text().catch(() => "");
  let b: Record<string, string> = {};
  try {
    b = JSON.parse(raw || "{}");
  } catch {
    /* ignore bad bodies */
  }
  const source = ["card", "bar"].includes(b.source) ? b.source : "card";
  const productId = str(b.productId, 100);
  const p = productId ? (await getProducts()).find((x) => x.id === productId.split("~")[0]) : undefined;
  await writeStore((s) => {
    s.waClicks.unshift({ id: newId("W"), createdAt: new Date().toISOString(), source, productId: p?.id || "", productName: p ? `${p.name}${b.weight ? ` ${str(b.weight, 20)}` : ""}` : "" });
    if (s.waClicks.length > 500) s.waClicks.length = 500;
  });
  return json({ ok: true });
}
