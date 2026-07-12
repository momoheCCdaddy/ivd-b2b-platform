import { productCategories } from "@/data/products";
import type { ProductItem } from "@/data/products";

export type QuoteCurrency = "USD" | "EUR" | "CNY";

export function findProductById(id: string): ProductItem | null {
  const needle = id.trim().toLowerCase();
  for (const category of productCategories) {
    for (const subcategory of category.items) {
      const product = subcategory.products.find(item => item.id.toLowerCase() === needle);
      if (product) return product;
    }
  }
  return null;
}

function parsePrice(value?: string) {
  if (!value || ["nan", "询价", "下架"].includes(value.trim().toLowerCase())) return null;
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function getDiscount(quantity: number) {
  const raw = quantity >= 10 ? process.env.QUOTE_DISCOUNT_QTY_10 : quantity >= 5 ? process.env.QUOTE_DISCOUNT_QTY_5 : "0";
  const discount = Number(raw || 0);
  return Number.isFinite(discount) ? Math.min(0.5, Math.max(0, discount)) : 0;
}

function getExchangeRate(currency: QuoteCurrency) {
  if (currency === "CNY") return 1;
  const cnyPerUnit = Number(currency === "USD" ? process.env.QUOTE_CNY_PER_USD : process.env.QUOTE_CNY_PER_EUR);
  if (!Number.isFinite(cnyPerUnit) || cnyPerUnit <= 0) throw new Error("FX_RATE_NOT_CONFIGURED");
  return cnyPerUnit;
}

const round = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function calculateQuote(productId: string, quantityInput: number, currencyInput: string) {
  const product = findProductById(productId);
  if (!product) throw new Error("PRODUCT_NOT_FOUND");
  const sourceUnitPriceCny = parsePrice(product.listPrice);
  if (!sourceUnitPriceCny) throw new Error("PRICE_NOT_AVAILABLE");
  const quantity = Math.max(1, Math.min(100000, Math.floor(quantityInput || 1)));
  const currency: QuoteCurrency = ["USD", "EUR", "CNY"].includes(currencyInput) ? currencyInput as QuoteCurrency : "USD";
  const exchangeRate = getExchangeRate(currency);
  const unitPrice = round(sourceUnitPriceCny / exchangeRate);
  const subtotal = round(unitPrice * quantity);
  const discountRate = getDiscount(quantity);
  const discountAmount = round(subtotal * discountRate);
  const total = round(subtotal - discountAmount);
  const validDays = Math.max(1, Math.min(90, Number(process.env.QUOTE_VALID_DAYS) || 14));
  const validUntil = new Date(Date.now() + validDays * 86400000).toISOString().slice(0, 10);
  return { product, quantity, currency, exchangeRate, sourceUnitPriceCny, unitPrice, subtotal, discountRate, discountAmount, total, validUntil };
}
