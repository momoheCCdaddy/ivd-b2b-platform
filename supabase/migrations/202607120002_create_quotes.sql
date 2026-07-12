create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  quote_number text not null unique,
  public_token uuid not null default gen_random_uuid() unique,
  lead_id uuid not null references public.leads(id) on delete restrict,
  currency text not null check (currency in ('USD', 'EUR', 'CNY')),
  exchange_rate numeric(14,6) not null default 1,
  subtotal numeric(14,2) not null,
  discount_rate numeric(7,4) not null default 0,
  discount_amount numeric(14,2) not null default 0,
  total numeric(14,2) not null,
  status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'expired', 'cancelled')),
  valid_until date not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(14,2) not null,
  line_total numeric(14,2) not null,
  source_unit_price_cny numeric(14,2) not null,
  created_at timestamptz not null default now()
);

create index if not exists quotes_lead_id_idx on public.quotes (lead_id, created_at desc);
create index if not exists quotes_status_idx on public.quotes (status, created_at desc);
create index if not exists quote_items_quote_id_idx on public.quote_items (quote_id);

alter table public.quotes enable row level security;
alter table public.quote_items enable row level security;

comment on table public.quotes is 'Server-generated commercial quotations. Service-role access only.';
comment on table public.quote_items is 'Line items for server-generated quotations. Service-role access only.';

