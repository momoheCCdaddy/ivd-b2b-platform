import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { jsonRequestError, readJsonRequest } from "@/lib/request-guard";
import { supabaseRequest } from "@/lib/supabase-rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = ["draft", "sent", "accepted", "expired", "cancelled"];
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function authorized(request: NextRequest) {
  const expected = process.env.ADMIN_ACCESS_KEY;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  if (!expected || !supplied) return false;
  const expectedBytes = Buffer.from(expected);
  const suppliedBytes = Buffer.from(supplied);
  return expectedBytes.length === suppliedBytes.length && timingSafeEqual(expectedBytes, suppliedBytes);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!UUID_PATTERN.test(params.id)) return NextResponse.json({ error: "Invalid quote ID." }, { status: 422 });

  let body: { status?: string };
  try {
    body = await readJsonRequest<{ status?: string }>(request, 2_048);
  } catch (error) {
    return jsonRequestError(error);
  }
  if (!body.status || !ALLOWED_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Invalid quote status." }, { status: 422 });
  }

  try {
    const rows = await supabaseRequest(`quotes?id=eq.${encodeURIComponent(params.id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ status: body.status, updated_at: new Date().toISOString() }),
    }) as Array<{ id: string; status: string; updated_at: string }>;
    if (!rows?.[0]) return NextResponse.json({ error: "Quote not found." }, { status: 404 });
    return NextResponse.json({ ok: true, data: rows[0] }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof Error && error.message === "SUPABASE_NOT_CONFIGURED") {
      return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
    }
    return NextResponse.json({ error: "Unable to update quote." }, { status: 502 });
  }
}
