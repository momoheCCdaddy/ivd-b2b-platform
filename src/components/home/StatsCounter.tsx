'use client';

import { useEffect, useRef, useState } from 'react';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  accent?: boolean;
}

function useCountUp(end: number, duration: number = 2000, startCounting: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!startCounting) return;
    let startTime: number | null = null;
    let animationId: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * end));
      if (progress < 1) animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [end, duration, startCounting]);
  return count;
}

function StatCard({ value, suffix, label, accent }: StatItem) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(value, 2000, isVisible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center">
      <div className={"stat-number mb-2 " + (accent ? "text-signal-300" : "text-white")}>
        {count.toLocaleString()}
        {suffix === "+" && <span className="text-signal-300">+</span>}
        {(suffix === "?" || suffix === "?" || suffix === "?" || suffix === "?") && <span className="text-xl md:text-2xl font-display"> {suffix}</span>}
      </div>
      <p className="text-sm text-primary-200/80 font-medium">{label}</p>
    </div>
  );
}

export default function StatsCounter() {
  return (
    <section className="py-16 md:py-20 gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-subtle opacity-20" />
      <div className="container-page relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <StatCard value={3000} suffix="+" label="????" accent={true} />
          <StatCard value={1439} suffix="?" label="?????" />
          <StatCard value={500} suffix="?" label="????" />
          <StatCard value={30} suffix="?" label="????" />
        </div>
      </div>
    </section>
  );
}
