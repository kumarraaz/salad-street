/* SERVER-ONLY: turns an admin form body into a clean Product (whitelisted fields, sane limits). */
import type { Product, Variant } from "./data";
import { CATEGORIES } from "./data";
import { str } from "./api";

const img = (v: unknown) => {
  const s = str(v, 300);
  return /^\/(images|api\/uploads)\/[\w\-./]+$/.test(s) && !s.includes("..") ? s : "";
};
const price = (v: unknown) => {
  if (v === "" || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 && n <= 100000 ? Math.round(n * 100) / 100 : null;
};

export function productFromBody(b: Record<string, unknown>, base?: Product): Product | string {
  const name = str(b.name, 80);
  if (!name) return "Product name is required.";
  const cat = str(b.cat, 40);
  if (!CATEGORIES.some((c) => c.id === cat)) return "Choose a category.";
  const pack = img(b.pack);
  const leaf = img(b.img);
  if (!pack && !leaf) return "Upload a product photo.";
  const variants: Variant[] = (Array.isArray(b.variants) ? (b.variants as Record<string, unknown>[]) : [])
    .slice(0, 6)
    .map((v, i) => {
      const vp = img(v.pack);
      return { key: str(v.key, 20) || `v${i + 1}`, weight: str(v.weight, 20), price: price(v.price) ?? 0, ...(vp ? { pack: vp } : {}) };
    })
    .filter((v) => v.weight);
  const badge = b.badge === "Bestseller" || b.badge === "Chef's pick" ? (b.badge as Product["badge"]) : undefined;
  const tint = str(b.tint, 7);
  return {
    ...(base || {}),
    id: base?.id || "",
    name,
    hi: str(b.hi, 60),
    weight: str(b.weight, 20),
    price: price(b.price),
    cat,
    home: true,
    img: leaf || pack,
    pack: pack || undefined,
    note: str(b.note, 160),
    inStock: b.inStock !== false,
    badge,
    tint: /^#[0-9a-fA-F]{6}$/.test(tint) ? tint : base?.tint,
    variants: variants.length ? variants : undefined,
  };
}
