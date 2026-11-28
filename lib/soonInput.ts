/* SERVER-ONLY: clean a "Coming Soon" product from the admin form. */
import type { SoonItem } from "./data";
import { str } from "./api";

export function soonFromBody(b: Record<string, unknown>): SoonItem | string {
  const name = str(b.name, 80);
  if (!name) return "Product name is required.";
  const img = str(b.img, 300);
  if (!/^\/(images|api\/uploads)\/[\w\-./]+$/.test(img) || img.includes("..")) return "Upload a product photo.";
  return { name, weight: str(b.weight, 20) || undefined, img };
}
