"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X, SlidersHorizontal, ChevronLeft, ChevronRight, FlaskConical, Dna, Microscope, Beaker, ShieldCheck, ArrowRight, ChevronDown, Bug } from "lucide-react";
import { productCategories } from "@/data/products";
import { useI18n } from "@/lib/i18n";

const CAT_ICONS: Record<string, React.ReactNode> = {
  "research-cells": <Microscope className="w-4 h-4" />,
  "gpcr-targets": <Dna className="w-4 h-4" />,
  "kinase-cells": <FlaskConical className="w-4 h-4" />,
  "immunotherapy-cells": <ShieldCheck className="w-4 h-4" />,
  "taa-mouse": <Beaker className="w-4 h-4" />,
  "tracer-cells": <Dna className="w-4 h-4" />,
  "drug-resistant": <Beaker className="w-4 h-4" />,
  "signaling-pathway": <Dna className="w-4 h-4" />,
  "nuclear-receptor": <FlaskConical className="w-4 h-4" />,
  "other-stable": <Beaker className="w-4 h-4" />,
  "diagnostic-standards": <ShieldCheck className="w-4 h-4" />,
};
function CatIcon({ id }: { id: string }) { return CAT_ICONS[id] || <Beaker className="w-4 h-4" />; }

export default function ProductsPage() {
  const { lang, t } = useI18n();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSub, setSelectedSub] = useState("all");
  const [page, setPage] = useState(1);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pageSize = 24;

  // Compute all items with full category info
  const allItems = useMemo(() => {
    if (!productCategories || !Array.isArray(productCategories) || productCategories.length === 0) {
      console.warn("ProductsPage: productCategories is empty or invalid");
      return [];
    }
    return productCategories.flatMap(cat =>
      (cat.items || []).flatMap(sub =>
        (sub.products || []).map(p => ({
          ...p,
          catTitle: cat.title, catTitleEn: cat.titleEn,
          catId: cat.id, subId: sub.id, subName: sub.name, subNameEn: sub.nameEn,
        }))
      )
    );
  }, []);

  // Filter by search + category
  const filtered = useMemo(() => {
    let items = allItems;
    const q = search.toLowerCase().trim();
    if (q) {
      items = items.filter(p =>
        p.id.toLowerCase().includes(q) ||
        (p.name || "").toLowerCase().includes(q) ||
        (p.nameEn || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.tags || []).some((tag: string) => tag.toLowerCase().includes(q))
      );
    }
    if (selectedCategory !== "all") {
      items = items.filter(p => p.catId === selectedCategory);
    }
    if (selectedSub !== "all") {
      items = items.filter(p => (p.subId || "") === selectedSub || (p.subName || "") === selectedSub);
    }
    return items;
  }, [search, selectedCategory, selectedSub, allItems]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = useMemo(() => filtered.slice((safePage - 1) * pageSize, safePage * pageSize), [filtered, safePage, pageSize]);

  // Category counts
  const catCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const cat of productCategories || []) {
      const total = (cat.items || []).reduce((s, i) => s + (i.products || []).length, 0);
      m[cat.id] = total;
    }
    return m;
  }, []);

  const fmtName = (p: any) => lang === "en" && p.nameEn ? p.nameEn : p.name;
  const fmtDesc = (p: any) => lang === "en" && p.descriptionEn ? p.descriptionEn : p.description;
  const fmtTags = (p: any) => lang === "en" && p.tagsEn && p.tagsEn.length > 0 ? p.tagsEn : p.tags || [];
  const fmtApps = (p: any) => lang === "en" && p.applicationsEn && p.applicationsEn.length > 0 ? p.applicationsEn : p.applications || [];

  const activeCatTitle = selectedCategory !== "all"
    ? (productCategories || []).find(c => c.id === selectedCategory)?.title || ""
    : t("products.title");

  if (!productCategories || productCategories.length === 0) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="text-center">
          <Bug className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
          <h2 className="font-display text-lg font-semibold text-secondary-600 mb-2">Data Loading Error</h2>
          <p className="text-sm text-secondary-400">Product catalog is temporarily unavailable. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-[var(--color-bg)]">
      {/* Header Banner */}
      <div className="gradient-hero">
        <div className="container-page py-12 md:py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-primary-200 text-xs font-mono mb-3">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>COBIOER PRODUCTS ? {allItems.length.toLocaleString()} {t("products.results")}</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
              {t("products.title")}
            </h1>
            <p className="text-primary-200/80 text-sm md:text-base max-w-xl leading-relaxed">
              {t("home.hero.subtitle")}
            </p>
          </div>
          {/* Quick category chips */}
          <div className="flex flex-wrap gap-2 mt-6">
            {(productCategories || []).slice(0, 6).map(cat => (
              <button key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setSelectedSub("all"); setPage(1); }}
                className={"flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border " +
                  (selectedCategory === cat.id
                    ? "bg-white/15 text-white border-white/30"
                    : "bg-white/5 text-primary-200/80 border-white/10 hover:bg-white/10 hover:text-white")}
              >
                <CatIcon id={cat.id} />
                <span>{cat.title}</span>
                <span className="opacity-60">({catCounts[cat.id] || 0})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-page py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-xs text-secondary-400">
            <span className="text-secondary-600 font-medium">{activeCatTitle}</span>
            {selectedSub !== "all" && <><span className="text-secondary-300">/</span><span>{selectedSub}</span></>}
            <span className="ml-2 px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 text-[10px] font-mono font-medium">
              {filtered.length} {t("products.results")}
            </span>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className={"fixed inset-0 z-40 md:relative md:inset-auto md:z-auto " + (mobileOpen ? "block" : "hidden md:block")}>
            {mobileOpen && <div className="fixed inset-0 bg-black/30 md:hidden" onClick={() => setMobileOpen(false)} />}
            <div className="relative w-72 max-w-[85vw] h-full md:h-auto bg-white md:bg-transparent overflow-y-auto md:overflow-visible p-6 md:p-0">
              <div className="flex items-center justify-between mb-4 md:hidden">
                <span className="text-sm font-semibold text-secondary-700">{t("products.filterCategories")}</span>
                <button onClick={() => setMobileOpen(false)} className="p-1 text-secondary-400"><X className="w-5 h-5" /></button>
              </div>
              <div className="md:sticky md:top-28 space-y-0.5">
                <button onClick={() => { setSelectedCategory("all"); setSelectedSub("all"); setPage(1); setMobileOpen(false); }}
                  className={"w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center justify-between " +
                    (selectedCategory === "all" ? "bg-primary-50 text-primary-700 border border-primary-200/50 font-semibold" : "text-secondary-500 hover:bg-secondary-50/50")}>
                  <span>{t("products.all")}</span>
                  <span className="text-[10px] font-mono bg-secondary-100/50 text-secondary-400 px-2 py-0.5 rounded-full">{allItems.length}</span>
                </button>
                {(productCategories || []).map(cat => {
                  const isActive = selectedCategory === cat.id;
                  const total = (cat.items || []).reduce((s, i) => s + (i.products || []).length, 0);
                  return (
                    <div key={cat.id}>
                      <button onClick={() => { setSelectedCategory(isActive ? "all" : cat.id); setSelectedSub("all"); setPage(1); }}
                        className={"w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center justify-between " +
                          (isActive ? "bg-primary-50 text-primary-700 border border-primary-200/50 font-semibold" : "text-secondary-500 hover:bg-secondary-50/50")}>
                        <div className="flex items-center gap-2">
                          <span className={isActive ? "text-primary-500" : "text-secondary-300"}><CatIcon id={cat.id} /></span>
                          <span>{cat.title}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={"text-[10px] font-mono px-1.5 py-0.5 rounded-full " + (isActive ? "bg-primary-100 text-primary-600" : "bg-secondary-100/50 text-secondary-400")}>{total}</span>
                          <ChevronDown className={"w-3 h-3 transition-transform " + (isActive ? "rotate-180 text-primary-400" : "text-secondary-300")} />
                        </div>
                      </button>
                      {isActive && (
                        <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-primary-100/50 pl-3">
                          {(cat.items || []).map(sub => {
                            const subActive = selectedSub === sub.id;
                            return (
                              <button key={sub.id}
                                onClick={() => { setSelectedSub(subActive ? "all" : sub.id); setPage(1); }}
                                className={"w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between " +
                                  (subActive ? "bg-primary-50/50 text-primary-600 font-medium" : "text-secondary-400 hover:text-secondary-600")}>
                                <span>{sub.name}</span>
                                <span className="text-[10px] text-secondary-300 font-mono">{(sub.products || []).length}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300" />
                <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder={t("products.search")}
                  className="w-full pl-10 pr-9 py-2.5 bg-white border border-secondary-200/50 rounded-xl text-sm text-secondary-700 placeholder-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all shadow-sm" />
                {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-300 hover:text-secondary-500"><X className="w-4 h-4" /></button>}
              </div>
              <button onClick={() => setMobileOpen(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-secondary-200/50 rounded-xl text-sm text-secondary-500 hover:text-primary-600 transition-all shadow-sm">
                <SlidersHorizontal className="w-4 h-4" /> {t("products.filterCategories")}
              </button>
            </div>

            {paged.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {paged.map(p => (
                    <div key={p.id} onClick={() => router.push("/products/" + p.id)}
                      className="card-science group cursor-pointer overflow-hidden">
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-[10px] font-mono text-primary-600 bg-primary-50 px-2 py-1 rounded-md font-semibold tracking-wide">{p.id}</span>
                          <span className="text-[10px] text-secondary-300">{p.catTitle}</span>
                        </div>
                        <h3 className="font-display font-semibold text-sm text-secondary-800 leading-snug mb-2 group-hover:text-primary-600 transition-colors">
                          {lang === "en" && p.nameEn ? p.nameEn : p.name}
                        </h3>
                        <p className="text-xs text-secondary-400 leading-relaxed line-clamp-2 mb-3">
                          {fmtDesc(p)}
                        </p>
                        {fmtTags(p).length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {fmtTags(p).slice(0, 3).map((tag: string, i: number) => (
                              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary-50 text-secondary-500 border border-secondary-100/50">{tag}</span>
                            ))}
                            {fmtTags(p).length > 3 && <span className="text-[10px] text-secondary-300">+{fmtTags(p).length - 3}</span>}
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t border-secondary-100/50">
                          <div className="flex items-center gap-1.5 text-[10px] font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            {t("products.viewDetail")} <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 mt-10">
                    <button onClick={() => setPage(Math.max(1, safePage - 1))} disabled={safePage <= 1}
                      className="p-2 text-secondary-400 hover:text-primary-600 disabled:opacity-30 rounded-lg hover:bg-primary-50 transition-all">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let pg: number;
                      if (totalPages <= 7) pg = i + 1;
                      else if (safePage <= 4) pg = i + 1;
                      else if (safePage >= totalPages - 3) pg = totalPages - 6 + i;
                      else pg = safePage - 3 + i;
                      return (
                        <button key={pg} onClick={() => setPage(pg)}
                          className={"min-w-[34px] h-8 text-xs rounded-lg font-medium transition-all " +
                            (pg === safePage ? "bg-primary-500 text-white shadow-sm" : "text-secondary-500 hover:bg-primary-50 hover:text-primary-600")}>{pg}</button>
                      );
                    })}
                    <button onClick={() => setPage(Math.min(totalPages, safePage + 1))} disabled={safePage >= totalPages}
                      className="p-2 text-secondary-400 hover:text-primary-600 disabled:opacity-30 rounded-lg hover:bg-primary-50 transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-secondary-100/50">
                <Search className="w-10 h-10 text-secondary-200 mx-auto mb-4" />
                <h3 className="font-display text-base font-semibold text-secondary-600 mb-2">{t("products.noResults")}</h3>
                <p className="text-sm text-secondary-400 mb-6">
                  {search ? "Try different keywords" : "Try adjusting or clearing filters"}
                </p>
                <button onClick={() => { setSearch(""); setSelectedCategory("all"); setSelectedSub("all"); setPage(1); }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-all border border-primary-200/50">
                  {t("products.clearFilters")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
