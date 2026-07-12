import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type InquiryPayload = {
  fullName?: string;
  email?: string;
  company?: string;
  phone?: string;
  country?: string;
  inquiryType?: string;
  productId?: string;
  productName?: string;
  quantity?: number;
  currency?: string;
  message?: string;
  locale?: string;
  timezone?: string;
  pageUrl?: string;
  consentPrivacy?: boolean;
  consentMarketing?: boolean;
  website?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function supabaseInsert(path: string, body: unknown, returnRecord = false) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_NOT_CONFIGURED");

  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${path}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: returnRecord ? "return=representation" : "return=minimal",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Supabase insert failed", response.status, detail.slice(0, 500));
    throw new Error("SUPABASE_INSERT_FAILED");
  }
  return returnRecord ? response.json() : null;
}

export async function POST(request: NextRequest) {
  let payload: InquiryPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (payload.website) return NextResponse.json({ ok: true });

  const fullName = clean(payload.fullName, 120);
  const email = clean(payload.email, 254).toLowerCase();
  const message = clean(payload.message, 4000);
  const quantity = Math.max(1, Math.min(100000, Number(payload.quantity) || 1));

  if (!fullName || !EMAIL_PATTERN.test(email) || !message || !payload.consentPrivacy) {
    return NextResponse.json(
      { error: "Name, valid email, message and privacy consent are required." },
      { status: 422 },
    );
  }

  const inquiryNumber = `INQ-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

  try {
    const leads = await supabaseInsert("leads", {
      full_name: fullName,
      email,
      company: clean(payload.company, 180) || null,
      phone: clean(payload.phone, 60) || null,
      country: clean(payload.country, 100) || null,
      preferred_language: clean(payload.locale, 10) || "en",
      consent_privacy: true,
      consent_marketing: Boolean(payload.consentMarketing),
      source: "website",
    }, true) as Array<{ id: string }>;

    const leadId = leads?.[0]?.id;
    if (!leadId) throw new Error("LEAD_ID_MISSING");

    await supabaseInsert("inquiries", {
      inquiry_number: inquiryNumber,
      lead_id: leadId,
      product_id: clean(payload.productId, 120) || null,
      product_name: clean(payload.productName, 300) || null,
      quantity,
      currency: ["USD", "EUR", "CNY"].includes(clean(payload.currency, 3)) ? clean(payload.currency, 3) : "USD",
      inquiry_type: clean(payload.inquiryType, 40) || "product",
      message,
      locale: clean(payload.locale, 10) || "en",
      timezone: clean(payload.timezone, 80) || null,
      page_url: clean(payload.pageUrl, 500) || null,
      status: "new",
    });

    return NextResponse.json({ ok: true, inquiryNumber }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "SUPABASE_NOT_CONFIGURED") {
      return NextResponse.json({ error: "Inquiry service is not configured yet." }, { status: 503 });
    }
    return NextResponse.json({ error: "Unable to save your inquiry. Please contact sales@cobioer.com." }, { status: 502 });
  }
}

