import { join } from "node:path";
import PDFDocument from "pdfkit";

type QuotePdfLead = {
  fullName: string;
  email: string;
  company?: string;
  country?: string;
};

type QuotePdfItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type QuotePdfInput = {
  quoteNumber: string;
  currency: string;
  subtotal: number;
  discountAmount: number;
  total: number;
  validUntil: string;
  createdAt: string;
  notes?: string;
  lead: QuotePdfLead;
  items: QuotePdfItem[];
};

const FONT_DIR = join(process.cwd(), "assets", "fonts");
const COLORS = {
  navy: "#052E47",
  blue: "#0A597F",
  paleBlue: "#EDF5F7",
  text: "#1F2933",
  muted: "#66717A",
  border: "#C8D0D5",
  white: "#FFFFFF",
};

const ARABIC_PATTERN = /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff]/;
const THAI_PATTERN = /[\u0e00-\u0e7f]/;
const CJK_PATTERN = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/;
const ASCII_PATTERN = /^[\x20-\x7e]*$/;

function cleanText(value: unknown, fallback = "") {
  const text = typeof value === "string" ? value : value == null ? "" : String(value);
  return text.normalize("NFC").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, " ").trim() || fallback;
}

function fontFor(text: string, bold = false) {
  if (ARABIC_PATTERN.test(text)) return "NotoSansArabic";
  if (THAI_PATTERN.test(text)) return "NotoSansThai";
  if (CJK_PATTERN.test(text)) return "IBMPlexSansSC";
  if (!ASCII_PATTERN.test(text)) return "NotoSans";
  return bold ? "Helvetica-Bold" : "Helvetica";
}

function isArabic(text: string) {
  return ARABIC_PATTERN.test(text);
}

function fitText(doc: PDFKit.PDFDocument, text: string, font: string, size: number, maxWidth: number) {
  doc.font(font).fontSize(size);
  if (doc.widthOfString(text) <= maxWidth) return text;
  const characters = Array.from(text);
  while (characters.length && doc.widthOfString(`${characters.join("")}...`) > maxWidth) characters.pop();
  return `${characters.join("")}...`;
}

function drawLocalizedText(
  doc: PDFKit.PDFDocument,
  value: unknown,
  x: number,
  y: number,
  width: number,
  options: { size?: number; bold?: boolean; color?: string; fallback?: string } = {},
) {
  const text = cleanText(value, options.fallback);
  if (!text) return;
  const size = options.size ?? 10;
  const font = fontFor(text, options.bold);
  const fitted = fitText(doc, text, font, size, width);
  doc.font(font).fontSize(size).fillColor(options.color || COLORS.text).text(fitted, x, y, {
    width,
    align: isArabic(text) ? "right" : "left",
    lineBreak: false,
  });
}

function money(value: number, currency: string) {
  return `${currency} ${Number(value).toFixed(2)}`;
}

function drawHeader(doc: PDFKit.PDFDocument, quote: QuotePdfInput) {
  doc.rect(0, 0, doc.page.width, 82).fill(COLORS.navy);
  doc.font("Helvetica-Bold").fontSize(18).fillColor(COLORS.white).text("COBIOER BIOSCIENCES", 42, 26, { lineBreak: false });
  doc.font("Helvetica").fontSize(10).fillColor("#BFE5F2").text("Commercial Quotation", 42, 50, { lineBreak: false });
  doc.font("Helvetica-Bold").fontSize(10).fillColor(COLORS.white).text(cleanText(quote.quoteNumber), 382, 24, { width: 171, align: "right", lineBreak: false });
  doc.font("Helvetica").fontSize(8.5).fillColor("#D9E8EE").text(`Issued: ${new Date(quote.createdAt).toISOString().slice(0, 10)}`, 382, 44, { width: 171, align: "right", lineBreak: false });
  doc.text(`Valid until: ${cleanText(quote.validUntil)}`, 382, 58, { width: 171, align: "right", lineBreak: false });
}

function drawCustomer(doc: PDFKit.PDFDocument, quote: QuotePdfInput) {
  doc.font("Helvetica-Bold").fontSize(9).fillColor(COLORS.blue).text("QUOTED TO", 42, 112, { lineBreak: false });
  drawLocalizedText(doc, quote.lead.fullName, 42, 132, 330, { size: 13, bold: true, fallback: "Customer" });
  drawLocalizedText(doc, quote.lead.company, 42, 154, 330, { size: 9.5 });
  drawLocalizedText(doc, quote.lead.email, 42, 172, 330, { size: 9.5 });
  drawLocalizedText(doc, quote.lead.country, 42, 190, 330, { size: 9.5, color: COLORS.muted });
}

function drawTableHeader(doc: PDFKit.PDFDocument, y: number) {
  doc.rect(42, y, 511, 28).fill(COLORS.paleBlue);
  doc.font("Helvetica-Bold").fontSize(8.5).fillColor(COLORS.text);
  doc.text("Product", 52, y + 9, { width: 285, lineBreak: false });
  doc.text("Qty", 348, y + 9, { width: 40, align: "right", lineBreak: false });
  doc.text("Unit price", 397, y + 9, { width: 72, align: "right", lineBreak: false });
  doc.text("Amount", 478, y + 9, { width: 75, align: "right", lineBreak: false });
}

