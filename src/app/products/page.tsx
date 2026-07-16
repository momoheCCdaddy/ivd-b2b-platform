"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Beaker, ChevronDown, ChevronLeft, ChevronRight, Dna, FlaskConical, Loader2, Microscope, Search, ShieldCheck, SlidersHorizontal, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type CategoryMeta = { id: string; title: string; titleEn: string; count: number; items: Array<{ id: string; name: string; nameEn: string; count: number }> };
type CatalogItem = { id: string; name: string; nameEn?: string; description?: string; descriptionEn?: string; tags?: string[]; tagsEn?: string[]; applications?: string[]; applicationsEn?: string[]; catId: string; catTitle: string; catTitleEn: string; subId: string; subName: string; subNameEn: string };

const icons: Record<string, React.ReactNode> = {
  "research-cells": <Microscope className="h-4 w-4" />, "gpcr-targets": <Dna className="h-4 w-4" />,
  "kinase-cells": <FlaskConical className="h-4 w-4" />, "immunotherapy-cells": <ShieldCheck className="h-4 w-4" />,
  "diagnostic-standards": <ShieldCheck className="h-4 w-4" />,
};
const CatIcon = ({ id }: { id: string }) => <>{icons[id] || <Beaker className="h-4 w-4" />}</>;

function ProductsPageContent() {
  const { lang, t } = useI18n(); const router = useRouter(); const searchParams = useSearchParams(); const english = lang !== "zh";
  const [categories, setCategories] = useState<CategoryMeta[]>([]); const [catalogTotal, setCatalogTotal] = useState(0);
  const [items, setItems] = useState<CatalogItem[]>([]); const [total, setTotal] = useState(0); const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState(""); const [selectedCategory, setSelectedCategory] = useState("all"); const [selectedSub, setSelectedSub] = useState("all"); const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [mobileOpen, setMobileOpen] = useState(false); const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "all");
    setSelectedSub(searchParams.get("sub") || "all");
    setPage(1);
  }, [searchParams]);
  useEffect(() => { fetch("/api/products?mode=meta").then(r => r.json()).then(data => { setCategories(data.categories || []); setCatalogTotal(data.total || 0); }).catch(() => setError(t("products.categoriesUnavailable"))); }, [t]);
  useEffect(() => {
    const controller = new AbortController(); const timer = setTimeout(async () => {
      setLoading(true); setError("");
      const params = new URLSearchParams({ page: String(page), limit: "24" });
      if (search.trim()) params.set("q", search.trim()); if (selectedCategory !== "all") params.set("category", selectedCategory); if (selectedSub !== "all") params.set("sub", selectedSub);
      try { const response = await fetch(`/api/products?${params}`, { signal: controller.signal }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setItems(data.items || []); setTotal(data.total || 0); setTotalPages(data.totalPages || 1); if (data.page !== page) setPage(data.page); }
      catch (e) { if ((e as Error).name !== "AbortError") setError(t("products.loadError")); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }, search ? 250 : 0);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [search, selectedCategory, selectedSub, page, reloadKey, t]);

  const activeCategory = categories.find(category => category.id === selectedCategory);
  const pageNumbers = useMemo(() => Array.from({ length: Math.min(totalPages, 7) }, (_, i) => totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i), [page, totalPages]);
  const replaceCatalogUrl = (category: string, sub = "all") => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") params.delete("category"); else params.set("category", category);
    if (category === "all" || sub === "all") params.delete("sub"); else params.set("sub", sub);
    router.replace(`/products${params.size ? `?${params}` : ""}`, { scroll: false });
  };
  const selectCategory = (id: string) => { setSelectedCategory(id); setSelectedSub("all"); setPage(1); setMobileOpen(false); replaceCatalogUrl(id); };
  const selectSubcategory = (id: string) => { const next = selectedSub === id ? "all" : id; setSelectedSub(next); setPage(1); replaceCatalogUrl(selectedCategory, next); };
  const name = (item: CatalogItem) => english && item.nameEn ? item.nameEn : item.name;
  const description = (item: CatalogItem) => english && item.descriptionEn ? item.descriptionEn : item.description || "";
  const tags = (item: CatalogItem) => english && item.tagsEn?.length ? item.tagsEn : item.tags || [];

  return <div className="min-h-screen bg-[var(--color-bg)] pt-16">
    <section className="gradient-hero"><div className="container-page py-12 md:py-16"><div className="max-w-3xl"><div className="mb-3 flex items-center gap-2 font-mono text-xs text-primary-200"><FlaskConical className="h-3.5 w-3.5" />{t("products.catalogLabel")} · {catalogTotal.toLocaleString()} {t("products.results")}</div><h1 className="font-display text-3xl font-bold text-white md:text-4xl">{t("products.title")}</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary-200/80 md:text-base">{t("products.heroDescription")}</p></div><div className="mt-6 flex flex-wrap gap-2">{categories.slice(0, 6).map(category => <button key={category.id} onClick={() => selectCategory(category.id)} className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${selectedCategory === category.id ? "border-white/30 bg-white/15 text-white" : "border-white/10 bg-white/5 text-primary-200 hover:bg-white/10"}`}><CatIcon id={category.id} />{english ? category.titleEn : category.title}<span className="opacity-60">({category.count})</span></button>)}</div></div></section>
    <div className="container-page py-8">
      <div className="mb-6 flex items-center justify-between"><div className="flex items-center gap-2 text-xs text-secondary-400"><span className="font-medium text-secondary-600">{activeCategory ? (english ? activeCategory.titleEn : activeCategory.title) : t("products.all")}</span><span className="rounded-full bg-primary-50 px-2 py-0.5 font-mono text-[10px] font-medium text-primary-600">{total.toLocaleString()} {t("products.results")}</span></div></div>
      <div className="flex gap-8">
        <aside className={`fixed inset-0 z-40 md:relative md:inset-auto md:z-auto ${mobileOpen ? "block" : "hidden md:block"}`}>{mobileOpen && <div className="fixed inset-0 bg-black/30 md:hidden" onClick={() => setMobileOpen(false)} />}<div className="relative h-full w-72 max-w-[85vw] overflow-y-auto bg-white p-6 md:h-auto md:overflow-visible md:bg-transparent md:p-0"><div className="mb-4 flex items-center justify-between md:hidden"><span className="text-sm font-semibold">{t("products.filterCategories")}</span><button onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></button></div><div className="space-y-0.5 md:sticky md:top-28">
          <button onClick={() => selectCategory("all")} className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm ${selectedCategory === "all" ? "border border-primary-200/50 bg-primary-50 font-semibold text-primary-700" : "text-secondary-500 hover:bg-secondary-50"}`}><span>{t("products.all")}</span><span className="rounded-full bg-secondary-100/50 px-2 py-0.5 font-mono text-[10px] text-secondary-400">{catalogTotal}</span></button>
          {categories.map(category => { const active = selectedCategory === category.id; return <div key={category.id}><button onClick={() => selectCategory(active ? "all" : category.id)} className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm ${active ? "border border-primary-200/50 bg-primary-50 font-semibold text-primary-700" : "text-secondary-500 hover:bg-secondary-50"}`}><span className="flex items-center gap-2"><span className={active ? "text-primary-500" : "text-secondary-300"}><CatIcon id={category.id} /></span>{english ? category.titleEn : category.title}</span><span className="flex items-center gap-1"><span className="rounded-full bg-secondary-100/50 px-1.5 py-0.5 font-mono text-[10px]">{category.count}</span><ChevronDown className={`h-3 w-3 ${active ? "rotate-180" : ""}`} /></span></button>{active && <div className="ml-4 border-l-2 border-primary-100/50 pl-3">{category.items.map(sub => <button key={sub.id} onClick={() => selectSubcategory(sub.id)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs ${selectedSub === sub.id ? "bg-primary-50 text-primary-600" : "text-secondary-400 hover:text-secondary-600"}`}><span>{english ? sub.nameEn : sub.name}</span><span className="font-mono text-[10px]">{sub.count}</span></button>)}</div>}</div>; })}
        </div></div></aside>
        <main className="min-w-0 flex-1"><div className="mb-6 flex items-center gap-3"><div className="relative max-w-xl flex-1"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-300" /><input value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} placeholder={t("products.searchPlaceholder")} className="w-full rounded-xl border border-secondary-200/50 bg-white py-2.5 pl-10 pr-9 text-sm shadow-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20" />{search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="h-4 w-4 text-secondary-300" /></button>}</div><button onClick={() => setMobileOpen(true)} className="flex items-center gap-2 rounded-xl border border-secondary-200 bg-white px-4 py-2.5 text-sm text-secondary-500 shadow-sm md:hidden"><SlidersHorizontal className="h-4 w-4" />{t("products.filters")}</button></div>
          {error ? <div className="rounded-2xl border border-red-100 bg-red-50 p-10 text-center text-sm text-red-700">{error}<button onClick={() => setReloadKey(current => current + 1)} className="ml-2 font-semibold underline">{t("products.retry")}</button></div> : loading ? <div className="flex min-h-[420px] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-primary-500" /></div> : items.length ? <><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map(item => <article key={item.id} onClick={() => router.push(`/products/${encodeURIComponent(item.id)}`)} className="card-science group cursor-pointer overflow-hidden p-5"><div className="mb-3 flex items-start justify-between gap-2"><span className="rounded-md bg-primary-50 px-2 py-1 font-mono text-[10px] font-semibold text-primary-600">{item.id}</span><span className="text-right text-[10px] text-secondary-300">{english ? item.catTitleEn : item.catTitle}</span></div><h2 className="mb-2 font-display text-sm font-semibold leading-snug text-secondary-800 transition group-hover:text-primary-600">{name(item)}</h2><p className="mb-3 line-clamp-2 text-xs leading-relaxed text-secondary-400">{description(item)}</p><div className="mb-3 flex flex-wrap gap-1">{tags(item).slice(0, 3).map(tag => <span key={tag} className="rounded-full border border-secondary-100 bg-secondary-50 px-2 py-0.5 text-[10px] text-secondary-500">{tag}</span>)}</div><div className="flex items-center gap-1.5 border-t border-secondary-100/50 pt-3 text-[10px] font-medium text-primary-600 opacity-0 transition group-hover:opacity-100">{t("products.viewDetail")}<ArrowRight className="h-3 w-3" /></div></article>)}</div>{totalPages > 1 && <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Product pagination"><button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg p-2 disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>{pageNumbers.map(number => <button key={number} onClick={() => setPage(number)} className={`h-8 min-w-8 rounded-lg text-xs font-medium ${number === page ? "bg-primary-500 text-white" : "text-secondary-500 hover:bg-primary-50"}`}>{number}</button>)}<button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="rounded-lg p-2 disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button></nav>}</> : <div className="rounded-2xl border border-secondary-100 bg-white py-20 text-center"><Search className="mx-auto mb-4 h-10 w-10 text-secondary-200" /><h2 className="font-semibold text-secondary-600">{t("products.noResults")}</h2><button onClick={() => { setSearch(""); selectCategory("all"); }} className="mt-5 rounded-lg bg-primary-50 px-4 py-2 text-sm font-medium text-primary-600">{t("products.clearFilters")}</button></div>}
        </main>
      </div>
    </div>
  </div>;
}

export default function ProductsPage() {
  return <Suspense fallback={<div className="min-h-screen bg-[var(--color-bg)] pt-16"><div className="container-page flex min-h-[560px] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-primary-500" /></div></div>}><ProductsPageContent /></Suspense>;
}
