import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { productCategories } from "@/data/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function latin(value: unknown, max = 140) {
  return String(value ?? "").replace(/[^\x20-\x7E]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

function findProduct(id: string) {
  const needle = decodeURIComponent(id).toLowerCase();
  for (const category of productCategories) for (const subcategory of category.items) {
    const product = subcategory.products.find(item => item.id.toLowerCase() === needle);
    if (product) return { product, category, subcategory };
  }
  return null;
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const found = findProduct(params.id);
  if (!found) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  const { product, category, subcategory } = found;
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const navy = rgb(0.02, 0.18, 0.28); const blue = rgb(0.04, 0.39, 0.58); const gray = rgb(0.35, 0.4, 0.44);
  page.drawRectangle({ x: 0, y: 754, width: 595.28, height: 87.89, color: navy });
  page.drawText("COBIOER BIOSCIENCES", { x: 42, y: 798, size: 17, font: bold, color: rgb(1, 1, 1) });
  page.drawText("PRODUCT DATA SHEET", { x: 42, y: 777, size: 9, font: regular, color: rgb(0.7, 0.9, 0.96) });
  page.drawText(latin(product.id), { x: 420, y: 790, size: 12, font: bold, color: rgb(1, 1, 1) });

  const name = latin(product.nameEn || product.name, 95) || latin(product.id);
  page.drawText(name, { x: 42, y: 714, size: 18, font: bold, color: navy, maxWidth: 510 });
  page.drawText(latin(category.titleEn || category.title), { x: 42, y: 692, size: 10, font: bold, color: blue });
  page.drawText(latin(subcategory.nameEn || subcategory.name), { x: 42, y: 677, size: 9, font: regular, color: gray });

  let y = 635;
  page.drawText("PRODUCT OVERVIEW", { x: 42, y, size: 9, font: bold, color: blue }); y -= 20;
  const description = latin(product.descriptionEn || product.description, 480) || "Contact our technical team for product-specific background and application information.";
  const words = description.split(" "); let line = "";
  for (const word of words) { const next = `${line} ${word}`.trim(); if (regular.widthOfTextAtSize(next, 9) > 500) { page.drawText(line, { x: 42, y, size: 9, font: regular, color: gray }); y -= 14; line = word; } else line = next; }
  if (line) { page.drawText(line, { x: 42, y, size: 9, font: regular, color: gray }); y -= 28; }

  const specs: Array<[string, unknown]> = [["Catalog ID", product.id], ["Specification", product.specs], ["Parent cell", product.parentCell], ["Culture medium", product.cultureMedium], ["Stability", product.stability], ["Source", product.source], ["Classification", product.classLevel2], ["Subtype", product.classLevel3], ["Assay format", product.assayFormat], ["Transducer", product.transducer], ["Status", product.status]];
  page.drawText("TECHNICAL INFORMATION", { x: 42, y, size: 9, font: bold, color: blue }); y -= 18;
  for (const [label, raw] of specs.filter(([, value]) => value && String(value).toLowerCase() !== "nan").slice(0, 10)) {
    page.drawRectangle({ x: 42, y: y - 4, width: 511, height: 22, color: y % 2 ? rgb(0.96, 0.97, 0.98) : rgb(0.985, 0.99, 0.99) });
    page.drawText(label, { x: 52, y: y + 3, size: 8, font: bold, color: gray });
    page.drawText(latin(raw, 72), { x: 175, y: y + 3, size: 8, font: regular, color: navy }); y -= 24;
  }
  y -= 12;
  const applications = (product.applicationsEn?.length ? product.applicationsEn : product.applications || []).map(value => latin(value, 80)).filter(Boolean).slice(0, 8);
  if (applications.length) { page.drawText("APPLICATIONS", { x: 42, y, size: 9, font: bold, color: blue }); y -= 18; for (const application of applications) { page.drawCircle({ x: 48, y: y + 3, size: 2, color: blue }); page.drawText(application, { x: 58, y, size: 8.5, font: regular, color: gray }); y -= 15; } }

  page.drawLine({ start: { x: 42, y: 112 }, end: { x: 553, y: 112 }, thickness: 0.5, color: rgb(0.75, 0.79, 0.82) });
  page.drawText("This document is a catalog data sheet, not a batch-specific Certificate of Analysis.", { x: 42, y: 94, size: 8, font: bold, color: gray });
  page.drawText("Request the applicable COA with the catalog ID and lot number. Product specifications may change after document issuance.", { x: 42, y: 80, size: 7.5, font: regular, color: gray });
  page.drawText("sales@cobioer.com  |  400-8750-250  |  www.cobioer.com", { x: 42, y: 52, size: 8.5, font: bold, color: blue });
  const bytes = await pdf.save();
  return new NextResponse(Buffer.from(bytes), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="Cobioer-${latin(product.id)}-Data-Sheet.pdf"`, "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } });
}

