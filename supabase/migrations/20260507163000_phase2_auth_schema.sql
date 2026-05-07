create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  github_username text,
  github_profile_url text,
  default_repo_owner text,
  default_repo_name text,
  preferred_ai_provider text not null default 'none' check (preferred_ai_provider in ('none', 'openai', 'gemini')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_type text not null check (source_type in ('github_pr', 'diff_upload')),
  pr_url text,
  repo_owner text,
  repo_name text,
  pr_number int,
  title text,
  author text,
  overall_risk_score int not null default 0,
  risk_level text not null default 'low' check (risk_level in ('low', 'medium', 'high', 'critical')),
  ai_summary text,
  suggested_tests text,
  raw_diff text,
  created_at timestamptz not null default now()
);

create table if not exists public.review_files (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews(id) on delete cascade,
  file_path text not null,
  status text,
  additions int not null default 0,
  deletions int not null default 0,
  patch text,
  risk_score int not null default 0,
  risk_level text not null default 'low' check (risk_level in ('low', 'medium', 'high', 'critical')),
  created_at timestamptz not null default now()
);

create table if not exists public.review_issues (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews(id) on delete cascade,
  file_id uuid references public.review_files(id) on delete cascade,
  severity text not null check (severity in ('low', 'medium', 'high', 'critical')),
  category text not null,
  title text not null,
  description text,
  recommendation text,
  line_number int,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''))
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.reviews enable row level security;
alter table public.review_files enable row level security;
alter table public.review_issues enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "reviews_select_own" on public.reviews;
create policy "reviews_select_own"
on public.reviews
for select
using (auth.uid() = user_id);

drop policy if exists "reviews_insert_own" on public.reviews;
create policy "reviews_insert_own"
on public.reviews
for insert
with check (auth.uid() = user_id);

drop policy if exists "reviews_delete_own" on public.reviews;
create policy "reviews_delete_own"
on public.reviews
for delete
using (auth.uid() = user_id);

drop policy if exists "review_files_select_own" on public.review_files;
create policy "review_files_select_own"
on public.review_files
for select
using (
  exists (
    select 1
    from public.reviews
    where public.reviews.id = review_files.review_id
      and public.reviews.user_id = auth.uid()
  )
);

drop policy if exists "review_files_insert_own" on public.review_files;
create policy "review_files_insert_own"
on public.review_files
for insert
with check (
  exists (
    select 1
    from public.reviews
    where public.reviews.id = review_files.review_id
      and public.reviews.user_id = auth.uid()
  )
);

drop policy if exists "review_files_delete_own" on public.review_files;
create policy "review_files_delete_own"
on public.review_files
for delete
using (
  exists (
    select 1
    from public.reviews
    where public.reviews.id = review_files.review_id
      and public.reviews.user_id = auth.uid()
  )
);

drop policy if exists "review_issues_select_own" on public.review_issues;
create policy "review_issues_select_own"
on public.review_issues
for select
using (
  exists (
    select 1
    from public.reviews
    where public.reviews.id = review_issues.review_id
      and public.reviews.user_id = auth.uid()
  )
);

drop policy if exists "review_issues_insert_own" on public.review_issues;
create policy "review_issues_insert_own"
on public.review_issues
for insert
with check (
  exists (
    select 1
    from public.reviews
    where public.reviews.id = review_issues.review_id
      and public.reviews.user_id = auth.uid()
  )
);

drop policy if exists "review_issues_delete_own" on public.review_issues;
create policy "review_issues_delete_own"
on public.review_issues
for delete
using (
  exists (
    select 1
    from public.reviews
    where public.reviews.id = review_issues.review_id
      and public.reviews.user_id = auth.uid()
  )
);
