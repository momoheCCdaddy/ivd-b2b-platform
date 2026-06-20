import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
}

export default function PageHeader({ title, description, backHref, backLabel }: PageHeaderProps) {
  return (
    <section className="bg-neutral-50 py-16">
      <div className="container-page">
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-primary-500 transition-colors mb-4"
          >
            <ArrowLeft className="w-3 h-3" />
            {backLabel || '返回'}
          </Link>
        )}
        <h1 className="heading-1 mb-4">{title}</h1>
        {description && <p className="body-text max-w-2xl">{description}</p>}
      </div>
    </section>
  );
}
