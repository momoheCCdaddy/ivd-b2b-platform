import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ivd-b2b-platform.vercel.app";
  const routes = ["", "/products", "/services", "/tech-center", "/quality", "/about", "/contact", "/faq", "/privacy"];
  return routes.map((route, index) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: index < 2 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : index === 1 ? 0.9 : 0.7,
  }));
}
