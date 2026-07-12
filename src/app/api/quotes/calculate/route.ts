import { NextRequest, NextResponse } from "next/server";
import { calculateQuote } from "@/lib/quote-pricing";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get("product")?.slice(0, 120) || "";
  const quantity = Number(request.nextUrl.searchParams.get("quantity")) || 1;
  const currency = request.nextUrl.searchParams.get("currency") || "USD";
  try {
    const quote = calculateQuote(productId, quantity, currency);
    return NextResponse.json({
      product: { id: quote.product.id, name: quote.product.nameEn || quote.product.name },
      quantity: quote.quantity,
      currency: quote.currency,
      unitPrice: quote.unitPrice,
      subtotal: quote.subtotal,
      discountRate: quote.discountRate,
      discountAmount: quote.discountAmount,
      total: quote.total,
      validUntil: quote.validUntil,
      indicative: true,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const code = error instanceof Error ? error.message : "QUOTE_ERROR";
    const status = code === "PRODUCT_NOT_FOUND" ? 404 : code === "PRICE_NOT_AVAILABLE" ? 422 : code === "FX_RATE_NOT_CONFIGURED" ? 503 : 400;
    const messages: Record<string, string> = {
      PRODUCT_NOT_FOUND: "Product not found.",
      PRICE_NOT_AVAILABLE: "This product requires a manual quotation.",
      FX_RATE_NOT_CONFIGURED: "The selected currency is temporarily unavailable.",
    };
    return NextResponse.json({ error: messages[code] || "Unable to calculate quote." }, { status });
  }
}

