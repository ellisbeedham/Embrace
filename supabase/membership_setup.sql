-- Membership + booking schema for the new booking flow
-- Run this in Supabase SQL Editor.

create extension if not exists "uuid-ossp";

-- 1) profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  membership_tier text not null default 'none',
  class_credits_remaining integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists email text,
  add column if not exists membership_tier text not null default 'none',
  add column if not exists class_credits_remaining integer not null default 0,
  add column if not exists class_credits integer,
  add column if not exists membership_number text,
  add column if not exists full_name text,
  add column if not exists created_at timestamptz not null default now();

-- 2) bookings table (simple app-facing fields)
create table if not exists public.bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  class_name text not null,
  coach text,
  scheduled_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.bookings
  add column if not exists class_name text,
  add column if not exists coach text,
  add column if not exists scheduled_at timestamptz,
  add column if not exists created_at timestamptz not null default now();

-- If your old bookings schema had NOT NULL legacy columns, loosen them for compatibility.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'bookings' and column_name = 'class_slot_id'
  ) then
    alter table public.bookings alter column class_slot_id drop not null;
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'bookings' and column_name = 'booking_date'
  ) then
    alter table public.bookings alter column booking_date drop not null;
  end if;
end $$;

create index if not exists idx_profiles_membership_tier on public.profiles(membership_tier);
create index if not exists idx_bookings_user_id on public.bookings(user_id);
create index if not exists idx_bookings_scheduled_at on public.bookings(scheduled_at);

alter table public.profiles enable row level security;
alter table public.bookings enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can view own bookings" on public.bookings;
create policy "Users can view own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own bookings" on public.bookings;
create policy "Users can create own bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

-- Helper: create/refresh profile row whenever a user signs up.
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, membership_tier, class_credits_remaining)
  values (new.id, coalesce(new.email, ''), 'none', 0)
  on conflict (id) do update
    set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute function public.handle_new_user_profile();
