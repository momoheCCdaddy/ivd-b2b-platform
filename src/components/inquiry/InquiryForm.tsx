"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type FormState = "idle" | "submitting" | "success" | "error";

export default function InquiryForm() {
  const params = useSearchParams();
  const { lang, currency } = useI18n();
  const [state, setState] = useState<FormState>("idle");
  const [feedback, setFeedback] = useState("");
  const productId = params.get("product") || "";
  const productName = params.get("name") || "";
  const initialMessage = useMemo(
    () => productId ? `I would like pricing, availability and lead-time information for ${productId}${productName ? ` — ${productName}` : ""}.` : "",
    [productId, productName],
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setFeedback("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          productId,
          productName,
          quantity: Number(payload.quantity) || 1,
          consentPrivacy: data.get("consentPrivacy") === "on",
          consentMarketing: data.get("consentMarketing") === "on",
          locale: lang,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          pageUrl: window.location.href,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Submission failed.");
      setState("success");
      setFeedback(`Inquiry ${result.inquiryNumber} received. Our sales team will reply within one business day.`);
      form.reset();
    } catch (error) {
      setState("error");
      setFeedback(error instanceof Error ? error.message : "Unable to submit your inquiry.");
    }
  }

  const fieldClass = "w-full rounded-xl border border-secondary-200 bg-white px-4 py-3 text-sm text-secondary-700 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-100/60";

  return (
    <form onSubmit={submit} className="space-y-5" aria-label="B2B inquiry form">
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {productId && (
        <div className="rounded-xl border border-primary-100 bg-primary-50/70 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-500">Selected product</p>
          <p className="mt-1 font-mono text-sm font-semibold text-primary-800">{productId}</p>
          {productName && <p className="mt-1 text-sm text-secondary-600">{productName}</p>}
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-secondary-700">Full name *<input required name="fullName" autoComplete="name" className={`${fieldClass} mt-2`} /></label>
        <label className="text-sm font-medium text-secondary-700">Business email *<input required type="email" name="email" autoComplete="email" className={`${fieldClass} mt-2`} /></label>
        <label className="text-sm font-medium text-secondary-700">Company / institution<input name="company" autoComplete="organization" className={`${fieldClass} mt-2`} /></label>
        <label className="text-sm font-medium text-secondary-700">Country / region<input name="country" autoComplete="country-name" className={`${fieldClass} mt-2`} /></label>
        <label className="text-sm font-medium text-secondary-700">Phone<input name="phone" autoComplete="tel" className={`${fieldClass} mt-2`} /></label>
        <label className="text-sm font-medium text-secondary-700">Quantity<input name="quantity" type="number" min="1" max="100000" defaultValue="1" className={`${fieldClass} mt-2`} /></label>
        <label className="text-sm font-medium text-secondary-700">Inquiry type<select name="inquiryType" className={`${fieldClass} mt-2`} defaultValue={productId ? "product" : "general"}><option value="product">Product & availability</option><option value="custom">Custom development</option><option value="distribution">Distribution partnership</option><option value="technical">Technical support</option><option value="general">General inquiry</option></select></label>
        <label className="text-sm font-medium text-secondary-700">Preferred currency<select key={currency} name="currency" className={`${fieldClass} mt-2`} defaultValue={currency}><option value="USD">USD — US Dollar</option><option value="EUR">EUR — Euro</option><option value="CNY">CNY — Chinese Yuan</option></select></label>
      </div>
      <label className="block text-sm font-medium text-secondary-700">Requirements *<textarea required name="message" rows={6} defaultValue={initialMessage} className={`${fieldClass} mt-2 resize-y`} placeholder="Tell us your application, target quantity, destination and required delivery date." /></label>
      <label className="flex items-start gap-3 text-xs leading-relaxed text-secondary-500"><input required name="consentPrivacy" type="checkbox" className="mt-0.5 h-4 w-4 rounded border-secondary-300 text-primary-600" /><span>I agree to the <a href="/privacy" className="font-medium text-primary-600 hover:underline">Privacy Policy</a> and consent to processing my data to respond to this inquiry. *</span></label>
      <label className="flex items-start gap-3 text-xs leading-relaxed text-secondary-500"><input name="consentMarketing" type="checkbox" className="mt-0.5 h-4 w-4 rounded border-secondary-300 text-primary-600" /><span>I would like to receive relevant product and technical updates. Optional.</span></label>
      {feedback && <div role="status" className={`rounded-xl border p-4 text-sm ${state === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-700"}`}>{state === "success" && <CheckCircle2 className="mr-2 inline h-4 w-4" />}{feedback}</div>}
      <button disabled={state === "submitting"} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60">
        {state === "submitting" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {state === "submitting" ? "Submitting…" : "Submit inquiry"}
      </button>
      <p className="text-center text-xs text-secondary-400">Typical response time: within one business day.</p>
    </form>
  );
}
