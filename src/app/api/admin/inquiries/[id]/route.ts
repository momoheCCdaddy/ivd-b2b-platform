import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseRequest } from "@/lib/supabase-rest";

const ALLOWED = ["new", "qualified", "quoted", "won", "lost", "archived"];

function authorized(request: NextRequest) {
  const expected = process.env.ADMIN_ACCESS_KEY;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  if (!expected || !supplied) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(supplied);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null) as { status?: string } | null;
  if (!body?.status || !ALLOWED.includes(body.status)) return NextResponse.json({ error: "Invalid status" }, { status: 422 });
  try {
    await supabaseRequest(`inquiries?id=eq.${encodeURIComponent(params.id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ status: body.status, updated_at: new Date().toISOString() }),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to update inquiry." }, { status: 502 });
  }
}

