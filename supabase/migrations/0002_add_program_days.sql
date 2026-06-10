-- 番組に放送曜日（0=日〜6=土、複数可）を追加
-- すでに schema.sql を実行済みの DB に対して、SQL Editor でこれを Run してください
alter table public.programs
  add column if not exists days smallint[] not null default '{}';
