begin;

create temporary table lead_merge_map on commit drop as
select
  id as duplicate_id,
  first_value(id) over (
    partition by lower(btrim(email))
    order by created_at asc, id asc
    rows between unbounded preceding and unbounded following
  ) as keeper_id
from public.leads;

update public.leads as keeper
set
  company = coalesce(keeper.company, merged.company),
  phone = coalesce(keeper.phone, merged.phone),
  country = coalesce(keeper.country, merged.country),
  consent_marketing = keeper.consent_marketing or merged.consent_marketing,
  consent_privacy = keeper.consent_privacy or merged.consent_privacy
from (
  select
    mapping.keeper_id,
    max(nullif(btrim(lead.company), '')) as company,
    max(nullif(btrim(lead.phone), '')) as phone,
    max(nullif(btrim(lead.country), '')) as country,
    bool_or(lead.consent_marketing) as consent_marketing,
    bool_or(lead.consent_privacy) as consent_privacy
  from lead_merge_map as mapping
  join public.leads as lead on lead.id = mapping.duplicate_id
  group by mapping.keeper_id
) as merged
where keeper.id = merged.keeper_id;

update public.inquiries as inquiry
set lead_id = mapping.keeper_id
from lead_merge_map as mapping
where inquiry.lead_id = mapping.duplicate_id
  and mapping.duplicate_id <> mapping.keeper_id;

update public.quotes as quote
set lead_id = mapping.keeper_id
from lead_merge_map as mapping
where quote.lead_id = mapping.duplicate_id
  and mapping.duplicate_id <> mapping.keeper_id;

delete from public.leads as lead
using lead_merge_map as mapping
where lead.id = mapping.duplicate_id
  and mapping.duplicate_id <> mapping.keeper_id;

alter table public.leads
  add column if not exists email_normalized text
  generated always as (lower(btrim(email))) stored;

create unique index if not exists leads_email_normalized_uidx
  on public.leads (email_normalized);

comment on column public.leads.email_normalized is
  'Generated normalized email used to reuse one lead across repeat inquiries and quotations.';

commit;
