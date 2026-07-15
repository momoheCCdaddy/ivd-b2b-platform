"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type FormState = "idle" | "submitting" | "success" | "error";

export default function InquiryForm({ productId = "", productName = "" }: { productId?: string; productName?: string }) {
  const { lang, currency, t } = useI18n();
  const [state, setState] = useState<FormState>("idle");
  const [feedback, setFeedback] = useState("");
  const initialMessage = useMemo(
    () => productId ? t("inquiry.initialMessage", { product: `${productId}${productName ? ` — ${productName}` : ""}` }) : "",
    [productId, productName, t],
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
      setFeedback(t("inquiry.success", { number: result.inquiryNumber }));
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
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-500">{t("inquiry.selectedProduct")}</p>
          <p className="mt-1 font-mono text-sm font-semibold text-primary-800">{productId}</p>
          {productName && <p className="mt-1 text-sm text-secondary-600">{productName}</p>}
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-secondary-700">{t("inquiry.fullName")} *<input required name="fullName" autoComplete="name" className={`${fieldClass} mt-2`} /></label>
        <label className="text-sm font-medium text-secondary-700">{t("inquiry.businessEmail")} *<input required type="email" name="email" autoComplete="email" className={`${fieldClass} mt-2`} /></label>
        <label className="text-sm font-medium text-secondary-700">{t("inquiry.company")}<input name="company" autoComplete="organization" className={`${fieldClass} mt-2`} /></label>
        <label className="text-sm font-medium text-secondary-700">{t("inquiry.country")}<input name="country" autoComplete="country-name" className={`${fieldClass} mt-2`} /></label>
        <label className="text-sm font-medium text-secondary-700">{t("inquiry.phone")}<input name="phone" autoComplete="tel" className={`${fieldClass} mt-2`} /></label>
        <label className="text-sm font-medium text-secondary-700">{t("inquiry.quantity")}<input name="quantity" type="number" min="1" max="100000" defaultValue="1" className={`${fieldClass} mt-2`} /></label>
        <label className="text-sm font-medium text-secondary-700">{t("inquiry.type")}<select name="inquiryType" className={`${fieldClass} mt-2`} defaultValue={productId ? "product" : "general"}><option value="product">{t("inquiry.productAvailability")}</option><option value="custom">{t("inquiry.customDevelopment")}</option><option value="distribution">{t("inquiry.distribution")}</option><option value="technical">{t("inquiry.technical")}</option><option value="general">{t("inquiry.general")}</option></select></label>
        <label className="text-sm font-medium text-secondary-700">{t("inquiry.preferredCurrency")}<select key={currency} name="currency" className={`${fieldClass} mt-2`} defaultValue={currency}><option value="USD">USD — {t("inquiry.usd")}</option><option value="EUR">EUR — {t("inquiry.eur")}</option><option value="CNY">CNY — {t("inquiry.cny")}</option></select></label>
      </div>
      <label className="block text-sm font-medium text-secondary-700">{t("inquiry.requirements")} *<textarea required name="message" rows={6} defaultValue={initialMessage} className={`${fieldClass} mt-2 resize-y`} placeholder={t("inquiry.requirementsPlaceholder")} /></label>
      <label className="flex items-start gap-3 text-xs leading-relaxed text-secondary-500"><input required name="consentPrivacy" type="checkbox" className="mt-0.5 h-4 w-4 rounded border-secondary-300 text-primary-600" /><span>{t("inquiry.agreeTo")} <a href="/privacy" className="font-medium text-primary-600 hover:underline">{t("inquiry.privacyPolicy")}</a> {t("inquiry.consent")} *</span></label>
      <label className="flex items-start gap-3 text-xs leading-relaxed text-secondary-500"><input name="consentMarketing" type="checkbox" className="mt-0.5 h-4 w-4 rounded border-secondary-300 text-primary-600" /><span>{t("inquiry.marketing")}</span></label>
      {feedback && <div role="status" className={`rounded-xl border p-4 text-sm ${state === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-700"}`}>{state === "success" && <CheckCircle2 className="mr-2 inline h-4 w-4" />}{feedback}</div>}
      <button disabled={state === "submitting"} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60">
        {state === "submitting" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {state === "submitting" ? t("inquiry.submitting") : t("inquiry.submit")}
      </button>
      <p className="text-center text-xs text-secondary-400">{t("inquiry.responseTime")}</p>
    </form>
  );
}
