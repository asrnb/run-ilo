-- Admins table. A user must have a row here to access /admin.
--
-- After a user signs up via Supabase Auth, grant them admin access:
--   insert into admins (user_id)
--   select id from auth.users where email = 'you@example.com';

create table admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- Only the service role reads this table (server-side). No anon select policy needed.
alter table admins enable row level security;
