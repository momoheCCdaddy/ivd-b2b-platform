import HeroBanner from '@/components/home/HeroBanner';
import StatsCounter from '@/components/home/StatsCounter';
import ProductShowcase from '@/components/home/ProductShowcase';
import ServiceGrid from '@/components/home/ServiceGrid';
import WhyUs from '@/components/home/WhyUs';
import NewsSection from '@/components/home/NewsSection';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <StatsCounter />
      <ProductShowcase />
      <ServiceGrid />
      <WhyUs />
      <NewsSection />
      <CTASection />
    </>
  );
}
