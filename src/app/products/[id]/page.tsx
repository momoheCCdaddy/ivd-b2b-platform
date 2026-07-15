import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import { productCategories } from "@/data/products";

function findProduct(id: string) {
  const needle = decodeURIComponent(id).toLowerCase();
  for (const category of productCategories) for (const subcategory of category.items) {
    const product = subcategory.products.find(item => item.id.toLowerCase() === needle);
    if (product) return { product, related: subcategory.products.filter(item => item.id !== product.id).slice(0, 4), category: { id: category.id, title: category.title, titleEn: category.titleEn, description: category.description, descriptionEn: category.descriptionEn } };
  }
  return null;
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const found = findProduct(params.id);
  if (!found) return { title: "Product Not Found", robots: { index: false, follow: true } };
  const name = found.product.nameEn || found.product.name;
  const description = (found.product.descriptionEn || found.product.description || `Technical information and quotation for ${found.product.id}.`).slice(0, 160);
  return {
    title: `${found.product.id} | ${name}`,
    description,
    alternates: { canonical: `/products/${encodeURIComponent(found.product.id)}` },
    openGraph: { type: "website", title: `${found.product.id} | ${name}`, description, url: `/products/${encodeURIComponent(found.product.id)}` },
  };
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const found = findProduct(params.id);
  if (!found) notFound();
  return <ProductDetailClient product={found.product} related={found.related} category={found.category} />;
}
