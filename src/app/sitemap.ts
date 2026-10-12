import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { gallery } from "@/content/gallery";
import { SITE_URL } from "@/content/seo";

/** Every page, for Google and Bing. Built from the content files, so new projects are listed automatically. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/resume`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...(gallery.length > 0
      ? [{ url: `${SITE_URL}/gallery`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 }]
      : []),
    ...projects.map((p) => ({
      url: `${SITE_URL}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
