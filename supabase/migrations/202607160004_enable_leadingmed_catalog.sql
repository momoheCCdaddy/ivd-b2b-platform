insert into public.catalog_category_overrides (category_id, sort_order, visible)
values ('leadingmed-products', 130, true)
on conflict (category_id) do update
set visible = excluded.visible,
    sort_order = excluded.sort_order,
    updated_at = now();
