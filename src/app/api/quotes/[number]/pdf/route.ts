import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { supabaseRequest } from "@/lib/supabase-rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type QuoteRow = {
  quote_number: string; currency: string; subtotal: number; discount_amount: number; total: number;
  valid_until: string; created_at: string; notes?: string;
  leads: { full_name: string; email: string; company?: string; country?: string } | Array<{ full_name: string; email: string; company?: string; country?: string }>;
  quote_items: Array<{ product_id: string; product_name: string; quantity: number; unit_price: number; line_total: number }>;
};

const money = (value: number, currency: string) => `${currency} ${Number(value).toFixed(2)}`;

export async function GET(request: NextRequest, { params }: { params: { number: string } }) {
  const token = request.nextUrl.searchParams.get("token") || "";
  if (!token || !/^[0-9a-f-]{36}$/i.test(token)) return NextResponse.json({ error: "Invalid quote link." }, { status: 401 });
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

    const pdf = await PDFDocument.create();
    const page = pdf.addPage([595.28, 841.89]);
    const regular = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
    const blue = rgb(0.04, 0.35, 0.55);
    page.drawRectangle({ x: 0, y: 760, width: 595.28, height: 81.89, color: rgb(0.02, 0.18, 0.28) });
    page.drawText("COBIOER BIOSCIENCES", { x: 42, y: 800, size: 18, font: bold, color: rgb(1, 1, 1) });
    page.drawText("Commercial Quotation", { x: 42, y: 780, size: 10, font: regular, color: rgb(0.75, 0.9, 0.96) });
    page.drawText(quote.quote_number, { x: 390, y: 794, size: 11, font: bold, color: rgb(1, 1, 1) });
    page.drawText(`Issued: ${new Date(quote.created_at).toISOString().slice(0, 10)}`, { x: 390, y: 778, size: 9, font: regular, color: rgb(0.85, 0.9, 0.93) });
    page.drawText(`Valid until: ${quote.valid_until}`, { x: 390, y: 765, size: 9, font: regular, color: rgb(0.85, 0.9, 0.93) });
    page.drawText("QUOTED TO", { x: 42, y: 720, size: 9, font: bold, color: blue });
    page.drawText(lead?.full_name || "Customer", { x: 42, y: 700, size: 13, font: bold, color: rgb(0.12, 0.16, 0.2) });
    if (lead?.company) page.drawText(lead.company.slice(0, 70), { x: 42, y: 683, size: 10, font: regular });
    page.drawText(lead?.email || "", { x: 42, y: 667, size: 10, font: regular });
    if (lead?.country) page.drawText(lead.country.slice(0, 70), { x: 42, y: 651, size: 10, font: regular });

    let y = 600;
    page.drawRectangle({ x: 42, y, width: 511, height: 28, color: rgb(0.93, 0.96, 0.97) });
    page.drawText("Product", { x: 52, y: y + 9, size: 9, font: bold });
    page.drawText("Qty", { x: 360, y: y + 9, size: 9, font: bold });
    page.drawText("Unit price", { x: 405, y: y + 9, size: 9, font: bold });
    page.drawText("Amount", { x: 495, y: y + 9, size: 9, font: bold });
    y -= 34;
    for (const item of quote.quote_items.slice(0, 12)) {
      page.drawText(`${item.product_id} - ${item.product_name}`.slice(0, 60), { x: 52, y, size: 9, font: regular });
      page.drawText(String(item.quantity), { x: 365, y, size: 9, font: regular });
      page.drawText(money(item.unit_price, quote.currency), { x: 405, y, size: 9, font: regular });
      page.drawText(money(item.line_total, quote.currency), { x: 485, y, size: 9, font: regular });
      y -= 28;
    }
    y -= 20;
    page.drawText("Subtotal", { x: 400, y, size: 10, font: regular }); page.drawText(money(quote.subtotal, quote.currency), { x: 480, y, size: 10, font: regular });
    y -= 20;
    page.drawText("Discount", { x: 400, y, size: 10, font: regular }); page.drawText(`-${money(quote.discount_amount, quote.currency)}`, { x: 480, y, size: 10, font: regular });
    y -= 28;
    page.drawText("TOTAL", { x: 400, y, size: 12, font: bold, color: blue }); page.drawText(money(quote.total, quote.currency), { x: 475, y, size: 12, font: bold, color: blue });
    page.drawLine({ start: { x: 42, y: 115 }, end: { x: 553, y: 115 }, thickness: 0.5, color: rgb(0.75, 0.78, 0.8) });
    page.drawText("Prices exclude shipping, duties and local taxes unless stated otherwise.", { x: 42, y: 94, size: 8, font: regular, color: rgb(0.4, 0.44, 0.48) });
    page.drawText("Final availability and batch documentation are subject to sales confirmation.", { x: 42, y: 80, size: 8, font: regular, color: rgb(0.4, 0.44, 0.48) });
    page.drawText("sales@cobioer.com  |  www.cobioer.com", { x: 42, y: 52, size: 9, font: bold, color: blue });
    const bytes = await pdf.save();
    return new NextResponse(Buffer.from(bytes), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${quote.quote_number}.pdf"`, "Cache-Control": "private, no-store" } });
  } catch (error) {
    if (error instanceof Error && error.message === "SUPABASE_NOT_CONFIGURED") return NextResponse.json({ error: "Quote service is not configured." }, { status: 503 });
    return NextResponse.json({ error: "Unable to generate quote PDF." }, { status: 502 });
  }
}
