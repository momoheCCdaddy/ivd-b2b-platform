"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Eye, EyeOff, KeyRound, Loader2, RefreshCw, Save } from "lucide-react";

type Category = {
  categoryId: string;
  defaultTitleEn: string;
  defaultTitleZh: string;
  titleEn: string;
  titleZh: string;
  visible: boolean;
  sortOrder: number;
  count: number;
};

export default function CategoryManager() {
  const [key, setKey] = useState("");
  const [draftKey, setDraftKey] = useState("");
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  useEffect(() => { setKey(sessionStorage.getItem("cobioer_admin_key") || ""); }, []);

  async function load(activeKey = key) {
    if (!activeKey) return;
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/admin/catalog-categories", { headers: { Authorization: `Bearer ${activeKey}` }, cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to load category settings.");
      setItems(result.data || []);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to load category settings."); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (key) void load(key); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [key]);

  function signIn() {
    const value = draftKey.trim();
    if (!value) return;
    sessionStorage.setItem("cobioer_admin_key", value);
    setKey(value);
  }

  function update(categoryId: string, change: Partial<Category>) {
    setItems(current => current.map(item => item.categoryId === categoryId ? { ...item, ...change } : item));
  }

  async function save(item: Category) {
    setSaving(item.categoryId); setError(""); setSaved("");
    try {
      const response = await fetch("/api/admin/catalog-categories", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save category settings.");
      setSaved(item.categoryId);
      window.setTimeout(() => setSaved(current => current === item.categoryId ? "" : current), 1800);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to save category settings."); }
    finally { setSaving(""); }
  }

  if (!key) return <div className="mx-auto max-w-md rounded-2xl border border-secondary-200 bg-white p-8 shadow-sm"><KeyRound className="mb-5 h-8 w-8 text-primary-600" /><h1 className="text-2xl font-bold text-secondary-900">Catalog management</h1><p className="mt-2 text-sm text-secondary-500">Use the same access key as the sales workspace.</p><input type="password" value={draftKey} onChange={e => setDraftKey(e.target.value)} onKeyDown={e => e.key === "Enter" && signIn()} className="mt-6 w-full rounded-xl border border-secondary-200 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100" placeholder="Admin access key" /><button onClick={signIn} className="mt-3 w-full rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-700">Open catalog management</button></div>;

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><Link href="/admin" className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600"><ArrowLeft className="h-3 w-3" />Inquiries</Link><p className="mt-4 text-xs font-semibold uppercase tracking-wider text-primary-600">Private catalog workspace</p><h1 className="mt-1 text-3xl font-bold text-secondary-900">Product categories</h1><p className="mt-2 max-w-2xl text-sm text-secondary-500">Control category order, customer-facing names and visibility. Hidden categories are removed from the public catalog, product pages and sitemap.</p></div><button onClick={() => load()} disabled={loading} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-secondary-200 bg-white px-4 text-xs font-semibold text-secondary-600 disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}Refresh</button></div>
    {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}{error.includes("Supabase") && <span className="mt-1 block text-xs">Apply the catalog category migration and configure the server environment before saving.</span>}</div>}
    <div className="overflow-hidden rounded-2xl border border-secondary-100 bg-white shadow-sm">
      <div className="hidden grid-cols-[80px_1fr_1fr_90px_110px] gap-4 border-b border-secondary-100 bg-secondary-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-secondary-400 lg:grid"><span>Order</span><span>English name</span><span>Chinese name</span><span>Products</span><span>Visibility</span></div>
      <div className="divide-y divide-secondary-100">{items.map(item => <div key={item.categoryId} className="grid gap-4 p-5 lg:grid-cols-[80px_1fr_1fr_90px_110px] lg:items-center">
        <label className="text-xs text-secondary-400"><span className="mb-1 block lg:hidden">Order</span><input type="number" min={0} max={10000} value={item.sortOrder} onChange={e => update(item.categoryId, { sortOrder: Number(e.target.value) })} className="w-full rounded-lg border border-secondary-200 px-3 py-2 text-sm text-secondary-700" /></label>
        <label><span className="mb-1 block text-xs text-secondary-400 lg:hidden">English name</span><input value={item.titleEn} onChange={e => update(item.categoryId, { titleEn: e.target.value })} placeholder={item.defaultTitleEn} className="w-full rounded-lg border border-secondary-200 px-3 py-2 text-sm text-secondary-700" /><span className="mt-1 block font-mono text-[10px] text-secondary-300">{item.categoryId}</span></label>
        <label><span className="mb-1 block text-xs text-secondary-400 lg:hidden">Chinese name</span><input value={item.titleZh} onChange={e => update(item.categoryId, { titleZh: e.target.value })} placeholder={item.defaultTitleZh} className="w-full rounded-lg border border-secondary-200 px-3 py-2 text-sm text-secondary-700" /></label>
        <div><span className="mb-1 block text-xs text-secondary-400 lg:hidden">Products</span><span className="rounded-full bg-secondary-50 px-3 py-1 text-xs font-semibold text-secondary-500">{item.count.toLocaleString()}</span></div>
        <div className="flex items-center justify-between gap-2 lg:block"><button type="button" onClick={() => update(item.categoryId, { visible: !item.visible })} className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${item.visible ? "bg-emerald-50 text-emerald-700" : "bg-secondary-100 text-secondary-500"}`}>{item.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}{item.visible ? "Visible" : "Hidden"}</button><button type="button" onClick={() => save(item)} disabled={saving === item.categoryId} className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50 lg:w-full lg:justify-center">{saving === item.categoryId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved === item.categoryId ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}{saved === item.categoryId ? "Saved" : "Save"}</button></div>
      </div>)}</div>
    </div>
  </div>;
}
