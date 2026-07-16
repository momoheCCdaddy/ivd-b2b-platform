import { NextRequest, NextResponse } from "next/server";
import { generateCommercialQuotePdf } from "@/lib/quote-pdf";
import { supabaseRequest } from "@/lib/supabase-rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type QuoteRow = {
  quote_number: string;
  currency: string;
  subtotal: number;
  discount_amount: number;
  total: number;
  valid_until: string;
  created_at: string;
  notes?: string;
  leads: { full_name: string; email: string; company?: string; country?: string } | Array<{ full_name: string; email: string; company?: string; country?: string }>;
  quote_items: Array<{ product_id: string; product_name: string; quantity: number; unit_price: number; line_total: number }>;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest, { params }: { params: { number: string } }) {
  const token = request.nextUrl.searchParams.get("token") || "";
  if (!UUID_PATTERN.test(token)) return NextResponse.json({ error: "Invalid quote link." }, { status: 401 });

  try {
    const query = new URLSearchParams({
      select: "quote_number,currency,subtotal,discount_amount,total,valid_until,created_at,notes,leads(full_name,email,company,country),quote_items(product_id,product_name,quantity,unit_price,line_total)",
      quote_number: `eq.${params.number}`,
      public_token: `eq.${token}`,
      limit: "1",
    });
    const rows = await supabaseRequest(`quotes?${query}`) as QuoteRow[];
    const quote = rows?.[0];
    if (!quote) return NextResponse.json({ error: "Quote not found." }, { status: 404 });
    const lead = Array.isArray(quote.leads) ? quote.leads[0] : quote.leads;

    const bytes = await generateCommercialQuotePdf({
      quoteNumber: quote.quote_number,
      currency: quote.currency,
      subtotal: quote.subtotal,
      discountAmount: quote.discount_amount,
      total: quote.total,
      validUntil: quote.valid_until,
      createdAt: quote.created_at,
      notes: quote.notes,
      lead: {
        fullName: lead?.full_name || "Customer",
        email: lead?.email || "",
        company: lead?.company,
        country: lead?.country,
      },
      items: quote.quote_items.map(item => ({
        productId: item.product_id,
        productName: item.product_name,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        lineTotal: item.line_total,
      })),
    });
    const filename = quote.quote_number.replace(/[^A-Za-z0-9._-]/g, "_");
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "SUPABASE_NOT_CONFIGURED") {
      return NextResponse.json({ error: "Quote service is not configured." }, { status: 503 });
    }
    console.error("Quote PDF generation failed", error instanceof Error ? error.message : "UNKNOWN_ERROR");
    return NextResponse.json({ error: "Unable to generate quote PDF." }, { status: 502 });
  }
}
