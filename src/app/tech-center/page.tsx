import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { techArticles } from '@/data/news';
import Badge from '@/components/ui/Badge';
import Section from '@/components/ui/Section';

export const metadata: Metadata = {
  title: '技术中心',
  description: '探索热门药物靶点研究进展、细胞模型应用指南和技术白皮书',
};

export default function TechCenterPage() {
  return (
    <div className="pt-20">
      <section className="bg-neutral-50 py-16">
        <div className="container-page text-center">
          <Badge variant="accent" className="mb-4">技术中心</Badge>
          <h1 className="heading-1 mb-4">技术中心</h1>
          <p className="body-text max-w-2xl mx-auto">
            我们的技术团队持续追踪前沿靶点研究进展，定期发布技术文章和应用指南，助力您的科研工作
          </p>
        </div>
      </section>

      <Section bg="white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techArticles.map((article) => (
            <Link
              key={article.id}
              href={`/tech-center/${article.slug}`}
              className="group block bg-white rounded-xl border border-neutral-100 hover-lift overflow-hidden"
            >
              <div className="h-2 gradient-primary" />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="accent">{article.category}</Badge>
                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {article.date}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-3 group-hover:text-primary-500 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3 mb-4">
                  {article.summary}
                </p>
                <span className="inline-flex items-center text-sm text-primary-500 font-medium group-hover:gap-2 transition-all">
                  阅读全文 <ArrowRight className="w-3 h-3 ml-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Categories */}
      <Section bg="neutral-50">
        <h2 className="heading-2 text-center mb-8">研究领域</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {['免疫靶点', 'GPCR研究', '肿瘤靶点', '方法学', '细胞工程', '诊断技术', '药物筛选'].map(
            (cat) => (
              <span
                key={cat}
                className="px-5 py-2.5 rounded-lg bg-white border border-neutral-100 text-neutral-600 hover:text-primary-500 hover:border-primary-200 transition-colors cursor-pointer text-sm font-medium"
              >
                {cat}
              </span>
            )
          )}
        </div>
      </Section>
    </div>
  );
}
