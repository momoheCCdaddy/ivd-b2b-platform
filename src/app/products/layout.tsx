import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IVD Products, Reference Materials & Cell Models",
  description: "Search 7,000+ Cobioer, Ningpu Diagnostics and LeadingMed products by catalog ID, target or application.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "IVD Product Catalog | Cobioer BioSciences",
    description: "Search authenticated cell models, molecular diagnostic reference materials and IVD raw materials.",
    url: "/products",
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
