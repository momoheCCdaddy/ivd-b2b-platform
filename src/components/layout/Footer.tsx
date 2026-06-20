'use client';

import Link from 'next/link';
import { FlaskConical, Phone, Mail, MapPin, ShieldCheck, Award } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function Footer() {
  const { t } = useI18n();

  const footerLinks = [
    {
      title: t("footer.products"),
      links: [
        { label: t("footer.products.targetModels"), href: '/products#target-models' },
        { label: t("footer.products.diagnostic"), href: '/products#diagnostic' },
        { label: t("footer.products.cells"), href: '/products#cells' },
        { label: t("footer.products.services"), href: '/services' },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { label: t("footer.company.about"), href: '/about' },
        { label: t("footer.company.techCenter"), href: '/tech-center' },
        { label: t("footer.company.news"), href: '/news' },
        { label: t("footer.company.quality"), href: '/quality' },
      ],
    },
    {
      title: t("footer.support"),
      links: [
        { label: t("footer.support.faq"), href: '/faq' },
        { label: t("footer.support.contact"), href: '/contact' },
        { label: 'FAQ', href: '/faq' },
        { label: t("footer.support.privacy"), href: '/privacy' },
      ],
    },
  ];

  return (
    <footer className="bg-secondary-800 text-white">
      {/* Main Footer */}
      <div className="container-page py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-primary-300" />
              </div>
              <div>
                <span className="font-display text-lg font-bold tracking-tight">Cobioer</span>
                <span className="block text-[10px] font-mono text-primary-400 font-medium leading-none -mt-0.5">BioSciences</span>
              </div>
            </Link>
            <p className="text-secondary-200 text-sm leading-relaxed mb-6 max-w-md">
              {t("footer.about")}
            </p>
            <div className="space-y-2.5 text-sm text-secondary-200">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                <span>400-8750-250</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                <div>
                  <div>sales@cobioer.com</div>
                  <div className="text-[11px] text-secondary-300">tech@cobioer.com ({t("footer.techSupport")})</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                <span>{t("footer.address")}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-1.5 text-[11px] text-secondary-300 bg-secondary-700/50 px-2.5 py-1.5 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-signal-400" />
                ISO 13485
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-secondary-300 bg-secondary-700/50 px-2.5 py-1.5 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-signal-400" />
                ISO 9001
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-secondary-300 bg-secondary-700/50 px-2.5 py-1.5 rounded-lg">
                <Award className="w-3.5 h-3.5 text-warm-400" />
                {t("footer.highTech")}
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-secondary-200 mb-5 uppercase tracking-widest">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-secondary-300 hover:text-primary-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-700/50">
        <div className="container-page py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-secondary-400">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-xs text-secondary-400 hover:text-secondary-200 transition-colors">
              {t("footer.privacy")}
            </Link>
            <Link href="/faq" className="text-xs text-secondary-400 hover:text-secondary-200 transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
