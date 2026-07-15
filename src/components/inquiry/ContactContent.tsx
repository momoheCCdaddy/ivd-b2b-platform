"use client";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import InquiryForm from "@/components/inquiry/InquiryForm";
import { useI18n } from "@/lib/i18n";

export default function ContactContent({ productId = "", productName = "" }: { productId?: string; productName?: string }) {
  const { t } = useI18n();
  const contacts = [
    { icon: Phone, label: "contact.globalHotline", value: "400-8750-250" },
    { icon: Mail, label: "contact.salesInquiries", value: "sales@cobioer.com" },
    { icon: Mail, label: "contact.technicalSupport", value: "tech@cobioer.com" },
    { icon: MapPin, label: "contact.headquarters", value: t("contact.address") },
    { icon: Clock, label: "contact.businessHours", value: t("contact.hours") },
  ];
  return <div className="pt-20">
    <section className="bg-neutral-50 py-16"><div className="container-page text-center"><p className="text-xs font-semibold tracking-[0.2em] text-primary-600">{t("contact.eyebrow")}</p><h1 className="heading-1 mt-4">{t("contact.title")}</h1><p className="body-text mx-auto mt-4 max-w-2xl">{t("contact.description")}</p></div></section>
    <section className="section-padding bg-white"><div className="container-page grid gap-12 lg:grid-cols-2"><div><h2 className="heading-2 mb-8">{t("contact.talkToTeam")}</h2><div className="space-y-6">{contacts.map(contact => <div key={contact.label} className="flex gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50"><contact.icon className="h-5 w-5 text-primary-500" /></div><div><p className="text-sm text-neutral-400">{t(contact.label)}</p><p className="text-lg font-semibold text-neutral-800">{contact.value}</p></div></div>)}</div><div className="mt-10 rounded-xl bg-neutral-50 p-6"><h3 className="font-semibold text-neutral-800">{t("contact.regionalSupport")}</h3><p className="mt-2 text-sm leading-relaxed text-neutral-500">{t("contact.regionalSupportDesc")}</p></div></div><div><h2 className="heading-2 mb-8">{t("contact.inquiryDetails")}</h2><InquiryForm productId={productId} productName={productName} /></div></div></section>
  </div>;
}
