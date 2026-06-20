import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { newsItems } from '@/data/news';
import Badge from '@/components/ui/Badge';
import Section from '@/components/ui/Section';

export const metadata: Metadata = {
  title: '新闻动态',
  description: 'BioSci公司新闻、产品发布和行业活动',
};

const categoryMap: Record<string, { label: string; variant: 'primary' | 'accent' | 'neutral' }> = {
  company: { label: '公司动态', variant: 'primary' },
  product: { label: '产品发布', variant: 'accent' },
  event: { label: '活动', variant: 'accent' },
  industry: { label: '行业资讯', variant: 'neutral' },
};

export default function NewsPage() {
  return (
    <div className="pt-20">
      <section className="bg-neutral-50 py-16">
        <div className="container-page text-center">
          <Badge variant="primary" className="mb-4">新闻动态</Badge>
          <h1 className="heading-1 mb-4">新闻动态</h1>
          <p className="body-text max-w-2xl mx-auto">
            了解公司最新动态、产品发布和行业活动
          </p>
        </div>
      </section>

      <Section bg="white">
        <div className="max-w-3xl mx-auto space-y-6">
          {newsItems.map((item) => {
            const cat = categoryMap[item.category] || categoryMap.company;
            return (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="block group p-6 rounded-xl border border-neutral-100 hover:border-primary-100 hover:shadow-sm transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                  <Badge variant={cat.variant}>{cat.label}</Badge>
                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-neutral-800 mb-2 group-hover:text-primary-500 transition-colors">
                  {item.title}
                </h2>
                <p className="text-neutral-500 leading-relaxed mb-3">{item.summary}</p>
                <span className="inline-flex items-center text-sm text-primary-500 font-medium group-hover:gap-2 transition-all">
                  阅读详情 <ArrowRight className="w-3 h-3 ml-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
