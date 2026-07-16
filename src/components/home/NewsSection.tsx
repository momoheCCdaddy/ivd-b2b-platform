"use client";
import Link from "next/link";
import { ArrowRight, BookOpen, Database, FileText } from "lucide-react";
import { useI18n } from "@/lib/i18n";
const updates = [
  { icon: Database, titleKey: "home.updates.catalog", descriptionKey: "home.updates.catalogDesc", href: "/products" },
  { icon: FileText, titleKey: "home.updates.quote", descriptionKey: "home.updates.quoteDesc", href: "/quote" },
  { icon: BookOpen, titleKey: "home.updates.resources", descriptionKey: "home.updates.resourcesDesc", href: "/tech-center" },
];
export default function NewsSection() { const { t } = useI18n(); return <section className="section-padding bg-white"><div className="container-page"><div className="mb-10 flex items-end justify-between gap-4"><div><p className="text-xs font-semibold tracking-[0.18em] text-primary-600">{t("home.updates.eyebrow")}</p><h2 className="heading-2 mt-2">{t("home.updates.title")}</h2></div><Link href="/news" className="hidden items-center gap-1 text-sm font-semibold text-primary-600 sm:flex">{t("home.updates.viewAll")}<ArrowRight className="h-4 w-4" /></Link></div><div className="grid gap-5 md:grid-cols-3">{updates.map(item => <Link href={item.href} key={item.titleKey} className="group rounded-2xl border border-secondary-100 p-6 transition hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"><item.icon className="h-6 w-6 text-primary-600" /><h3 className="mt-5 font-display text-lg font-bold text-secondary-900 group-hover:text-primary-600">{t(item.titleKey)}</h3><p className="mt-3 text-sm leading-relaxed text-secondary-500">{t(item.descriptionKey)}</p><span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-primary-600">{t("home.updates.learnMore")}<ArrowRight className="h-3 w-3" /></span></Link>)}</div></div></section>; }
