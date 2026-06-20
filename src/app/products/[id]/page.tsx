"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft, FileText, FlaskConical, ShieldCheck, Download, Mail, Phone, ExternalLink, Tag, Activity, Database, Beaker } from "lucide-react";
import { productCategories } from "@/data/products";
import { useI18n } from "@/lib/i18n";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { lang, t } = useI18n();
  const fmtName = (p: any) => lang === "en" && p.nameEn ? p.nameEn : p.name;
  const fmtDesc = (p: any) => lang === "en" && p.descriptionEn ? p.descriptionEn : p.description;
  const fmtApps = (p: any) => lang === "en" && p.applicationsEn?.length ? p.applicationsEn : p.applications || [];
  const fmtTags = (p: any) => lang === "en" && p.tagsEn?.length ? p.tagsEn : p.tags || [];
  const router = useRouter();

  let product = null; let catTitle = ""; let catId = ""; let catDesc = ""; let related: any[] = [];
  for (const cat of productCategories) {
    for (const sub of cat.items) {
      for (const p of sub.products) {
        if (p.id === params.id) {
          product = p; catTitle = cat.title; catId = cat.id; catDesc = cat.description;
          related = sub.products.filter(r => r.id !== p.id).slice(0, 4);
        }
      }
    }
  }

  if (!product) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-secondary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-7 h-7 text-secondary-300" />
          </div>
          <h1 className="font-display text-xl font-bold text-secondary-800 mb-2">{t("products.detail.notFound")}</h1>
          <p className="text-sm text-secondary-400 mb-6">{t("products.detail.notFoundDesc")}</p>
          <button onClick={() => router.push("/products")}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-all">
            <ArrowLeft className="w-4 h-4" /> {t("products.detail.backToProducts")}
          </button>
        </div>
      </div>
    );
  }

  const tags = fmtTags(product);
  const apps = fmtApps(product);

  // Build spec entries from available fields
  const specs: { label: string; labelEn: string; value: string }[] = [];
  if (product.parentCell) specs.push({ label: "亲本细胞", labelEn: "Parent Cell", value: product.parentCell });
  if (product.cultureMedium) specs.push({ label: "培养基", labelEn: "Culture Medium", value: product.cultureMedium });
  if (product.specs) specs.push({ label: "规格", labelEn: "Specification", value: product.specs });
  if (product.stability) specs.push({ label: "稳定性", labelEn: "Stability", value: product.stability });
  if (product.source) specs.push({ label: "来源", labelEn: "Source", value: product.source });
  if (product.classLevel2) specs.push({ label: "分类", labelEn: "Classification", value: product.classLevel2 });
  if (product.classLevel3) specs.push({ label: "亚型", labelEn: "Subtype", value: product.classLevel3 });
  if (product.assayFormat) specs.push({ label: "检测方法", labelEn: "Assay Format", value: product.assayFormat });
  if (product.transducer) specs.push({ label: "转导蛋白", labelEn: "Transducer", value: product.transducer });
  if (product.rawApplication) specs.push({ label: "应用", labelEn: "Application", value: product.rawApplication });

  return (
    <div className="pt-16 min-h-screen bg-[var(--color-bg)]">
      {/* Breadcrumb bar */}
      <div className="border-b border-secondary-100/50 bg-white/50">
        <div className="container-page py-3">
          <nav className="flex items-center gap-2 text-xs text-secondary-400">
            <button onClick={() => router.push("/")} className="hover:text-primary-600 transition-colors">{t("products.detail.breadcrumb.home")}</button>
            <ChevronRight className="w-3 h-3" />
            <button onClick={() => router.push("/products")} className="hover:text-primary-600 transition-colors">{t("products.detail.breadcrumb.products")}</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-secondary-600 font-medium">{product.id}</span>
          </nav>
        </div>
      </div>

      <div className="container-page py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product header */}
            <div className="bg-white border border-secondary-100/50 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <FlaskConical className="w-7 h-7 text-primary-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-[11px] font-mono font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-md tracking-wide">
                      {product.id}
                    </span>
                    <span className="text-[11px] text-secondary-400 bg-secondary-50 px-2 py-1 rounded-md">
                      {catTitle}
                    </span>
                    {product.status && product.status !== "nan" && (
                      <span className="text-[11px] text-signal-700 bg-signal-50 px-2 py-1 rounded-md border border-signal-100/50">
                        {product.status}
                      </span>
                    )}
                  </div>
                  <h1 className="font-display text-xl md:text-2xl font-bold text-secondary-800 leading-tight">
                    {fmtName(product)}
                  </h1>
                  <p className="text-sm text-secondary-400 mt-2 leading-relaxed max-w-2xl">
                    {fmtDesc(product)}
                  </p>
                </div>
              </div>

              {/* QC Badges */}
              <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-secondary-100/50">
                <span className="flex items-center gap-1 text-[11px] text-signal-700 bg-signal-50 px-2.5 py-1 rounded-lg border border-signal-100/50">
                  <ShieldCheck className="w-3 h-3" /> {t("products.detail.qcPassed")}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-primary-600 bg-primary-50 px-2.5 py-1 rounded-lg border border-primary-100/50">
                  {t("products.detail.strVerified")}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-warm-700 bg-warm-50 px-2.5 py-1 rounded-lg border border-warm-100/50">
                  {t("products.detail.mycoplasmaFree")}
                </span>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="mt-5 pt-5 border-t border-secondary-100/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-3.5 h-3.5 text-secondary-400" />
                    <span className="text-xs font-medium text-secondary-500">{lang === "en" ? "Tags" : "标签"}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag: string, i: number) => (
                      <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-secondary-50 text-secondary-500 border border-secondary-100/50 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Specifications */}
            {specs.length > 0 && (
              <div className="bg-white border border-secondary-100/50 rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="font-display font-semibold text-secondary-800 mb-4 text-sm flex items-center gap-2">
                  <Database className="w-4 h-4 text-primary-500" />
                  {t("products.detail.specs")}
                </h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {specs.map((spec, i) => (
                    <div key={i} className="bg-secondary-50/50 rounded-xl px-4 py-3">
                      <dt className="text-[10px] font-mono text-secondary-400 uppercase tracking-wider mb-1">
                        {lang === "en" ? spec.labelEn : spec.label}
                      </dt>
                      <dd className="text-sm font-medium text-secondary-700 break-words">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Applications */}
            {apps.length > 0 && (
              <div className="bg-white border border-secondary-100/50 rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="font-display font-semibold text-secondary-800 mb-4 text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary-500" />
                  {t("products.detail.applications")}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {apps.map((a: string, i: number) => (
                    <span key={i} className="text-xs bg-primary-50 text-primary-700 px-3 py-1.5 rounded-lg border border-primary-100/50 font-medium">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Note */}
            {product.note && product.note !== "nan" && (
              <div className="bg-warm-50/30 border border-warm-100/50 rounded-2xl p-6 shadow-sm">
                <h2 className="font-display font-semibold text-warm-800 mb-2 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-warm-500" />
                  {lang === "en" ? "Notes" : "备注"}
                </h2>
                <p className="text-sm text-warm-700 leading-relaxed">{product.note}</p>
              </div>
            )}

            {/* Related */}
            {related.length > 0 && (
              <div className="bg-white border border-secondary-100/50 rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="font-display font-semibold text-secondary-800 mb-4 text-sm">{t("products.detail.related")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {related.map(r => (
                    <button
                      key={r.id}
                      onClick={() => router.push("/products/" + r.id)}
                      className="text-left p-4 border border-secondary-100/50 rounded-xl hover:border-primary-200/50 hover:bg-primary-50/30 transition-all group"
                    >
                      <div className="text-[11px] font-mono font-semibold text-primary-600 mb-1">{r.id}</div>
                      <div className="text-sm font-medium text-secondary-700 group-hover:text-primary-600 transition-colors">{fmtName(r)}</div>
                      <div className="text-[11px] text-secondary-400 mt-1 line-clamp-1">{fmtDesc(r)}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quote CTA */}
            <div className="bg-white border border-secondary-100/50 rounded-2xl p-6 shadow-sm">
              <h2 className="font-display font-semibold text-secondary-800 mb-4 text-sm">{t("products.detail.quote")}</h2>
              <p className="text-xs text-secondary-400 mb-4">{t("products.detail.quoteDesc")}</p>
              <button onClick={() => router.push("/contact")}
                className="w-full flex items-center justify-center gap-2 bg-primary-500 text-white py-3 rounded-xl text-sm font-medium hover:bg-primary-600 transition-all shadow-sm hover:shadow-md">
                <ExternalLink className="w-4 h-4" /> {t("products.detail.requestQuoteBtn")}
              </button>
              {/* Price hint */}
              {product.listPrice && product.listPrice !== "nan" && product.listPrice !== "下架" && (
                <div className="mt-4 pt-4 border-t border-secondary-100/50">
                  <div className="text-[10px] font-mono text-secondary-400 uppercase tracking-wider mb-1">{lang === "en" ? "List Price" : "目录价"}</div>
                  <div className="text-lg font-display font-bold text-primary-600">¥{product.listPrice}</div>
                  {product.dailyPrice && product.dailyPrice !== "nan" && (
                    <div className="text-xs text-secondary-400 mt-1">{lang === "en" ? "Daily Price" : "日询价"}: ¥{product.dailyPrice}</div>
                  )}
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="bg-white border border-secondary-100/50 rounded-2xl p-6 shadow-sm">
              <h2 className="font-display font-semibold text-secondary-800 mb-4 text-sm">{t("products.detail.contact")}</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-secondary-400">
                  <Mail className="w-3.5 h-3.5 text-primary-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-secondary-600 font-medium">{t("products.detail.sales")}</div>
                    sales@cobioer.com
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-secondary-400">
                  <Mail className="w-3.5 h-3.5 text-primary-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-secondary-600 font-medium">{t("products.detail.technical")}</div>
                    tech@cobioer.com
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-secondary-400">
                  <Phone className="w-3.5 h-3.5 text-primary-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-secondary-600 font-medium">{t("products.detail.hotline")}</div>
                    400-8750-250
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white border border-secondary-100/50 rounded-2xl p-6 shadow-sm">
              <h2 className="font-display font-semibold text-secondary-800 mb-4 text-sm">{t("products.detail.documents")}</h2>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-secondary-500 hover:text-primary-600 hover:bg-primary-50/50 transition-all border border-secondary-100/50">
                  <FileText className="w-4 h-4" /> {t("products.detail.specSheet")}
                </button>
                <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-secondary-500 hover:text-primary-600 hover:bg-primary-50/50 transition-all border border-secondary-100/50">
                  <Download className="w-4 h-4" /> {t("products.detail.coa")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
