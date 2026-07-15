import { supabaseRequest } from "@/lib/supabase-rest";

export type CategoryOverride = { category_id: string; title_en?: string | null; title_zh?: string | null; description_en?: string | null; description_zh?: string | null; visible: boolean; sort_order: number };
let cache: { value: CategoryOverride[]; expires: number } | null = null;

export async function getCategoryOverrides() {
  if (cache && cache.expires > Date.now()) return cache.value;
  try {
    const value = await supabaseRequest("catalog_category_overrides?select=category_id,title_en,title_zh,description_en,description_zh,visible,sort_order&order=sort_order.asc") as CategoryOverride[];
    cache = { value, expires: Date.now() + 60_000 };
    return value;
  } catch {
    return [];
  }
}

export function clearCategoryOverrideCache() { cache = null; }

