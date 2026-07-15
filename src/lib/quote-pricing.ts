import { productCategories } from "@/data/products";
import type { ProductItem } from "@/data/products";

export type QuoteCurrency = "USD" | "EUR" | "CNY";
type ExchangeRate = { cnyPerUnit: number; source: "configured" | "ECB" | "base"; date: string };

const ECB_DAILY_RATES_URL = "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";

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

async function getExchangeRate(currency: QuoteCurrency): Promise<ExchangeRate> {
  const today = new Date().toISOString().slice(0, 10);
  if (currency === "CNY") return { cnyPerUnit: 1, source: "base", date: today };
  const cnyPerUnit = Number(currency === "USD" ? process.env.QUOTE_CNY_PER_USD : process.env.QUOTE_CNY_PER_EUR);
  if (Number.isFinite(cnyPerUnit) && cnyPerUnit > 0) return { cnyPerUnit, source: "configured", date: today };

  try {
    const response = await fetch(ECB_DAILY_RATES_URL, { next: { revalidate: 21_600 }, signal: AbortSignal.timeout(6_000) });
    if (!response.ok) throw new Error("ECB_RATE_UNAVAILABLE");
    const xml = await response.text();
    const value = (code: string) => Number(new RegExp(`currency=['\"]${code}['\"]\\s+rate=['\"]([0-9.]+)['\"]`).exec(xml)?.[1]);
    const cnyPerEur = value("CNY");
    const usdPerEur = value("USD");
    const date = /time=['\"]([^'\"]+)['\"]/.exec(xml)?.[1] || today;
    const ecbRate = currency === "EUR" ? cnyPerEur : cnyPerEur / usdPerEur;
    if (!Number.isFinite(ecbRate) || ecbRate <= 0) throw new Error("ECB_RATE_INVALID");
    return { cnyPerUnit: ecbRate, source: "ECB", date };
  } catch {
    throw new Error("FX_RATE_UNAVAILABLE");
  }
}

const round = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export async function calculateQuote(productId: string, quantityInput: number, currencyInput: string) {
  const product = findProductById(productId);
  if (!product) throw new Error("PRODUCT_NOT_FOUND");
  const sourceUnitPriceCny = parsePrice(product.listPrice);
  if (!sourceUnitPriceCny) throw new Error("PRICE_NOT_AVAILABLE");
  const quantity = Math.max(1, Math.min(100000, Math.floor(quantityInput || 1)));
  const currency: QuoteCurrency = ["USD", "EUR", "CNY"].includes(currencyInput) ? currencyInput as QuoteCurrency : "USD";
  const exchangeRate = await getExchangeRate(currency);
  const unitPrice = round(sourceUnitPriceCny / exchangeRate.cnyPerUnit);
  const subtotal = round(unitPrice * quantity);
  const discountRate = getDiscount(quantity);
  const discountAmount = round(subtotal * discountRate);
  const total = round(subtotal - discountAmount);
  const validDays = Math.max(1, Math.min(90, Number(process.env.QUOTE_VALID_DAYS) || 14));
  const validUntil = new Date(Date.now() + validDays * 86400000).toISOString().slice(0, 10);
  return { product, quantity, currency, exchangeRate: exchangeRate.cnyPerUnit, exchangeRateSource: exchangeRate.source, exchangeRateDate: exchangeRate.date, sourceUnitPriceCny, unitPrice, subtotal, discountRate, discountAmount, total, validUntil };
}
