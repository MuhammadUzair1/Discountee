-- Discountee schema (Supabase / Postgres)
-- Apply via the Supabase CLI (`supabase db push`) or paste into the SQL editor.

create table if not exists banks (
  id       text primary key,
  name     text not null,
  monogram text not null,
  color    text not null
);

create table if not exists merchants (
  id       text primary key,
  name     text not null,
  category text not null,
  vertical text not null
);

create table if not exists offers (
  id                text primary key,
  bank_id           text not null references banks (id),
  merchant_id       text not null references merchants (id),
  title             text not null,
  description       text not null,
  discount_type     text not null,            -- percentage | flat | bogo | cashback
  discount_value    numeric not null,
  max_discount_cap  integer,
  min_spend         integer,
  applicable_days   jsonb not null default '[]'::jsonb,
  time_window       text,
  cities            jsonb not null default '[]'::jsonb,
  eligible_networks jsonb not null default '[]'::jsonb,
  eligible_tiers    jsonb not null default '[]'::jsonb,
  valid_to          date not null,
  scope_note        text,
  exclusions        text,
  terms_url         text not null,
  source_url        text not null,
  last_verified     date not null,
  status            text not null default 'active'  -- active | expired | unverified
);

create index if not exists idx_offers_bank on offers (bank_id);
create index if not exists idx_offers_status on offers (status);
create index if not exists idx_offers_last_verified on offers (last_verified);

-- ---------------------------------------------------------------------------
-- Row Level Security.
-- Offer data is public → anon key may READ. Nobody may write with the anon key.
-- The ingestion pipeline writes using the SERVICE ROLE key, which bypasses RLS.
-- ---------------------------------------------------------------------------
alter table banks enable row level security;
alter table merchants enable row level security;
alter table offers enable row level security;

drop policy if exists "public read banks" on banks;
drop policy if exists "public read merchants" on merchants;
drop policy if exists "public read offers" on offers;

create policy "public read banks" on banks for select using (true);
create policy "public read merchants" on merchants for select using (true);
create policy "public read offers" on offers for select using (true);
