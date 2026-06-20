'use client';

import Link from 'next/link';
import { Dna, Crosshair, Activity, Factory, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';

const serviceItems = [
  {
    icon: Dna,
    title: '细胞工程',
    desc: '稳定细胞株构建、CRISPR基因编辑、病毒包装 — 多技术平台覆盖各类细胞工程化需求',
    href: '/services#cell-engineering',
  },
  {
    icon: Crosshair,
    title: '靶点模型开发',
    desc: 'GPCR/激酶/免疫治疗/ADC/PROTAC — 覆盖主流和小众靶点的筛选验证模型开发',
    href: '/services#target-dev',
  },
  {
    icon: Activity,
    title: '药效评价',
    desc: '从体外细胞学评价到体内动物模型 — 完整的临床前药效学研究服务体系',
    href: '/services#efficacy',
  },
  {
    icon: Factory,
    title: 'CDMO服务',
    desc: '工艺开发、委托生产、注册支持 — 加速IVD产品从概念到上市的全过程',
    href: '/services#cdmo',
  },
];

export default function ServiceGrid() {
  return (
    <section className="section-padding bg-white">
      <div className="container-page">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-4">技术服务</h2>
          <p className="body-text max-w-2xl mx-auto">
            四大技术服务平台，为药物研发和IVD开发提供从早期发现到产业化的全流程技术支持
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {serviceItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex gap-5 p-6 rounded-xl border border-neutral-100 hover:border-primary-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 bg-white"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                <item.icon className="w-6 h-6 text-primary-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-neutral-800 mb-2 group-hover:text-primary-500 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" size="lg" href="/services">
            查看全部服务 <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
