import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-neutral-400 mb-8">
      <Link href="/" className="hover:text-primary-500 transition-colors">
        首页
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          <ChevronRight className="w-3 h-3" />
          {item.href ? (
            <Link href={item.href} className="hover:text-primary-500 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-neutral-600 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
