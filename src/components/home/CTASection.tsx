'use client';

import Link from 'next/link';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function CTASection() {
  return (
    <section className="relative gradient-hero py-20 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl" />

      <div className="container-page relative z-10 text-center">
        <h2 className="heading-2 text-white mb-4">开启您的生命科学研究之旅</h2>
        <p className="text-blue-100 text-lg max-w-xl mx-auto mb-8">
          无论您需要靶点验证模型、诊断标准品还是CDMO服务，我们的专家团队随时为您提供支持
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" variant="secondary" href="/contact">
            <Mail className="w-5 h-5 mr-2" />
            在线咨询
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="!border-white/30 !text-white hover:!bg-white/10"
            href="/products"
          >
            浏览产品 <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
        <p className="text-blue-200 text-sm mt-6">
          或直接拨打服务热线 <span className="text-white font-semibold">400-XXX-XXXX</span>
        </p>
      </div>
    </section>
  );
}
