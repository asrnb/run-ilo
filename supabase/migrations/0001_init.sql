create table race_events (
  id               uuid        primary key default gen_random_uuid(),
  slug             text        unique not null,
  name             text        not null,
  date             date        not null,
  gun_start        time        not null,
  distances        integer[]   not null,
  location         text        not null,
  lat              float8      not null,
  lng              float8      not null,
  registration_url text,
  description      text,
  status           text        not null default 'pending'
                               check (status in ('published', 'pending', 'rejected')),
  source           text        not null default 'submission'
                               check (source in ('admin', 'submission')),
  created_at       timestamptz not null default now()
);

-- Row-level security
alter table race_events enable row level security;

-- Anon key can only read published rows
create policy "Public read published"
  on race_events for select
  to anon
  using (status = 'published');

-- Service role bypasses RLS automatically (no extra policy needed)
