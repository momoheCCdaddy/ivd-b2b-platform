import { NextResponse } from "next/server";
import { supabaseRequest } from "@/lib/supabase-rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requiredChecks = [
  "leads?select=id,email_normalized&limit=0",
  "inquiries?select=id,inquiry_number,lead_id&limit=0",
  "quotes?select=id,quote_number,public_token,lead_id&limit=0",
  "quote_items?select=id,quote_id&limit=0",
  "catalog_category_overrides?select=category_id&limit=0",
];

export async function GET() {
  const configured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  let database: "ready" | "unconfigured" | "unavailable" = configured ? "unavailable" : "unconfigured";
  if (configured) {
    try {
      await Promise.all(requiredChecks.map(path => supabaseRequest(path)));
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
