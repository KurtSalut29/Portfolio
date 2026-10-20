-- Guestbook: visitors leave a comment and an optional 1 to 5 star rating.
-- New comments are hidden until you approve them.
--
-- Setup (once):
--   Supabase dashboard -> SQL Editor -> New query -> paste this file -> Run.
--   It uses the same SUPABASE_URL and SUPABASE_ANON_KEY as the hearts counter; nothing new to add.
--
-- Approving a comment:
--   Table Editor -> guestbook -> tick the "approved" box on the row. It shows on the site within 5 minutes.
--   To remove one, untick "approved" or delete the row.

create table if not exists public.guestbook (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 60),
  role text check (char_length(role) <= 80),
  message text not null check (char_length(message) between 2 and 600),
  rating smallint check (rating between 1 and 5),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists guestbook_approved_created on public.guestbook (approved, created_at desc);

-- Nobody reads or writes the table directly; only the functions below touch it.
alter table public.guestbook enable row level security;

-- Approved comments, newest first.
create or replace function public.get_guestbook()
returns table (id bigint, name text, role text, message text, rating smallint, created_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select id, name, role, message, rating, created_at
  from guestbook
  where approved
  order by created_at desc
  limit 100;
$$;

-- A new comment, always waiting for approval. The site checks lengths too; these are the last line.
create or replace function public.add_guestbook(p_name text, p_role text, p_message text, p_rating int)
returns void
language sql
security definer
set search_path = public
as $$
  insert into guestbook (name, role, message, rating)
  values (
    left(trim(p_name), 60),
    nullif(left(trim(coalesce(p_role, '')), 80), ''),
    left(trim(p_message), 600),
    case when p_rating between 1 and 5 then p_rating else null end
  );
$$;

revoke all on function public.get_guestbook() from public;
revoke all on function public.add_guestbook(text, text, text, int) from public;
grant execute on function public.get_guestbook() to anon;
grant execute on function public.add_guestbook(text, text, text, int) to anon;

-- Make the new functions visible to the API right away.
notify pgrst, 'reload schema';
