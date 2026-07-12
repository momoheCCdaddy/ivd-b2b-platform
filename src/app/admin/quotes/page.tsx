import type { Metadata } from "next";
import QuoteHistory from "@/components/admin/QuoteHistory";

export const metadata: Metadata = { title: "Quote History", robots: { index: false, follow: false, nocache: true } };
export default function QuoteHistoryPage() { return <div className="min-h-screen bg-secondary-50 px-4 pb-16 pt-28"><div className="container-page"><QuoteHistory /></div></div>; }

