'use client';

import Link from 'next/link';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { catalogSummary, type CatalogSummary } from '@/data/catalog-summary';
import { Button } from '@/components/ui';
import { useI18n } from '@/lib/i18n';

const iconMap: Record<string, string> = {
  Target: '🎯',
  FlaskConical: '🧪',
  Microscope: '🔬',
  TestTubes: '⚗️',
};

function ProductCard({ category }: { category: CatalogSummary }) {
  const { lang, t } = useI18n();
  const english = lang !== 'zh';
  return (
    <Link href={`/products#${category.id}`} className="group block">
      <div className="bg-white rounded-xl p-6 border border-neutral-100 h-full hover-lift">
        <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center text-2xl mb-4 group-hover:bg-primary-100 transition-colors">
          {iconMap[category.icon] || '🔬'}
        </div>
        <h3 className="text-lg font-semibold text-neutral-800 mb-2 group-hover:text-primary-500 transition-colors">
          {english ? category.titleEn : category.title}
        </h3>
        <p className="text-sm text-neutral-500 leading-relaxed mb-4 line-clamp-2">
          {english ? category.descriptionEn : category.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(english ? category.highlightsEn : category.highlights).map((item) => (
            <span
              key={item}
              className="text-xs px-2 py-0.5 rounded-full bg-neutral-50 text-neutral-500 border border-neutral-100"
            >
              {item}
            </span>
          ))}
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-600">{t("home.products.productCount", { count: category.count.toLocaleString() })}</span>
        </div>
        <span className="inline-flex items-center text-sm text-primary-500 font-medium group-hover:gap-2 transition-all">
          {t("home.products.exploreCategory")} <ChevronRight className="w-4 h-4 ml-0.5" />
        </span>
      </div>
    </Link>
  );
}

export default function ProductShowcase() {
  const { t } = useI18n();
  return (
    <section className="section-padding bg-neutral-50" id="products">
      <div className="container-page">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-4">{t("home.products.title")}</h2>
          <p className="body-text max-w-2xl mx-auto">
            {t("home.products.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {catalogSummary.map((category) => (
            <ProductCard key={category.id} category={category} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" size="lg" href="/products">
            {t("home.products.browseCatalog")} <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
