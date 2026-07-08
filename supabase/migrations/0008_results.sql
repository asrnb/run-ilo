create table if not exists race_results (
  id uuid primary key default gen_random_uuid(),
  race_event_id uuid not null references race_events(id) on delete cascade,
  bib text,
  runner_name text not null,
  finish_time text not null, -- HH:MM:SS
  category text,             -- e.g. '5K', '21K', 'Overall Male'
  rank integer,
  created_at timestamptz not null default now()
);

alter table race_results enable row level security;
create policy "public read results" on race_results for select using (true);
create policy "service insert results" on race_results for insert with check (true);

create index if not exists race_results_event_idx on race_results (race_event_id);
create index if not exists race_results_name_idx on race_results using gin (to_tsvector('simple', runner_name));
