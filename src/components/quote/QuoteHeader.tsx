"use client";
import { useI18n } from "@/lib/i18n";
export default function QuoteHeader() { const { t } = useI18n(); return <section className="container-page py-10 text-center"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">{t("quote.eyebrow")}</p><h1 className="mt-3 font-display text-4xl font-bold text-secondary-900">{t("quote.title")}</h1><p className="mx-auto mt-4 max-w-2xl text-secondary-500">{t("quote.description")}</p></section>; }
