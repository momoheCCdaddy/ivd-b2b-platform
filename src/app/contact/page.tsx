import type { Metadata } from "next";
import { Suspense } from "react";
import ContactContent from "@/components/inquiry/ContactContent";
export const metadata: Metadata = { title: "Request a Quote | Contact Global Sales", description: "Contact Cobioer global sales for IVD products, research cell lines, custom development, pricing and availability.", alternates: { canonical: "/contact" } };
export default function ContactPage() { return <Suspense fallback={<div className="min-h-screen bg-secondary-50 pt-20" />}><ContactContent /></Suspense>; }
