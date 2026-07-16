"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, Download, FileText, KeyRound, Loader2, LogOut, RefreshCw, Search } from "lucide-react";

type Lead = { full_name: string; email: string; company?: string; country?: string };
type Item = { product_id: string; product_name: string; quantity: number; unit_price: number; line_total: number };
type Quote = {
  id: string;
  quote_number: string;
  public_token: string;
  currency: string;
  subtotal: number;
  discount_amount: number;
  total: number;
  status: string;
  valid_until: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  leads: Lead | Lead[];
  quote_items: Item[];
};

const statuses = ["draft", "sent", "accepted", "expired", "cancelled"];
const statusStyles: Record<string, string> = {
  draft: "bg-secondary-100 text-secondary-600",
  sent: "bg-blue-50 text-blue-700",
  accepted: "bg-emerald-50 text-emerald-700",
  expired: "bg-amber-50 text-amber-700",
  cancelled: "bg-red-50 text-red-700",
};

const quoteLead = (quote: Quote) => Array.isArray(quote.leads) ? quote.leads[0] : quote.leads;
const csvCell = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;

export default function QuoteHistory() {
  const [key, setKey] = useState("");
  const [draftKey, setDraftKey] = useState("");
  const [items, setItems] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [copiedId, setCopiedId] = useState("");

  useEffect(() => setKey(sessionStorage.getItem("cobioer_admin_key") || ""), []);

  async function load(activeKey = key) {
    if (!activeKey) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/quotes", {
        headers: { Authorization: `Bearer ${activeKey}` },
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to load quotes.");
      setItems(result.data || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load quotes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (key) void load(key); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [key]);

  const visibleItems = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter(quote => {
      if (status && quote.status !== status) return false;
      if (!needle) return true;
      const lead = quoteLead(quote);
      return [
        quote.quote_number,
        lead?.full_name,
        lead?.email,
        lead?.company,
        lead?.country,
        ...quote.quote_items.flatMap(item => [item.product_id, item.product_name]),
      ].some(value => String(value || "").toLowerCase().includes(needle));
    });
  }, [items, query, status]);

  const summary = useMemo(
    () => Object.fromEntries(statuses.map(current => [current, items.filter(item => item.status === current).length])),
    [items],
  );

  function signIn() {
    const value = draftKey.trim();
    if (!value) return;
    sessionStorage.setItem("cobioer_admin_key", value);
    setKey(value);
  }

  function signOut() {
    sessionStorage.removeItem("cobioer_admin_key");
    setKey("");
    setItems([]);
  }

  async function updateStatus(id: string, nextStatus: string) {
    setUpdatingId(id);
    setError("");
    try {
      const response = await fetch(`/api/admin/quotes/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to update quote.");
      setItems(current => current.map(item => item.id === id ? { ...item, status: nextStatus, updated_at: result.data.updated_at } : item));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update quote.");
    } finally {
      setUpdatingId("");
    }
  }

  function pdfPath(quote: Quote) {
    return `/api/quotes/${encodeURIComponent(quote.quote_number)}/pdf?token=${encodeURIComponent(quote.public_token)}`;
  }

  async function copyQuoteLink(quote: Quote) {
    const url = new URL(pdfPath(quote), window.location.origin).href;
    try {
      if (!navigator.clipboard) throw new Error("CLIPBOARD_UNAVAILABLE");
      await navigator.clipboard.writeText(url);
    } catch {
      const fallback = document.createElement("textarea");
      fallback.value = url;
      fallback.style.position = "fixed";
      fallback.style.opacity = "0";
      document.body.appendChild(fallback);
      fallback.select();
      const copied = document.execCommand("copy");
      fallback.remove();
      if (!copied) {
        setError("Unable to copy the PDF link. Open the PDF and copy the address from your browser.");
        return;
      }
    }
    setCopiedId(quote.id);
    window.setTimeout(() => setCopiedId(current => current === quote.id ? "" : current), 2_000);
  }

  function exportCsv() {
    const rows = [["Quote", "Created", "Valid until", "Status", "Customer", "Email", "Company", "Country", "Products", "Currency", "Subtotal", "Discount", "Total"]];
    for (const quote of visibleItems) {
      const lead = quoteLead(quote);
      rows.push([
        quote.quote_number,
        quote.created_at,
        quote.valid_until,
        quote.status,
        lead?.full_name || "",
        lead?.email || "",
        lead?.company || "",
        lead?.country || "",
        quote.quote_items.map(item => `${item.product_id} x ${item.quantity}`).join("; "),
        quote.currency,
        String(quote.subtotal),
        String(quote.discount_amount),
        String(quote.total),
      ]);
    }
    const csv = rows.map(row => row.map(csvCell).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `cobioer-quotes-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!key) {
    return <div className="mx-auto max-w-md rounded-2xl border border-secondary-200 bg-white p-8 shadow-sm">
      <KeyRound className="mb-4 h-8 w-8 text-primary-600" />
      <h1 className="text-2xl font-bold">Quote workspace</h1>
      <p className="mt-2 text-sm text-secondary-500">Use the same access key as the sales workspace. It is stored only for this browser session.</p>
      <input type="password" value={draftKey} onChange={event => setDraftKey(event.target.value)} onKeyDown={event => event.key === "Enter" && signIn()} className="mt-5 w-full rounded-xl border border-secondary-200 px-4 py-3" placeholder="Admin access key" />
      <button onClick={signIn} className="mt-3 w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white">Open quote workspace</button>
    </div>;
  }

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600"><ArrowLeft className="h-3 w-3" />Customer inquiries</Link>
        <h1 className="mt-2 text-3xl font-bold text-secondary-900">Quote workspace</h1>
        <p className="mt-1 text-sm text-secondary-500">Manage formal quotations and share secured PDF links.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={exportCsv} disabled={!visibleItems.length} className="inline-flex items-center gap-2 rounded-xl border border-secondary-200 bg-white px-3 py-2 text-xs font-semibold text-secondary-600 disabled:opacity-40"><Download className="h-4 w-4" />Export CSV</button>
        <button onClick={() => load()} className="inline-flex items-center gap-2 rounded-xl border border-secondary-200 bg-white px-3 py-2 text-xs font-semibold text-secondary-600">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}Refresh</button>
        <button onClick={signOut} className="inline-flex items-center gap-2 rounded-xl border border-secondary-200 bg-white px-3 py-2 text-xs font-semibold text-secondary-600"><LogOut className="h-4 w-4" />Sign out</button>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      {statuses.map(current => <button key={current} onClick={() => setStatus(status === current ? "" : current)} className={`rounded-xl border p-4 text-left transition ${status === current ? "border-primary-300 bg-primary-50" : "border-secondary-100 bg-white hover:border-primary-200"}`}><span className="block text-xs capitalize text-secondary-500">{current}</span><strong className="mt-1 block text-2xl text-secondary-900">{summary[current] || 0}</strong></button>)}
    </div>

    <div className="relative">
      <Search className="absolute left-3.5 top-3 h-4 w-4 text-secondary-300" />
      <input value={query} onChange={event => setQuery(event.target.value)} className="w-full rounded-xl border border-secondary-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100" placeholder="Search quote, customer, email, company or product" />
    </div>

    {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    <div className="space-y-3">
      {visibleItems.map(quote => {
        const lead = quoteLead(quote);
        const expired = quote.status !== "accepted" && quote.status !== "cancelled" && quote.valid_until < new Date().toISOString().slice(0, 10);
        return <article key={quote.id} className="rounded-2xl border border-secondary-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-5 lg:flex-row">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <FileText className="h-4 w-4 text-primary-600" />
                <span className="font-mono text-xs font-bold text-primary-700">{quote.quote_number}</span>
                <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${statusStyles[quote.status] || statusStyles.draft}`}>{quote.status}</span>
                {expired && <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold uppercase text-amber-700">past validity</span>}
              </div>
              <h2 className="mt-3 font-semibold text-secondary-900">{lead?.company || lead?.full_name}</h2>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-secondary-500"><a href={`mailto:${lead?.email}`} className="font-medium text-primary-600">{lead?.email}</a>{lead?.country && <span>{lead.country}</span>}</div>
              <div className="mt-4 space-y-1.5">{quote.quote_items?.map(item => <p key={`${item.product_id}-${item.quantity}`} className="text-xs text-secondary-500"><span className="font-mono font-semibold text-secondary-700">{item.product_id}</span> · {item.product_name} × {item.quantity}</p>)}</div>
              {quote.notes && <p className="mt-3 max-w-2xl whitespace-pre-wrap text-xs leading-relaxed text-secondary-400">{quote.notes}</p>}
            </div>
            <div className="w-full shrink-0 lg:w-72 lg:text-right">
              <p className="text-xs text-secondary-400">Created {new Date(quote.created_at).toLocaleDateString()}</p>
              <p className="mt-2 text-2xl font-bold text-secondary-900">{quote.currency} {Number(quote.total).toFixed(2)}</p>
              <p className="text-xs text-secondary-400">Valid until {quote.valid_until}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <a href={pdfPath(quote)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-700"><Download className="h-3.5 w-3.5" />PDF</a>
                <button onClick={() => copyQuoteLink(quote)} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-secondary-200 px-3 py-2 text-xs font-semibold text-secondary-600">{copiedId === quote.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}{copiedId === quote.id ? "Copied" : "Copy link"}</button>
              </div>
              <div className="relative mt-2">
                <select value={quote.status} disabled={updatingId === quote.id} onChange={event => updateStatus(quote.id, event.target.value)} className="h-10 w-full rounded-lg border border-secondary-200 bg-white px-3 text-xs font-semibold capitalize text-secondary-600 disabled:opacity-50">{statuses.map(current => <option key={current}>{current}</option>)}</select>
                {updatingId === quote.id && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-primary-600" />}
              </div>
            </div>
          </div>
        </article>;
      })}
      {!loading && !error && visibleItems.length === 0 && <div className="rounded-2xl border border-dashed border-secondary-200 p-16 text-center text-sm text-secondary-400">No quotes match the current filters.</div>}
    </div>
  </div>;
}
