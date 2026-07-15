import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { productCategories } from "@/data/products";
import { clearCategoryOverrideCache, getCategoryOverrides } from "@/lib/catalog-overrides";
import { supabaseRequest } from "@/lib/supabase-rest";

export const runtime = "nodejs"; export const dynamic = "force-dynamic";
function authorized(request: NextRequest) { const expected = process.env.ADMIN_ACCESS_KEY; const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || ""; if (!expected || !supplied) return false; const a = Buffer.from(expected); const b = Buffer.from(supplied); return a.length === b.length && timingSafeEqual(a, b); }

export async function GET(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const overrides = new Map((await getCategoryOverrides()).map(item => [item.category_id, item]));
  const data = productCategories.map((category, index) => {
    const override = overrides.get(category.id);
    return { categoryId: category.id, defaultTitleEn: category.titleEn, defaultTitleZh: category.title, titleEn: override?.title_en || category.titleEn, titleZh: override?.title_zh || category.title, visible: override?.visible ?? true, sortOrder: override?.sort_order ?? (index + 1) * 10, count: category.items.reduce((sum, item) => sum + item.products.length, 0) };
  }).sort((a, b) => a.sortOrder - b.sortOrder);
  return NextResponse.json({ data }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null) as { categoryId?: string; titleEn?: string; titleZh?: string; visible?: boolean; sortOrder?: number } | null;
  if (!body?.categoryId || !productCategories.some(category => category.id === body.categoryId)) return NextResponse.json({ error: "Invalid category." }, { status: 422 });
  const record = { category_id: body.categoryId, title_en: String(body.titleEn || "").trim().slice(0, 160) || null, title_zh: String(body.titleZh || "").trim().slice(0, 160) || null, visible: body.visible !== false, sort_order: Math.max(0, Math.min(10000, Number(body.sortOrder) || 100)), updated_at: new Date().toISOString() };
  try {
    await supabaseRequest("catalog_category_overrides?on_conflict=category_id", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify(record) });
    clearCategoryOverrideCache(); return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "SUPABASE_NOT_CONFIGURED") return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
    return NextResponse.json({ error: "Unable to save category settings." }, { status: 502 });
  }
}

