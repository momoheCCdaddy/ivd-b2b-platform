import type { Metadata } from "next";
import CategoryManager from "@/components/admin/CategoryManager";

export const metadata: Metadata = { title: "Catalog Management", robots: { index: false, follow: false, nocache: true } };

export default function CatalogManagementPage() {
  return <div className="min-h-screen bg-secondary-50 px-4 pb-16 pt-28"><div className="container-page"><CategoryManager /></div></div>;
}
