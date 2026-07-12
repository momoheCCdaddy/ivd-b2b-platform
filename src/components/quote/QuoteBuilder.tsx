"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Calculator, CheckCircle2, Download, Loader2, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type Preview = { product: { id: string; name: string }; quantity: number; currency: string; unitPrice: number; subtotal: number; discountRate: number; discountAmount: number; total: number; validUntil: string };
type Saved = { quoteNumber: string; total: number; currency: string; validUntil: string; pdfUrl: string };

export default function QuoteBuilder() {
  const params = useSearchParams();
  const { lang, currency } = useI18n();
  const [productId, setProductId] = useState(params.get("product") || "");
  const [quantity, setQuantity] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [saved, setSaved] = useState<Saved | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => setSelectedCurrency(currency), [currency]);

  async function calculate() {
    if (!productId.trim()) return;
    setLoading(true); setError(""); setSaved(null);
    try {
      const query = new URLSearchParams({ product: productId.trim(), quantity: String(quantity), currency: selectedCurrency });
      const response = await fetch(`/api/quotes/calculate?${query}`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to calculate quote.");
      setPreview(result);
    } catch (e) { setPreview(null); setError(e instanceof Error ? e.message : "Unable to calculate quote."); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (productId) void calculate(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!preview) return;
    setLoading(true); setError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/quotes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        ...Object.fromEntries(data.entries()), productId: preview.product.id, quantity: preview.quantity,
        currency: preview.currency, locale: lang, consentPrivacy: data.get("consentPrivacy") === "on",
        consentMarketing: data.get("consentMarketing") === "on",
      }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to create quote.");
      setSaved(result);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to create quote."); }
    finally { setLoading(false); }
  }

  const input = "w-full rounded-xl border border-secondary-200 bg-white px-4 py-3 text-sm text-secondary-700 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-100/60";
  const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: selectedCurrency }).format(value);

  return <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
    <div className="rounded-2xl border border-secondary-100 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex items-center gap-3"><div className="rounded-xl bg-primary-50 p-3"><Calculator className="h-5 w-5 text-primary-600" /></div><div><h2 className="font-display text-xl font-bold text-secondary-900">Configure your quote</h2><p className="text-sm text-secondary-400">Enter a catalog ID and quantity.</p></div></div>
      <div className="grid gap-4 sm:grid-cols-[1fr_120px_130px]">
        <label className="text-xs font-semibold uppercase tracking-wide text-secondary-500">Catalog ID<input value={productId} onChange={e => setProductId(e.target.value)} className={`${input} mt-2 font-mono`} placeholder="CBP60004" /></label>
        <label className="text-xs font-semibold uppercase tracking-wide text-secondary-500">Quantity<input value={quantity} onChange={e => setQuantity(Math.max(1, Number(e.target.value) || 1))} type="number" min="1" max="100000" className={`${input} mt-2`} /></label>
        <label className="text-xs font-semibold uppercase tracking-wide text-secondary-500">Currency<select value={selectedCurrency} onChange={e => setSelectedCurrency(e.target.value as "USD" | "EUR" | "CNY")} className={`${input} mt-2`}><option>USD</option><option>EUR</option><option>CNY</option></select></label>
      </div>
      <button onClick={calculate} disabled={loading || !productId.trim()} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calculator className="h-4 w-4" />}Calculate</button>
      {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error} {error.includes("manual") && <a href={`/contact?product=${encodeURIComponent(productId)}`} className="font-semibold underline">Request manually</a>}</div>}

      {preview && <div className="mt-6 rounded-2xl border border-primary-100 bg-primary-50/50 p-5"><div className="flex justify-between gap-4"><div><p className="font-mono text-xs font-semibold text-primary-600">{preview.product.id}</p><h3 className="mt-1 font-semibold text-secondary-900">{preview.product.name}</h3></div><span className="h-fit rounded-full bg-white px-3 py-1 text-xs font-medium text-secondary-500">Valid to {preview.validUntil}</span></div><dl className="mt-5 space-y-2 border-t border-primary-100 pt-4 text-sm"><div className="flex justify-between"><dt>Unit price</dt><dd>{money(preview.unitPrice)}</dd></div><div className="flex justify-between"><dt>Quantity</dt><dd>{preview.quantity}</dd></div><div className="flex justify-between"><dt>Subtotal</dt><dd>{money(preview.subtotal)}</dd></div>{preview.discountAmount > 0 && <div className="flex justify-between text-emerald-700"><dt>Volume discount ({preview.discountRate * 100}%)</dt><dd>-{money(preview.discountAmount)}</dd></div>}<div className="flex justify-between border-t border-primary-100 pt-3 text-lg font-bold text-primary-800"><dt>Estimated total</dt><dd>{money(preview.total)}</dd></div></dl><p className="mt-4 text-[11px] leading-relaxed text-secondary-400">Indicative product price only. Freight, import duties, local taxes and special handling are excluded. Final availability is subject to confirmation.</p></div>}
    </div>

    <div className="rounded-2xl border border-secondary-100 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex items-center gap-3"><ShieldCheck className="h-6 w-6 text-primary-600" /><div><h2 className="font-display text-xl font-bold text-secondary-900">Generate formal PDF</h2><p className="text-sm text-secondary-400">Save your quote and download a shareable PDF.</p></div></div>
      {!preview ? <div className="rounded-xl border border-dashed border-secondary-200 p-10 text-center text-sm text-secondary-400">Calculate a product price first.</div> : saved ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center"><CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" /><h3 className="mt-3 font-bold text-emerald-900">Quote {saved.quoteNumber} created</h3><p className="mt-2 text-sm text-emerald-700">{saved.currency} {saved.total.toFixed(2)} · valid until {saved.validUntil}</p><a href={saved.pdfUrl} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"><Download className="h-4 w-4" />Download PDF quote</a></div> : <form onSubmit={save} className="space-y-4"><input name="website" className="hidden" tabIndex={-1} /><input required name="fullName" className={input} placeholder="Full name *" autoComplete="name" /><input required type="email" name="email" className={input} placeholder="Business email *" autoComplete="email" /><input name="company" className={input} placeholder="Company / institution" autoComplete="organization" /><input name="country" className={input} placeholder="Country / region" autoComplete="country-name" /><textarea name="notes" rows={3} className={`${input} resize-y`} placeholder="Delivery destination or special requirements" /><label className="flex items-start gap-3 text-xs leading-relaxed text-secondary-500"><input required name="consentPrivacy" type="checkbox" className="mt-0.5" /><span>I agree to the <a href="/privacy" className="font-semibold text-primary-600">Privacy Policy</a> and processing required to create this quote. *</span></label><label className="flex items-start gap-3 text-xs leading-relaxed text-secondary-500"><input name="consentMarketing" type="checkbox" className="mt-0.5" /><span>Send me relevant product updates. Optional.</span></label><button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary-900 px-5 py-3.5 text-sm font-semibold text-white hover:bg-secondary-800 disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}Create & save PDF quote</button></form>}
    </div>
  </div>;
}

