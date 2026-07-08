-- Community feed posts
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  race_event_id uuid references race_events(id) on delete cascade,
  author_name text not null,
  content text not null,
  kind text not null default 'general', -- 'general' | 'update' | 'result' | 'recap'
  created_at timestamptz not null default now()
);

-- Reactions on posts
create table if not exists post_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  emoji text not null default '🔥', -- '🔥' | '💪' | '👟'
  created_at timestamptz not null default now()
);

-- RLS: anyone can read posts and reactions
alter table posts enable row level security;
alter table post_reactions enable row level security;

create policy "public read posts" on posts for select using (true);
create policy "public insert posts" on posts for insert with check (true);

create policy "public read reactions" on post_reactions for select using (true);
create policy "public insert reactions" on post_reactions for insert with check (true);

-- index for per-race queries
create index if not exists posts_race_event_id_idx on posts (race_event_id, created_at desc);
create index if not exists reactions_post_id_idx on post_reactions (post_id);
