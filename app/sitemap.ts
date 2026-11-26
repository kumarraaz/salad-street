import type { MetadataRoute } from "next";
import { BLOGS, CONFIG, PRODUCTS, REVIEWS } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = CONFIG.siteUrl;
  const pages = ["", "/about", "/products", "/categories", "/highlights", "/blog", "/faqs", "/contact", "/terms", "/privacy", "/refund"];
  if (REVIEWS.length) pages.push("/reviews");
  return [
    ...pages.map((p) => ({ url: `${base}${p || "/"}`, changeFrequency: "weekly" as const, priority: p ? 0.7 : 1 })),
    ...PRODUCTS.map((p) => ({ url: `${base}/products/${p.id}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...BLOGS.map((b) => ({ url: `${base}/blog/${b.slug}`, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
