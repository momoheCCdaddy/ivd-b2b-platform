import { NextRequest, NextResponse } from "next/server";
import { calculateQuote } from "@/lib/quote-pricing";
import { supabaseInsert } from "@/lib/supabase-rest";

export const runtime = "nodejs";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value: unknown, max = 500) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  if (body.website) return NextResponse.json({ ok: true });
  const fullName = clean(body.fullName, 120);
  const email = clean(body.email, 254).toLowerCase();
  const company = clean(body.company, 180);
  const country = clean(body.country, 100);
  const productId = clean(body.productId, 120);
  const notes = clean(body.notes, 2000);
  if (!fullName || !EMAIL_PATTERN.test(email) || !productId || body.consentPrivacy !== true) {
    return NextResponse.json({ error: "Name, business email, product and privacy consent are required." }, { status: 422 });
  }

  let calculated;
  try { calculated = calculateQuote(productId, Number(body.quantity), clean(body.currency, 3)); }
  catch (error) {
    const code = error instanceof Error ? error.message : "QUOTE_ERROR";
    return NextResponse.json({ error: code === "PRICE_NOT_AVAILABLE" ? "This product requires a manual quotation." : code === "FX_RATE_NOT_CONFIGURED" ? "The selected currency is not configured." : "Unable to calculate this quote." }, { status: code === "PRODUCT_NOT_FOUND" ? 404 : 422 });
  }

  const quoteNumber = `QT-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  try {
    const leads = await supabaseInsert("leads", {
      full_name: fullName, email, company: company || null, country: country || null,
      preferred_language: clean(body.locale, 10) || "en", consent_privacy: true,
      consent_marketing: Boolean(body.consentMarketing), source: "instant_quote",
    }, true) as Array<{ id: string }>;
    const leadId = leads?.[0]?.id;
    if (!leadId) throw new Error("LEAD_ID_MISSING");

    const quotes = await supabaseInsert("quotes", {
      quote_number: quoteNumber, lead_id: leadId, currency: calculated.currency,
      exchange_rate: calculated.exchangeRate, subtotal: calculated.subtotal,
      discount_rate: calculated.discountRate, discount_amount: calculated.discountAmount,
      total: calculated.total, valid_until: calculated.validUntil, notes: notes || null, status: "sent",
    }, true) as Array<{ id: string; public_token: string }>;
    const saved = quotes?.[0];
    if (!saved?.id || !saved.public_token) throw new Error("QUOTE_ID_MISSING");

    await supabaseInsert("quote_items", {
      quote_id: saved.id, product_id: calculated.product.id,
      product_name: calculated.product.nameEn || calculated.product.name,
      quantity: calculated.quantity, unit_price: calculated.unitPrice,
      line_total: calculated.subtotal, source_unit_price_cny: calculated.sourceUnitPriceCny,
    });

    return NextResponse.json({
      ok: true, quoteNumber, total: calculated.total, currency: calculated.currency,
      validUntil: calculated.validUntil, pdfUrl: `/api/quotes/${encodeURIComponent(quoteNumber)}/pdf?token=${encodeURIComponent(saved.public_token)}`,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "SUPABASE_NOT_CONFIGURED") return NextResponse.json({ error: "Quote storage is not configured yet." }, { status: 503 });
    return NextResponse.json({ error: "Unable to save this quote. Please request a manual quotation." }, { status: 502 });
  }
}

