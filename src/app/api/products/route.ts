import { NextRequest, NextResponse } from "next/server";
import { productCategories } from "@/data/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const catalog = productCategories.flatMap(category => category.items.flatMap(subcategory => subcategory.products.map(product => ({
  ...product,
  catId: category.id,
  catTitle: category.title,
  catTitleEn: category.titleEn,
  subId: subcategory.id,
  subName: subcategory.name,
  subNameEn: subcategory.nameEn,
}))));

const metadata = productCategories.map(category => ({
  id: category.id, title: category.title, titleEn: category.titleEn,
  count: category.items.reduce((total, item) => total + item.products.length, 0),
  items: category.items.map(item => ({ id: item.id, name: item.name, nameEn: item.nameEn, count: item.products.length })),
}));

function rank(item: typeof catalog[number], query: string) {
  const id = item.id.toLowerCase();
  const name = (item.name || "").toLowerCase();
  const nameEn = (item.nameEn || "").toLowerCase();
  if (id === query) return 0;
  if (id.startsWith(query)) return 1;
  if (name === query || nameEn === query) return 2;
  if (name.startsWith(query) || nameEn.startsWith(query)) return 3;
  if (id.includes(query)) return 4;
  if (name.includes(query) || nameEn.includes(query)) return 5;
  return 6;
}

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get("mode") === "meta") {
    return NextResponse.json({ categories: metadata, total: catalog.length }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
  }
  const query = (request.nextUrl.searchParams.get("q") || "").trim().toLowerCase().slice(0, 120);
  const category = request.nextUrl.searchParams.get("category") || "";
  const subcategory = request.nextUrl.searchParams.get("sub") || "";
  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
  const limit = Math.min(60, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 24));

  let items = catalog;
  if (category && category !== "all") items = items.filter(item => item.catId === category);
  if (subcategory && subcategory !== "all") items = items.filter(item => item.subId === subcategory);
  if (query) {
    items = items.filter(item => {
      const haystack = [item.id, item.name, item.nameEn, item.description, item.descriptionEn, ...(item.tags || []), ...(item.tagsEn || [])].join(" ").toLowerCase();
      return haystack.includes(query);
    }).sort((a, b) => rank(a, query) - rank(b, query) || a.id.localeCompare(b.id));
  }
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  const result = items.slice(start, start + limit).map(item => ({
    id: item.id, name: item.name, nameEn: item.nameEn, description: item.description,
    descriptionEn: item.descriptionEn, tags: item.tags, tagsEn: item.tagsEn,
    applications: item.applications, applicationsEn: item.applicationsEn,
    catId: item.catId, catTitle: item.catTitle, catTitleEn: item.catTitleEn,
    subId: item.subId, subName: item.subName, subNameEn: item.subNameEn,
  }));
  return NextResponse.json({ items: result, total, page: safePage, totalPages }, { headers: { "Cache-Control": query ? "no-store" : "public, s-maxage=300, stale-while-revalidate=3600" } });
}
