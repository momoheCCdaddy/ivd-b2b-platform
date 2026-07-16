import type { Metadata } from 'next';
import '@/app/globals.css';
import Header from '@/components/layout/Header';
import { I18nProvider } from '@/lib/i18n';
import Footer from '@/components/layout/Footer';
import CookieConsent from '@/components/privacy/CookieConsent';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ivd-b2b-platform.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Cobioer BioSciences | IVD Reference Materials & Cell Models',
    template: '%s | Cobioer BioSciences',
  },
  description:
    'Explore 7,000+ authenticated cell models, molecular diagnostic reference materials and IVD development solutions for global laboratories and manufacturers.',
  keywords: ['IVD products', 'diagnostic reference materials', 'drug target cell models', 'molecular diagnostics', 'IVD quality control', 'CDMO', 'GPCR cell lines', 'Cobioer'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Cobioer BioSciences',
    title: 'Cobioer BioSciences | IVD Products & Drug Target Models',
    description: '7,000+ IVD reference materials, research cell lines and drug target models for global laboratories and diagnostic manufacturers.',
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', title: 'Cobioer BioSciences', description: 'IVD products, diagnostic reference materials and drug target models for global customers.' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Cobioer BioSciences',
    alternateName: '南京科佰生物科技有限公司',
    url: siteUrl,
    description: 'Authenticated cell models, diagnostic reference materials and integrated IVD development solutions for global life-science customers.',
    email: 'sales@cobioer.com',
    telephone: '400-8750-250',
    address: { '@type': 'PostalAddress', addressLocality: 'Nanjing', addressCountry: 'CN' },
    contactPoint: { '@type': 'ContactPoint', contactType: 'sales', email: 'sales@cobioer.com', availableLanguage: ['English', 'Chinese'] },
  };
  return (
    <html lang="en">
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c') }} />
        <I18nProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CookieConsent />
        </I18nProvider>
      </body>
    </html>
  );
}
