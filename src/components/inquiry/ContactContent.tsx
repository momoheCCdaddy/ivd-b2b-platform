"use client";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import InquiryForm from "@/components/inquiry/InquiryForm";
import { useI18n } from "@/lib/i18n";

export default function ContactContent({ productId = "", productName = "" }: { productId?: string; productName?: string }) {
  const { lang } = useI18n(); const zh = lang === "zh";
  const contacts = [
    { icon: Phone, en: "Global sales hotline", zh: "全球销售热线", value: "400-8750-250" },
    { icon: Mail, en: "Sales inquiries", zh: "销售咨询", value: "sales@cobioer.com" },
    { icon: Mail, en: "Technical support", zh: "技术支持", value: "tech@cobioer.com" },
    { icon: MapPin, en: "Headquarters", zh: "公司地址", value: zh ? "中国南京市栖霞区纬地路9号" : "No. 9 Weidi Road, Qixia District, Nanjing, China" },
    { icon: Clock, en: "Business hours", zh: "工作时间", value: zh ? "周一至周五 09:00–18:00（UTC+8）" : "Monday–Friday, 09:00–18:00 (UTC+8)" },
  ];
  return <div className="pt-20">
    <section className="bg-neutral-50 py-16"><div className="container-page text-center"><p className="text-xs font-semibold tracking-[0.2em] text-primary-600">{zh ? "全球销售" : "GLOBAL SALES"}</p><h1 className="heading-1 mt-4">{zh ? "申请产品资料与报价" : "Request product information"}</h1><p className="body-text mx-auto mt-4 max-w-2xl">{zh ? "请说明您的需求，我们的产品专家将确认库存、交期、技术文件和商务条款。" : "Tell us what you need. Our product specialists will confirm availability, lead time, documentation and commercial terms."}</p></div></section>
    <section className="section-padding bg-white"><div className="container-page grid gap-12 lg:grid-cols-2"><div><h2 className="heading-2 mb-8">{zh ? "联系我们的团队" : "Talk to our team"}</h2><div className="space-y-6">{contacts.map(contact => <div key={contact.en} className="flex gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50"><contact.icon className="h-5 w-5 text-primary-500" /></div><div><p className="text-sm text-neutral-400">{zh ? contact.zh : contact.en}</p><p className="text-lg font-semibold text-neutral-800">{contact.value}</p></div></div>)}</div><div className="mt-10 rounded-xl bg-neutral-50 p-6"><h3 className="font-semibold text-neutral-800">{zh ? "区域销售支持" : "Regional sales support"}</h3><p className="mt-2 text-sm leading-relaxed text-neutral-500">{zh ? "我们会根据您的市场、产品和应用将询盘分配给合适的区域及产品专家，商务询盘通常在一个工作日内回复。" : "We route each inquiry to the product and regional specialist best suited to your market. Business inquiries are normally answered within one working day."}</p></div></div><div><h2 className="heading-2 mb-8">{zh ? "询盘详情" : "Inquiry details"}</h2><InquiryForm productId={productId} productName={productName} /></div></div></section>
  </div>;
}
