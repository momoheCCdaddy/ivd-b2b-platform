import { NextResponse } from "next/server";
import { supabaseRequest } from "@/lib/supabase-rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requiredTables = ["leads", "inquiries", "quotes", "quote_items", "catalog_category_overrides"];

export async function GET() {
  const configured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  let database: "ready" | "unconfigured" | "unavailable" = configured ? "unavailable" : "unconfigured";
  if (configured) {
    try {
      await Promise.all(requiredTables.map(table => supabaseRequest(`${table}?select=*&limit=0`)));
      database = "ready";
    } catch {
      database = "unavailable";
    }
  }

  return NextResponse.json({
    status: database === "ready" ? "ok" : "degraded",
    services: {
      catalog: "ready",
      database,
      adminAccess: process.env.ADMIN_ACCESS_KEY ? "configured" : "unconfigured",
    },
    deployment: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "local",
    checkedAt: new Date().toISOString(),
  }, { headers: { "Cache-Control": "no-store" } });
}
