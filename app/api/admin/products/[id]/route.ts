import { bad, guard, json, refreshSite } from "@/lib/api";
import { productFromBody } from "@/lib/productInput";
import { writeStore } from "@/lib/store";

type Ctx = { params: Promise<{ id: string }> };

/** Edit a product (full form), or a quick stock toggle with { inStock } only. */
export async function PUT(req: Request, { params }: Ctx) {
  const denied = guard(req);
  if (denied) return denied;
  const { id } = await params;
  const b = await req.json().catch(() => ({}));
  const res = await writeStore((s) => {
    const i = s.products.findIndex((x) => x.id === id);
    if (i < 0) return "Product not found.";
    if (Object.keys(b).length === 1 && typeof b.inStock === "boolean") {
      s.products[i] = { ...s.products[i], inStock: b.inStock };
      return s.products[i];
    }
    const p = productFromBody(b, s.products[i]);
    if (typeof p === "string") return p;
    s.products[i] = { ...p, id };
    return s.products[i];
  });
  if (typeof res === "string") return bad(res, res === "Product not found." ? 404 : 400);
  refreshSite();
  return json({ ok: true, product: res });
}

export async function DELETE(req: Request, { params }: Ctx) {
  const denied = guard(req);
  if (denied) return denied;
  const { id } = await params;
  const ok = await writeStore((s) => {
    const n = s.products.length;
    s.products = s.products.filter((x) => x.id !== id);
    return s.products.length < n;
  });
  if (!ok) return bad("Product not found.", 404);
  refreshSite();
  return json({ ok: true });
}
