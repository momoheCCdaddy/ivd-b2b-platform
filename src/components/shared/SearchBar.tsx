'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { productCategories } from '@/data/products';
import { serviceCategories } from '@/data/services';
import Link from 'next/link';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ title: string; href: string; type: string }[]>([]);
  const [open, setOpen] = useState(false);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.length < 2) {
      setResults([]);
      return;
    }

    const found: { title: string; href: string; type: string }[] = [];

    productCategories.forEach((cat) => {
      cat.items.forEach((item) => {
        if (item.name.includes(q) || item.description.includes(q)) {
          found.push({ title: item.name, href: `/products#${cat.id}`, type: '产品' });
        }
      });
    });

    serviceCategories.forEach((cat) => {
      cat.details.forEach((d) => {
        if (d.name.includes(q) || d.description.includes(q)) {
          found.push({ title: d.name, href: `/services#${cat.id}`, type: '技术服务' });
        }
      });
    });

    setResults(found.slice(0, 10));
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 bg-white">
        <Search className="w-4 h-4 text-neutral-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          placeholder="搜索产品、服务..."
          className="flex-1 outline-none text-sm text-neutral-700 placeholder-neutral-400"
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]); }} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-neutral-100 shadow-lg overflow-hidden z-50">
          {results.map((r, i) => (
            <Link
              key={i}
              href={r.href}
              className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors"
            >
              <span className="text-xs px-2 py-0.5 rounded bg-primary-50 text-primary-600">{r.type}</span>
              <span className="text-sm text-neutral-700">{r.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
