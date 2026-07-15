import type { Metadata } from "next";
import LocalizedContentPage from "@/components/content/LocalizedContentPage";
export const metadata: Metadata = { title: "Technical Center", description: "Technical resources for cell culture, assay model selection, diagnostic reference materials and custom project planning.", alternates: { canonical: "/tech-center" } };
export default function TechCenterPage() { return <LocalizedContentPage page="tech-center" />; }
