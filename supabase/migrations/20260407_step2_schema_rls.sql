-- Step 2: GradEcho schema + RLS baseline
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

-- Keep updated_at accurate on updates.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Profiles table (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  university text,
  department text,
  graduation_year text,
  avatar_url text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- Bootstrap profile row from signup metadata.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    university,
    department,
    graduation_year
  )
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'university',
    new.raw_user_meta_data ->> 'department',
    new.raw_user_meta_data ->> 'graduation_year'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- Memories (feed posts)
create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text,
  quote text not null,
  reflection text,
  image_url text not null,
  voice_url text,
  voice_label text,
  voice_duration text,
  tags text[] not null default '{}'::text[],
  likes_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists memories_set_updated_at on public.memories;
create trigger memories_set_updated_at
before update on public.memories
for each row
execute function public.set_updated_at();

create index if not exists memories_created_at_idx on public.memories (created_at desc);
create index if not exists memories_user_id_idx on public.memories (user_id);

-- Likes
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  memory_id uuid not null references public.memories(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (memory_id, user_id)
);

create index if not exists likes_memory_id_idx on public.likes (memory_id);
create index if not exists likes_user_id_idx on public.likes (user_id);

-- Helper for admin checks in RLS policies.
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select p.is_admin from public.profiles p where p.id = uid), false);
$$;

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.memories enable row level security;
alter table public.likes enable row level security;

-- Profiles policies
drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated"
on public.profiles
for select
to authenticated
using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles
for update
to authenticated
using (auth.uid() = id or public.is_admin(auth.uid()))
with check (auth.uid() = id or public.is_admin(auth.uid()));

-- Memories policies
drop policy if exists "memories_select_authenticated" on public.memories;
create policy "memories_select_authenticated"
on public.memories
for select
to authenticated
using (true);

drop policy if exists "memories_insert_own" on public.memories;
create policy "memories_insert_own"
on public.memories
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "memories_update_own_or_admin" on public.memories;
create policy "memories_update_own_or_admin"
on public.memories
for update
to authenticated
using (auth.uid() = user_id or public.is_admin(auth.uid()))
with check (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "memories_delete_own_or_admin" on public.memories;
create policy "memories_delete_own_or_admin"
on public.memories
for delete
to authenticated
using (auth.uid() = user_id or public.is_admin(auth.uid()));

-- Likes policies
drop policy if exists "likes_select_authenticated" on public.likes;
create policy "likes_select_authenticated"
on public.likes
for select
to authenticated
using (true);

drop policy if exists "likes_insert_own" on public.likes;
create policy "likes_insert_own"
on public.likes
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "likes_delete_own_or_admin" on public.likes;
create policy "likes_delete_own_or_admin"
on public.likes
for delete
to authenticated
using (auth.uid() = user_id or public.is_admin(auth.uid()));
