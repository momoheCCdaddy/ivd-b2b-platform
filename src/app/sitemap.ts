import type { MetadataRoute } from "next";
import { productCategories } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ivd-b2b-platform.vercel.app";
  const routes = ["", "/products", "/services", "/tech-center", "/quality", "/about", "/contact", "/faq", "/privacy"];
  const pages: MetadataRoute.Sitemap = routes.map((route, index) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: index < 2 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : index === 1 ? 0.9 : 0.7,
  }));
  const products: MetadataRoute.Sitemap = productCategories.flatMap(category =>
    category.items.flatMap(subcategory => subcategory.products.map(product => ({
      url: `${baseUrl}/products/${encodeURIComponent(product.id)}`,
      lastModified: new Date("2026-07-12"),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))),
  );
  return [...pages, ...products];
}
