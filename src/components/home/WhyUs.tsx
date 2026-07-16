"use client";
import { CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
const reasons = [
  ["home.why.documented", "home.why.documentedDesc"],
  ["home.why.responsive", "home.why.responsiveDesc"],
  ["home.why.coverage", "home.why.coverageDesc"],
  ["home.why.partnership", "home.why.partnershipDesc"],
];
const badges = ["home.why.iso13485", "home.why.iso9001", "home.why.traceability", "home.why.globalSupport"];
export default function WhyUs() { const { t } = useI18n(); return <section className="section-padding bg-neutral-50"><div className="container-page"><div className="mb-12 text-center"><h2 className="heading-2 mb-4">{t("home.why.title")}</h2><p className="body-text mx-auto max-w-2xl">{t("home.why.description")}</p></div><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">{reasons.map(reason => <div key={reason[0]} className="rounded-xl border border-neutral-100 bg-white p-6"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50"><CheckCircle2 className="h-5 w-5 text-emerald-600" /></div><h3 className="text-lg font-semibold text-neutral-800">{t(reason[0])}</h3><p className="mt-2 text-sm leading-relaxed text-neutral-500">{t(reason[1])}</p></div>)}</div><div className="mt-12 flex flex-wrap justify-center gap-3">{badges.map(item => <span key={item} className="inline-flex items-center gap-2 rounded-lg border border-neutral-100 bg-white px-4 py-2.5 text-xs font-medium text-neutral-600"><CheckCircle2 className="h-4 w-4 text-emerald-500" />{t(item)}</span>)}</div></div></section>; }
