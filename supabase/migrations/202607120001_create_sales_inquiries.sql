create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text not null,
  company text,
  phone text,
  country text,
  preferred_language text not null default 'en',
  consent_marketing boolean not null default false,
  consent_privacy boolean not null default false,
  source text not null default 'website',
  created_at timestamptz not null default now()
);

create index if not exists leads_email_idx on public.leads (lower(email));
create index if not exists leads_created_at_idx on public.leads (created_at desc);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  inquiry_number text not null unique,
  lead_id uuid not null references public.leads(id) on delete restrict,
  product_id text,
  product_name text,
  quantity integer not null default 1 check (quantity > 0),
  currency text not null default 'USD',
  inquiry_type text not null default 'product',
  message text not null,
  status text not null default 'new' check (status in ('new', 'qualified', 'quoted', 'won', 'lost', 'archived')),
  locale text not null default 'en',
  timezone text,
  page_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists inquiries_lead_id_idx on public.inquiries (lead_id);
create index if not exists inquiries_status_idx on public.inquiries (status, created_at desc);

alter table public.leads enable row level security;
alter table public.inquiries enable row level security;

comment on table public.leads is 'B2B prospects captured by the public website. Access with server-side service role only.';
comment on table public.inquiries is 'Product and service inquiries linked to leads. Access with server-side service role only.';

