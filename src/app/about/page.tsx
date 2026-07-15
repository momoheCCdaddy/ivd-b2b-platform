import type { Metadata } from "next";
import LocalizedContentPage from "@/components/content/LocalizedContentPage";
export const metadata: Metadata = { title: "About Cobioer BioSciences", description: "Learn about Cobioer, Ningpu Diagnostics and LeadingMed capabilities in cell models, diagnostic reference materials and IVD development.", alternates: { canonical: "/about" } };
export default function AboutPage() { return <LocalizedContentPage page="about" />; }
