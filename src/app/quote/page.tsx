import type { Metadata } from "next";
import { Suspense } from "react";
import QuoteBuilder from "@/components/quote/QuoteBuilder";
import QuoteHeader from "@/components/quote/QuoteHeader";

export const metadata: Metadata = {
  title: "Instant Product Quote",
  description: "Calculate indicative IVD product pricing in USD, EUR or CNY and generate a formal PDF quotation.",
  robots: { index: false, follow: true },
};

export default function QuotePage() {
  return <div className="min-h-screen bg-secondary-50 pb-20 pt-24"><QuoteHeader /><div className="container-page"><Suspense fallback={<div className="h-[600px] animate-pulse rounded-2xl bg-white" />}><QuoteBuilder /></Suspense></div></div>;
}
