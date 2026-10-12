import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/seo";

/** Every search engine may index the site, except the API. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
