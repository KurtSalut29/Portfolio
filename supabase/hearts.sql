-- Hearts: one shared counter per month for the portfolio's heart button.
--
-- Setup (once):
--   1. Supabase dashboard -> SQL Editor -> New query -> paste this file -> Run.
--   2. Project Settings -> API: copy the Project URL and the anon public key into .env.local:
--        SUPABASE_URL=https://xxxx.supabase.co
--        SUPABASE_ANON_KEY=eyJ...
--   3. Restart `npm run dev`. On Vercel, add the same two variables to the project's Environment Variables.

create table if not exists public.hearts (
  month text primary key,          -- "2026-10", in Philippine time
  count bigint not null default 0
);

-- Nobody reads or writes the table directly; only the two functions below touch it.
alter table public.hearts enable row level security;

create or replace function public.get_hearts()
returns bigint
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (select count from hearts where month = to_char(now() at time zone 'Asia/Manila', 'YYYY-MM')),
    0
  );
$$;

-- Adds n hearts (1 to 20 per call, so one request can't inflate the count) and returns the new total.
create or replace function public.add_hearts(n int)
returns bigint
language sql
security definer
set search_path = public
as $$
  insert into hearts (month, count)
  values (to_char(now() at time zone 'Asia/Manila', 'YYYY-MM'), greatest(1, least(n, 20)))
  on conflict (month) do update set count = hearts.count + excluded.count
  returning count;
$$;

revoke all on function public.get_hearts() from public;
revoke all on function public.add_hearts(int) from public;
grant execute on function public.get_hearts() to anon;
grant execute on function public.add_hearts(int) to anon;
