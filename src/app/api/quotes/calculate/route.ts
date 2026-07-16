import { NextRequest, NextResponse } from "next/server";
import { calculateQuote } from "@/lib/quote-pricing";
import { rateLimit } from "@/lib/request-guard";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, "quote-calculate", 60, 60 * 1000);
  if (limited) return limited;
  const productId = request.nextUrl.searchParams.get("product")?.slice(0, 120) || "";
  const quantity = Number(request.nextUrl.searchParams.get("quantity")) || 1;
  const currency = request.nextUrl.searchParams.get("currency") || "USD";
  try {
    const quote = await calculateQuote(productId, quantity, currency);
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
      exchangeRate: quote.exchangeRate,
      exchangeRateSource: quote.exchangeRateSource,
      exchangeRateDate: quote.exchangeRateDate,
      indicative: true,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const code = error instanceof Error ? error.message : "QUOTE_ERROR";
    const status = code === "PRODUCT_NOT_FOUND" ? 404 : code === "PRICE_NOT_AVAILABLE" ? 422 : code === "FX_RATE_UNAVAILABLE" ? 503 : 400;
    const messages: Record<string, string> = {
      PRODUCT_NOT_FOUND: "Product not found.",
      PRICE_NOT_AVAILABLE: "This product requires a manual quotation.",
      FX_RATE_UNAVAILABLE: "The selected currency is temporarily unavailable.",
    };
    return NextResponse.json({ error: messages[code] || "Unable to calculate quote." }, { status });
  }
}
