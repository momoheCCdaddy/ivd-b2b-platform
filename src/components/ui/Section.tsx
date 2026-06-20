interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  bg?: 'white' | 'light' | 'primary' | 'dark' | 'neutral-50';
}

const backgrounds = {
  white: 'bg-white',
  light: 'bg-neutral-50',
  'neutral-50': 'bg-neutral-50',
  primary: 'bg-primary-500 text-white',
  dark: 'bg-secondary-500 text-white',
};

export default function Section({
  children,
  className = '',
  id,
  bg = 'white',
}: SectionProps) {
  return (
    <section id={id} className={`section-padding ${backgrounds[bg]} ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}
