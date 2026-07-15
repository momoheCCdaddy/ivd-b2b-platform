create table if not exists public.catalog_category_overrides (
  category_id text primary key,
  title_en text,
  title_zh text,
  description_en text,
  description_zh text,
  visible boolean not null default true,
  sort_order integer not null default 100,
  updated_at timestamptz not null default now()
);

alter table public.catalog_category_overrides enable row level security;
comment on table public.catalog_category_overrides is 'Server-managed presentation overrides for product catalog categories. Service-role access only.';

insert into public.catalog_category_overrides (category_id, sort_order, visible) values
  ('research-cells', 10, true), ('gpcr-targets', 20, true), ('kinase-cells', 30, true),
  ('immunotherapy-cells', 40, true), ('taa-mouse', 50, true), ('tracer-cells', 60, true),
  ('drug-resistant', 70, true), ('signaling-pathway', 80, true), ('nuclear-receptor', 90, true),
  ('other-stable', 100, true), ('diagnostic-standards', 110, true), ('ningpu-qc', 120, false),
  ('leadingmed-products', 130, false)
on conflict (category_id) do nothing;

