import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseRequest } from "@/lib/supabase-rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: NextRequest) {
  const expected = process.env.ADMIN_ACCESS_KEY;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  if (!expected || !supplied) return false;
  const a = Buffer.from(expected); const b = Buffer.from(supplied);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = await supabaseRequest("quotes?select=id,quote_number,public_token,currency,subtotal,discount_amount,total,status,valid_until,notes,created_at,updated_at,leads(full_name,email,company,country),quote_items(product_id,product_name,quantity,unit_price,line_total)&order=created_at.desc&limit=200");
    return NextResponse.json({ data }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof Error && error.message === "SUPABASE_NOT_CONFIGURED") return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
    return NextResponse.json({ error: "Unable to load quote history." }, { status: 502 });
  }
}
