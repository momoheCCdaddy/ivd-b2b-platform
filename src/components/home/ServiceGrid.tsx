"use client";
import Link from "next/link";
import { Activity, ArrowRight, Crosshair, Dna, Factory } from "lucide-react";
import { useI18n } from "@/lib/i18n";
const services = [
  { icon: Dna, titleKey: "home.services.cellEngineering", descriptionKey: "home.services.cellEngineeringDesc", href: "/services#platforms" },
  { icon: Crosshair, titleKey: "home.services.targetModels", descriptionKey: "home.services.targetModelsDesc", href: "/services#platforms" },
  { icon: Activity, titleKey: "home.services.efficacy", descriptionKey: "home.services.efficacyDesc", href: "/services#platforms" },
  { icon: Factory, titleKey: "home.services.ivd", descriptionKey: "home.services.ivdDesc", href: "/services#platforms" },
];
export default function ServiceGrid() { const { t } = useI18n(); return <section className="section-padding bg-white"><div className="container-page"><div className="mb-12 text-center"><h2 className="heading-2 mb-4">{t("home.services.title")}</h2><p className="body-text mx-auto max-w-2xl">{t("home.services.description")}</p></div><div className="grid gap-6 md:grid-cols-2">{services.map(item => <Link key={item.titleKey} href={item.href} className="group flex gap-5 rounded-xl border border-neutral-100 bg-white p-6 transition hover:-translate-y-0.5 hover:border-primary-100 hover:shadow-md"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-50"><item.icon className="h-6 w-6 text-primary-500" /></div><div><h3 className="text-lg font-semibold text-neutral-800 group-hover:text-primary-500">{t(item.titleKey)}</h3><p className="mt-2 text-sm leading-relaxed text-neutral-500">{t(item.descriptionKey)}</p></div></Link>)}</div><div className="mt-10 text-center"><Link href="/services" className="inline-flex items-center gap-2 rounded-xl border border-primary-200 px-6 py-3 text-sm font-semibold text-primary-600 hover:bg-primary-50">{t("home.services.viewAll")}<ArrowRight className="h-4 w-4" /></Link></div></div></section>; }
