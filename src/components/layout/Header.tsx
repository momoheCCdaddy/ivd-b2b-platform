'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import Link from 'next/link';
import { Menu, X, ChevronDown, FlaskConical } from 'lucide-react';

interface NavChild {
  labelKey: string;
  href: string;
}

interface NavItem {
  labelKey: string;
  href: string;
  children?: NavChild[];
}

const mainNavigation: NavItem[] = [
  {
    labelKey: 'nav.about',
    href: '/about',
    children: [
      { labelKey: 'nav.about.children.profile', href: '/about' },
      { labelKey: 'nav.about.children.culture', href: '/about#culture' },
      { labelKey: 'nav.about.children.history', href: '/about#history' },
      { labelKey: 'nav.about.children.team', href: '/about#team' },
    ],
  },
  {
    labelKey: 'nav.products',
    href: '/products',
    children: [
      { labelKey: 'nav.products.children.target-models', href: '/products#target-models' },
      { labelKey: 'nav.products.children.diagnostic', href: '/products#diagnostic' },
      { labelKey: 'nav.products.children.cells', href: '/products#cells' },
      { labelKey: 'nav.products.children.ivd', href: '/products#ivd' },
    ],
  },
  {
    labelKey: 'nav.services',
    href: '/services',
    children: [
      { labelKey: 'nav.services.children.cell-engineering', href: '/services#cell-engineering' },
      { labelKey: 'nav.services.children.target-dev', href: '/services#target-dev' },
      { labelKey: 'nav.services.children.efficacy', href: '/services#efficacy' },
      { labelKey: 'nav.services.children.cdma', href: '/services#cdmo' },
    ],
  },
  {
    labelKey: 'nav.tech-center',
    href: '/tech-center',
  },
  {
    labelKey: 'nav.news',
    href: '/news',
  },
  {
    labelKey: 'nav.quality',
    href: '/quality',
  },
  {
    labelKey: 'nav.contact',
    href: '/contact',
  },
];

export default function Header() {
  const { lang, setLang, t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-secondary-100/30">
      <div className="container-page">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display text-lg font-bold text-secondary-800 tracking-tight">
                Cobioer
              </span>
              <span className="hidden sm:block text-[10px] font-mono text-primary-500 font-medium leading-none -mt-0.5">
                Precision Biology
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {mainNavigation.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.href)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-3.5 py-2 text-sm font-medium text-secondary-400 hover:text-primary-600 rounded-lg hover:bg-primary-50/50 transition-all"
                >
                  {t(item.labelKey)}
                  {item.children && <ChevronDown className="w-3 h-3 opacity-50" />}
                </Link>
                {item.children && activeDropdown === item.href && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-secondary-100/50 overflow-hidden animate-fade-in">
                    <div className="py-1.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-secondary-500 hover:text-primary-600 hover:bg-primary-50/50 transition-colors"
                        >
                          {t(child.labelKey)}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "zh" ? "en" : "zh")}
              className="px-3 py-1.5 text-xs font-medium text-secondary-400 hover:text-primary-600 rounded-lg border border-secondary-200/50 hover:border-primary-300/50 hover:bg-primary-50/50 transition-all"
            >
              {t("lang.switch")}
            </button>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-all shadow-sm hover:shadow-md"
            >
              {t("header.contact")}
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-secondary-400 hover:text-primary-500 rounded-lg transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-secondary-100/30 bg-white/95 backdrop-blur-lg animate-fade-in">
          <div className="container-page py-4 space-y-1">
            {mainNavigation.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-secondary-600 hover:text-primary-600 hover:bg-primary-50/50 rounded-lg transition-all"
                >
                  {t(item.labelKey)}
                </Link>
                {item.children && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-primary-100 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-2 text-sm text-secondary-400 hover:text-primary-600 rounded-lg transition-all"
                      >
                        {t(child.labelKey)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-3 mt-2 border-t border-secondary-100/30">
              <Link href="/contact" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-all">
                {t("header.contact")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