function drawFooter(doc: PDFKit.PDFDocument, pageNumber: number, pageCount: number) {
  doc.moveTo(42, 742).lineTo(553, 742).lineWidth(0.5).strokeColor(COLORS.border).stroke();
  doc.font("Helvetica").fontSize(7.5).fillColor(COLORS.muted).text("Prices exclude shipping, duties and local taxes unless stated otherwise.", 42, 756, { lineBreak: false });
  doc.text("Final availability and batch documentation are subject to sales confirmation.", 42, 770, { lineBreak: false });
  doc.font("Helvetica-Bold").fontSize(8.5).fillColor(COLORS.blue).text("sales@cobioer.com  |  www.cobioer.com", 42, 793, { lineBreak: false });
  doc.font("Helvetica").fontSize(7.5).fillColor(COLORS.muted).text(`Page ${pageNumber} of ${pageCount}`, 470, 793, { width: 83, align: "right", lineBreak: false });
}

export async function generateCommercialQuotePdf(quote: QuotePdfInput) {
  const doc = new PDFDocument({
    size: "A4",
    margin: 0,
    bufferPages: true,
    compress: true,
    info: {
      Title: `Commercial Quotation ${cleanText(quote.quoteNumber)}`,
      Author: "Cobioer BioSciences",
      Subject: "IVD product commercial quotation",
      Keywords: "Cobioer, IVD, quotation",
      CreationDate: new Date(quote.createdAt),
    },
  });

  doc.registerFont("NotoSans", join(FONT_DIR, "NotoSans-Regular.ttf"));
  doc.registerFont("NotoSansArabic", join(FONT_DIR, "NotoSansArabic-Regular.ttf"));
  doc.registerFont("NotoSansThai", join(FONT_DIR, "NotoSansThai-Regular.ttf"));
  doc.registerFont("IBMPlexSansSC", join(FONT_DIR, "IBMPlexSansSC-Regular.ttf"));

  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));
  const finished = new Promise<void>((resolve, reject) => {
    doc.on("end", resolve);
    doc.on("error", reject);
  });

  drawHeader(doc, quote);
  drawCustomer(doc, quote);
  let y = 226;
  drawTableHeader(doc, y);
  y += 35;

  for (const item of quote.items) {
    if (y > 655) {
      doc.addPage({ size: "A4", margin: 0 });
      drawHeader(doc, quote);
      y = 106;
      drawTableHeader(doc, y);
      y += 35;
    }
    const productId = cleanText(item.productId, "Product");
    const productIdText = fitText(doc, productId, "Helvetica", 8.5, 82);
    doc.font("Helvetica").fontSize(8.5).fillColor(COLORS.text).text(productIdText, 52, y, { width: 82, lineBreak: false });
    drawLocalizedText(doc, item.productName, 140, y, 197, { size: 8.5, fallback: "Product" });
    doc.font("Helvetica").fontSize(8.5).fillColor(COLORS.text).text(String(item.quantity), 348, y, { width: 40, align: "right", lineBreak: false });
    doc.text(money(item.unitPrice, quote.currency), 397, y, { width: 72, align: "right", lineBreak: false });
    doc.text(money(item.lineTotal, quote.currency), 478, y, { width: 75, align: "right", lineBreak: false });
    doc.moveTo(42, y + 24).lineTo(553, y + 24).lineWidth(0.35).strokeColor("#E1E6E9").stroke();
    y += 34;
  }

  if (y > 620) {
    doc.addPage({ size: "A4", margin: 0 });
    drawHeader(doc, quote);
    y = 120;
  } else {
    y += 16;
  }

  const notes = cleanText(quote.notes);
  if (notes) {
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor(COLORS.blue).text("PURCHASER NOTES", 42, y, { lineBreak: false });
    const noteFont = fontFor(notes);
    doc.font(noteFont).fontSize(8.5).fillColor(COLORS.muted).text(notes, 42, y + 18, { width: 290, height: 58, ellipsis: true, align: isArabic(notes) ? "right" : "left" });
  }

  doc.font("Helvetica").fontSize(9.5).fillColor(COLORS.text).text("Subtotal", 382, y, { width: 76, lineBreak: false });
  doc.text(money(quote.subtotal, quote.currency), 466, y, { width: 87, align: "right", lineBreak: false });
  doc.text("Discount", 382, y + 20, { width: 76, lineBreak: false });
  doc.text(`-${money(quote.discountAmount, quote.currency)}`, 466, y + 20, { width: 87, align: "right", lineBreak: false });
  doc.moveTo(382, y + 44).lineTo(553, y + 44).lineWidth(0.8).strokeColor(COLORS.border).stroke();
  doc.font("Helvetica-Bold").fontSize(11.5).fillColor(COLORS.blue).text("TOTAL", 382, y + 56, { width: 76, lineBreak: false });
  doc.text(money(quote.total, quote.currency), 456, y + 56, { width: 97, align: "right", lineBreak: false });

  const pageRange = doc.bufferedPageRange();
  for (let index = 0; index < pageRange.count; index += 1) {
    doc.switchToPage(pageRange.start + index);
    drawFooter(doc, index + 1, pageRange.count);
  }

  doc.end();
  await finished;
  return Buffer.concat(chunks);
}
