import type { Metadata } from "next";
import ContactContent from "@/components/inquiry/ContactContent";
export const metadata: Metadata = { title: "Request a Quote | Contact Global Sales", description: "Contact Cobioer global sales for IVD products, research cell lines, custom development, pricing and availability.", alternates: { canonical: "/contact" } };
export default function ContactPage({ searchParams }: { searchParams: { product?: string; name?: string } }) { return <ContactContent productId={searchParams.product || ""} productName={searchParams.name || ""} />; }
