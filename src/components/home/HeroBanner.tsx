'use client';

import Link from 'next/link';
import { ChevronRight, ArrowRight, FlaskConical } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function HeroBanner() {
  const { t } = useI18n();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-subtle opacity-40" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-400/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-signal-500/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="container-page relative z-10 pt-20 pb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm text-primary-200 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-signal-400 animate-pulse-glow" />
            {t("home.hero.badge")}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 font-display tracking-tight">
            {t("home.hero.title")}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-signal-300 to-primary-200">
              {t("home.hero.titleHighlight")}
            </span>
          </h1>

          <p className="text-base md:text-lg text-primary-200/80 max-w-xl leading-relaxed mb-10">
            {t("home.hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl text-sm"
            >
              {t("home.hero.ctaProducts")} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-all text-sm"
            >
              {t("home.hero.ctaContact")} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Floating stats card */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl">
            <div className="space-y-6">
              <div>
                <div className="stat-number text-signal-300">3000+</div>
                <div className="text-sm text-primary-200">{t("home.stats.products")}</div>
              </div>
              <div className="border-t border-white/10" />
              <div>
                <div className="stat-number text-white">500+</div>
                <div className="text-sm text-primary-200">{t("home.stats.cells")}</div>
              </div>
              <div className="border-t border-white/10" />
              <div>
                <div className="stat-number text-white">30+</div>
                <div className="text-sm text-primary-200">{t("home.stats.countries")}</div>
              </div>
              <div className="border-t border-white/10" />
              <div>
                <div className="stat-number text-primary-300">2013</div>
                <div className="text-sm text-primary-200">{t("home.stats.founded")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-white/40 animate-pulse-glow" />
        </div>
      </div>
    </section>
  );
}
