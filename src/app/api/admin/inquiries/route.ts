import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseRequest } from "@/lib/supabase-rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: NextRequest) {
  const expected = process.env.ADMIN_ACCESS_KEY;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  if (!expected || !supplied) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(supplied);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "WWW-Authenticate": "Bearer" } });
  }

  const status = request.nextUrl.searchParams.get("status") || "";
  const search = request.nextUrl.searchParams.get("q")?.trim().slice(0, 100) || "";
  const limit = Math.min(200, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 100));
  const filters = [
    "select=id,inquiry_number,product_id,product_name,quantity,currency,inquiry_type,message,status,locale,timezone,page_url,created_at,updated_at,leads(id,email,full_name,company,phone,country,consent_marketing,created_at)",
    "order=created_at.desc",
    `limit=${limit}`,
  ];
  if (["new", "qualified", "quoted", "won", "lost", "archived"].includes(status)) filters.push(`status=eq.${status}`);
  if (search) {
    const safe = search.replace(/[,%()]/g, "");
    filters.push(`or=(inquiry_number.ilike.*${safe}*,product_id.ilike.*${safe}*,product_name.ilike.*${safe}*)`);
  }

  try {
    const data = await supabaseRequest(`inquiries?${filters.join("&")}`);
    return NextResponse.json({ data }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof Error && error.message === "SUPABASE_NOT_CONFIGURED") {
      return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
    }
    return NextResponse.json({ error: "Unable to load inquiries." }, { status: 502 });
  }
}

