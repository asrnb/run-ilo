create table if not exists post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  author_name text not null,
  content text not null,
  created_at timestamptz not null default now()
);

alter table post_comments enable row level security;
create policy "public read comments" on post_comments for select using (true);
create policy "public insert comments" on post_comments for insert with check (true);

create index if not exists post_comments_post_id_idx on post_comments (post_id, created_at asc);
