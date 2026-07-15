import type { Metadata } from "next";
import LocalizedContentPage from "@/components/content/LocalizedContentPage";
export const metadata: Metadata = { title: "Quality & Product Traceability", description: "Identity verification, contamination control, performance testing and batch-specific documentation for Cobioer products.", alternates: { canonical: "/quality" } };
export default function QualityPage() { return <LocalizedContentPage page="quality" />; }
