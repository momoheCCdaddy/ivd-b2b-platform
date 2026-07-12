import type { Metadata } from "next";
import SalesDashboard from "@/components/admin/SalesDashboard";

export const metadata: Metadata = {
  title: "Sales Workspace",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminPage() {
  return <div className="min-h-screen bg-secondary-50 px-4 pb-16 pt-28"><div className="container-page"><SalesDashboard /></div></div>;
}
