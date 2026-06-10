-- ステータス再設計: 「採用」「ボツ」を廃止し、送信済 + 採用フラグに変換
-- SQL Editor でこれを Run してください
alter table public.submissions
  add column if not exists accepted boolean not null default false;

update public.submissions set accepted = true, status = 'sent' where status = 'accepted';
update public.submissions set status = 'sent' where status = 'rejected';

alter table public.submissions drop constraint if exists submissions_status_check;
alter table public.submissions
  add constraint submissions_status_check check (status in ('draft', 'sent'));
