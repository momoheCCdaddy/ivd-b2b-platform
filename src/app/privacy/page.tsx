import type { Metadata } from "next";
import LocalizedContentPage from "@/components/content/LocalizedContentPage";
export const metadata: Metadata = { title: "Privacy Policy", description: "How Cobioer BioSciences collects, uses, protects and retains personal data submitted through its international B2B website.", alternates: { canonical: "/privacy" } };
export default function PrivacyPage() { return <LocalizedContentPage page="privacy" />; }
