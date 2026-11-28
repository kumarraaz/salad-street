import { bad, guard, json, refreshSite } from "@/lib/api";
import { productFromBody } from "@/lib/productInput";
import { slugify, writeStore } from "@/lib/store";

/** Add a product. */
export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const p = productFromBody(await req.json().catch(() => ({})));
  if (typeof p === "string") return bad(p);
  const saved = await writeStore((s) => {
    let id = slugify(p.name);
    for (let n = 2; s.products.some((x) => x.id === id); n++) id = `${slugify(p.name)}-${n}`;
    const item = { ...p, id };
    s.products.push(item);
    return item;
  });
  refreshSite();
  return json({ ok: true, product: saved });
}
