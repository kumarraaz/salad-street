import type { MetadataRoute } from "next";
import { CONFIG } from "@/lib/data";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/account", "/wishlist"] },
    sitemap: `${CONFIG.siteUrl}/sitemap.xml`,
    host: CONFIG.siteUrl,
  };
}
