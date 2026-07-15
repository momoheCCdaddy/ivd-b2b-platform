import type { Metadata } from "next";
import LocalizedContentPage from "@/components/content/LocalizedContentPage";
export const metadata: Metadata = { title: "Cell Engineering & IVD CDMO Services", description: "Cell engineering, drug-target model development, efficacy studies and IVD CDMO services for global life-science companies.", alternates: { canonical: "/services" } };
export default function ServicesPage() { return <LocalizedContentPage page="services" />; }
