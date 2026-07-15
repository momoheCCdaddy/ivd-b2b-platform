import type { Metadata } from "next";
import LocalizedContentPage from "@/components/content/LocalizedContentPage";
export const metadata: Metadata = { title: "Product & Ordering FAQ", description: "Answers about quotations, international shipping, certificates of analysis, technical support and custom IVD development.", alternates: { canonical: "/faq" } };
export default function FaqPage() { return <LocalizedContentPage page="faq" />; }
