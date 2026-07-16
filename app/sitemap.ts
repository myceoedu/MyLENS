import type { MetadataRoute } from "next";

const siteUrl = "https://www.mylensmalaysia.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/videos`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
