create table if not exists race_joins (
  id uuid primary key default gen_random_uuid(),
  race_event_id uuid not null references race_events(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table race_joins enable row level security;
create policy "public read joins" on race_joins for select using (true);
create policy "public insert joins" on race_joins for insert with check (true);

create index if not exists race_joins_event_id_idx on race_joins (race_event_id);
