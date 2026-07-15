import type { Metadata } from "next";
import LocalizedContentPage from "@/components/content/LocalizedContentPage";
export const metadata: Metadata = { title: "Scientific Insights & Company Updates", description: "Product launches, platform improvements and technical updates from Cobioer BioSciences.", alternates: { canonical: "/news" } };
export default function NewsPage() { return <LocalizedContentPage page="news" />; }
