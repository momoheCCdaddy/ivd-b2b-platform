import type { MetadataRoute } from "next";
import { productCategories } from "@/data/products";
import { getCategoryOverrides } from "@/lib/catalog-overrides";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ivd-b2b-platform.vercel.app";
  const catalogUpdatedAt = new Date("2026-07-16T00:00:00.000Z");
  const overrides = new Map((await getCategoryOverrides()).map(item => [item.category_id, item]));
  const routes = ["", "/products", "/services", "/tech-center", "/quality", "/about", "/contact", "/faq", "/news", "/privacy"];
  const pages: MetadataRoute.Sitemap = routes.map((route, index) => ({
    url: `${baseUrl}${route}`,
    lastModified: catalogUpdatedAt,
    changeFrequency: index < 2 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : index === 1 ? 0.9 : 0.7,
  }));
  const products: MetadataRoute.Sitemap = productCategories.filter(category => overrides.get(category.id)?.visible !== false).flatMap(category =>
    category.items.flatMap(subcategory => subcategory.products.map(product => ({
      url: `${baseUrl}/products/${encodeURIComponent(product.id)}`,
      lastModified: catalogUpdatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))),
  );
  return [...pages, ...products];
}
