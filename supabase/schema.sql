-- RADIOH データベーススキーマ
-- Supabase ダッシュボード → SQL Editor に貼り付けて Run してください

-- プロフィール（ラジオネーム + 署名）
create table public.profiles (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  signature text not null default '',
  created_at timestamptz not null default now()
);

-- 番組
create table public.programs (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  email text not null,
  thumbnail text,
  days smallint[] not null default '{}',
  profile_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

-- コーナー（番組の子）
create table public.corners (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  program_id uuid not null references public.programs (id) on delete cascade,
  name text not null,
  subject_line text not null default '',
  template text not null default '',
  created_at timestamptz not null default now()
);

-- 投稿（送信履歴）
create table public.submissions (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  corner_id uuid not null references public.corners (id) on delete cascade,
  body text not null default '',
  status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'rejected')),
  created_at timestamptz not null default now()
);

create index corners_program_id_idx on public.corners (program_id);
create index submissions_corner_id_idx on public.submissions (corner_id);

-- Row Level Security: 自分のデータだけ読み書きできる
alter table public.profiles enable row level security;
alter table public.programs enable row level security;
alter table public.corners enable row level security;
alter table public.submissions enable row level security;

create policy "own profiles" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own programs" on public.programs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own corners" on public.corners
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own submissions" on public.submissions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
