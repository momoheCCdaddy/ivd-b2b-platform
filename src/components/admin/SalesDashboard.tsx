"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, KeyRound, Loader2, LogOut, RefreshCw, Search } from "lucide-react";

type Lead = { id: string; email: string; full_name: string; company?: string; phone?: string; country?: string };
type Inquiry = { id: string; inquiry_number: string; product_id?: string; product_name?: string; quantity: number; currency: string; inquiry_type: string; message: string; status: string; locale: string; timezone?: string; created_at: string; leads: Lead | Lead[] };
const statuses = ["new", "qualified", "quoted", "won", "lost", "archived"];

export default function SalesDashboard() {
  const [key, setKey] = useState("");
  const [draftKey, setDraftKey] = useState("");
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => { setKey(sessionStorage.getItem("cobioer_admin_key") || ""); }, []);

  async function load(activeKey = key) {
    if (!activeKey) return;
    setLoading(true); setError("");
    const params = new URLSearchParams({ limit: "200" });
    if (query) params.set("q", query);
    if (status) params.set("status", status);
    try {
      const response = await fetch(`/api/admin/inquiries?${params}`, { headers: { Authorization: `Bearer ${activeKey}` }, cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to load inquiries.");
      setItems(result.data || []);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to load inquiries."); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (key) void load(key); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [key, status]);

  function signIn() { const value = draftKey.trim(); if (!value) return; sessionStorage.setItem("cobioer_admin_key", value); setKey(value); }
  function signOut() { sessionStorage.removeItem("cobioer_admin_key"); setKey(""); setItems([]); }

  async function updateStatus(id: string, nextStatus: string) {
    const response = await fetch(`/api/admin/inquiries/${id}`, { method: "PATCH", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ status: nextStatus }) });
    if (response.ok) setItems(current => current.map(item => item.id === id ? { ...item, status: nextStatus } : item));
  }

  const summary = useMemo(() => Object.fromEntries(statuses.map(s => [s, items.filter(i => i.status === s).length])), [items]);

  function exportCsv() {
    const rows = [["Inquiry", "Created", "Status", "Customer", "Email", "Company", "Country", "Product ID", "Product", "Quantity", "Currency", "Message"]];
    for (const i of items) { const lead = Array.isArray(i.leads) ? i.leads[0] : i.leads; rows.push([i.inquiry_number, i.created_at, i.status, lead?.full_name || "", lead?.email || "", lead?.company || "", lead?.country || "", i.product_id || "", i.product_name || "", String(i.quantity), i.currency, i.message]); }
    const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n");
    const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" })); link.download = `cobioer-inquiries-${new Date().toISOString().slice(0, 10)}.csv`; link.click(); URL.revokeObjectURL(link.href);
  }

  if (!key) return <div className="mx-auto max-w-md rounded-2xl border border-secondary-200 bg-white p-8 shadow-sm"><KeyRound className="mb-5 h-8 w-8 text-primary-600" /><h1 className="text-2xl font-bold text-secondary-900">Sales workspace</h1><p className="mt-2 text-sm text-secondary-500">Enter the server-configured access key. It is stored only for this browser session.</p><input type="password" value={draftKey} onChange={e => setDraftKey(e.target.value)} onKeyDown={e => e.key === "Enter" && signIn()} className="mt-6 w-full rounded-xl border border-secondary-200 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100" placeholder="Admin access key" /><button onClick={signIn} className="mt-3 w-full rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-700">Open workspace</button></div>;

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-xs font-semibold uppercase tracking-wider text-primary-600">Private sales workspace</p><h1 className="mt-1 text-3xl font-bold text-secondary-900">Customer inquiries</h1></div><div className="flex gap-2"><button onClick={exportCsv} className="flex items-center gap-2 rounded-lg border border-secondary-200 bg-white px-3 py-2 text-xs font-semibold text-secondary-600"><Download className="h-4 w-4" />Export CSV</button><button onClick={signOut} className="flex items-center gap-2 rounded-lg border border-secondary-200 bg-white px-3 py-2 text-xs font-semibold text-secondary-600"><LogOut className="h-4 w-4" />Sign out</button></div></div>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-6">{statuses.map(s => <button key={s} onClick={() => setStatus(status === s ? "" : s)} className={`rounded-xl border p-4 text-left ${status === s ? "border-primary-300 bg-primary-50" : "border-secondary-100 bg-white"}`}><span className="block text-xs capitalize text-secondary-500">{s}</span><strong className="mt-1 block text-2xl text-secondary-900">{summary[s] || 0}</strong></button>)}</div>
    <div className="flex gap-2"><div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-secondary-300" /><input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && load()} className="w-full rounded-xl border border-secondary-200 bg-white py-2.5 pl-10 pr-3 text-sm" placeholder="Search inquiry number, product ID or product name" /></div><button onClick={() => load()} className="rounded-xl bg-primary-600 px-4 text-white">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}</button></div>
    {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    <div className="space-y-3">{items.map(i => { const lead = Array.isArray(i.leads) ? i.leads[0] : i.leads; return <article key={i.id} className="rounded-2xl border border-secondary-100 bg-white p-5 shadow-sm"><div className="flex flex-col justify-between gap-3 lg:flex-row"><div><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-xs font-semibold text-primary-700">{i.inquiry_number}</span><span className="rounded-full bg-secondary-50 px-2 py-1 text-[10px] uppercase text-secondary-500">{i.inquiry_type}</span><span className="text-xs text-secondary-400">{new Date(i.created_at).toLocaleString()}</span></div><h2 className="mt-3 font-semibold text-secondary-900">{i.product_id || "General inquiry"}{i.product_name ? ` — ${i.product_name}` : ""}</h2><p className="mt-2 max-w-3xl whitespace-pre-wrap text-sm leading-relaxed text-secondary-600">{i.message}</p><div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-secondary-500"><span>{lead?.full_name}</span><a href={`mailto:${lead?.email}`} className="font-medium text-primary-600">{lead?.email}</a>{lead?.company && <span>{lead.company}</span>}{lead?.country && <span>{lead.country}</span>}<span>{i.quantity} · {i.currency}</span></div></div><select value={i.status} onChange={e => updateStatus(i.id, e.target.value)} className="h-10 rounded-lg border border-secondary-200 bg-white px-3 text-xs font-semibold capitalize text-secondary-600">{statuses.map(s => <option key={s}>{s}</option>)}</select></div></article>; })}{!loading && !error && items.length === 0 && <div className="rounded-2xl border border-dashed border-secondary-200 p-16 text-center text-sm text-secondary-400">No inquiries found.</div>}</div>
  </div>;
}

