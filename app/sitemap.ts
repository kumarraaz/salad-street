import type { MetadataRoute } from "next";
import { BLOGS, CONFIG, REVIEWS } from "@/lib/data";
import { getProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const PRODUCTS = await getProducts();
  const base = CONFIG.siteUrl;
  const pages = ["", "/about", "/products", "/categories", "/highlights", "/recipes", "/blog", "/faqs", "/contact", "/terms", "/privacy", "/refund"];
  if (REVIEWS.length) pages.push("/reviews");
  return [
    ...pages.map((p) => ({ url: `${base}${p || "/"}`, changeFrequency: "weekly" as const, priority: p ? 0.7 : 1 })),
    ...PRODUCTS.map((p) => ({ url: `${base}/products/${p.id}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...BLOGS.map((b) => ({ url: `${base}/blog/${b.slug}`, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
