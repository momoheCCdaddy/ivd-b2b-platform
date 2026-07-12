import type { Metadata } from "next";
import { Suspense } from "react";
import QuoteBuilder from "@/components/quote/QuoteBuilder";

export const metadata: Metadata = {
  title: "Instant Product Quote",
  description: "Calculate indicative IVD product pricing in USD, EUR or CNY and generate a formal PDF quotation.",
  robots: { index: false, follow: true },
};

export default function QuotePage() {
  return <div className="min-h-screen bg-secondary-50 pb-20 pt-24"><section className="container-page py-10 text-center"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">FAST COMMERCIAL RESPONSE</p><h1 className="mt-3 font-display text-4xl font-bold text-secondary-900">Instant product quotation</h1><p className="mx-auto mt-4 max-w-2xl text-secondary-500">Calculate an indicative catalog quote, save it to your account history and download a professionally formatted PDF for internal purchasing review.</p></section><div className="container-page"><Suspense fallback={<div className="h-[600px] animate-pulse rounded-2xl bg-white" />}><QuoteBuilder /></Suspense></div></div>;
}
