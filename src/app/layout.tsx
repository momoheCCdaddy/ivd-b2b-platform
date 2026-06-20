import type { Metadata } from 'next';
import '@/app/globals.css';
import Header from '@/components/layout/Header';
import { I18nProvider } from '@/lib/i18n';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Cobioer | 药物靶点模型 & 诊断标准品',
    template: '%s | Cobioer BioSciences',
  },
  description:
    '南京科佰生物科技有限公司 — 领先的药物靶点模型与分子诊断标准品供应商，3000+产品，ISO13485认证，服务30+国家。',
  keywords: ['科佰生物', '药物靶点', '诊断标准品', '分子诊断', 'IVD质控', 'CDMO', 'GPCR', '细胞模型'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Source+Sans+3:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700;900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔬</text></svg>" />
      </head>
      <body className="font-sans antialiased">
        <I18nProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
