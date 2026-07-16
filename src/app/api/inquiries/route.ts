import { NextRequest, NextResponse } from "next/server";
import { supabaseInsert, supabaseUpsert } from "@/lib/supabase-rest";
import { jsonRequestError, rateLimit, readJsonRequest } from "@/lib/request-guard";

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

export async function POST(request: NextRequest) {
  let payload: InquiryPayload;
  try {
    payload = await readJsonRequest<InquiryPayload>(request);
  } catch (error) {
    return jsonRequestError(error);
  }

  if (payload.website) return NextResponse.json({ ok: true });
  const limited = rateLimit(request, "inquiry", 8, 10 * 60 * 1000);
  if (limited) return limited;

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
    const leadPayload: Record<string, unknown> = {
      full_name: fullName,
      email,
      preferred_language: clean(payload.locale, 10) || "en",
      consent_privacy: true,
      source: "website",
    };
    const company = clean(payload.company, 180);
    const phone = clean(payload.phone, 60);
    const country = clean(payload.country, 100);
    if (company) leadPayload.company = company;
    if (phone) leadPayload.phone = phone;
    if (country) leadPayload.country = country;
    if (payload.consentMarketing) leadPayload.consent_marketing = true;

    const leads = await supabaseUpsert("leads", leadPayload, "email_normalized", true) as Array<{ id: string }>;

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
