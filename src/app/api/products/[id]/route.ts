import { NextRequest, NextResponse } from "next/server";
import { productCategories } from "@/data/products";
import { getCategoryOverrides } from "@/lib/catalog-overrides";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const target = decodeURIComponent(params.id).toLowerCase();
  const overrides = new Map((await getCategoryOverrides()).map(item => [item.category_id, item]));
  for (const category of productCategories) {
    if (overrides.get(category.id)?.visible === false) continue;
    for (const subcategory of category.items) {
      const product = subcategory.products.find(item => item.id.toLowerCase() === target);
      if (product) {
        const related = subcategory.products.filter(item => item.id !== product.id).slice(0, 4);
        return NextResponse.json({
          product, related,
          category: { id: category.id, title: overrides.get(category.id)?.title_zh || category.title, titleEn: overrides.get(category.id)?.title_en || category.titleEn, description: category.description, descriptionEn: category.descriptionEn },
          subcategory: { id: subcategory.id, name: subcategory.name, nameEn: subcategory.nameEn },
        }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
      }
    }
  }
  return NextResponse.json({ error: "Product not found." }, { status: 404 });
}
