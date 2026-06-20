import Link from 'next/link';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { newsItems, techArticles } from '@/data/news';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const categoryLabels: Record<string, string> = {
  company: '公司动态',
  product: '产品发布',
  event: '活动',
  industry: '行业资讯',
};

export default function NewsSection() {
  const latestNews = newsItems.slice(0, 3);
  const latestTech = techArticles.slice(0, 3);

  return (
    <section className="section-padding bg-white">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* News Column */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="heading-2">新闻动态</h2>
              <Link
                href="/news"
                className="text-sm text-primary-500 hover:text-primary-600 font-medium inline-flex items-center gap-1"
              >
                全部新闻 <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-4">
              {latestNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="block group p-4 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="primary">{categoryLabels[item.category] || item.category}</Badge>
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-neutral-800 mb-1 group-hover:text-primary-500 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-500 line-clamp-2">{item.summary}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Tech Articles Column */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="heading-2">技术文章</h2>
              <Link
                href="/tech-center"
                className="text-sm text-primary-500 hover:text-primary-600 font-medium inline-flex items-center gap-1"
              >
                全部文章 <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-4">
              {latestTech.map((article) => (
                <Link
                  key={article.id}
                  href={`/tech-center/${article.slug}`}
                  className="block group p-4 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="accent">{article.category}</Badge>
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {article.date}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-neutral-800 mb-1 group-hover:text-primary-500 transition-colors line-clamp-1">
                    {article.title}
                  </h3>
                  <p className="text-sm text-neutral-500 line-clamp-2">{article.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
