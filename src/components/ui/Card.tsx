import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  className = '',
  hover = true,
  padding = 'md',
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-neutral-100 ${paddings[padding]} ${
        hover ? 'hover-lift' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
