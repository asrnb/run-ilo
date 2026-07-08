# run.ilo — project brief for Claude Code

A community platform for runs, fun runs, and marathons in **Iloilo City,
Philippines**. Runners browse upcoming races and follow the community feed.
Organizers submit races and post updates. An admin moderates before anything goes live.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS (tokens in `tailwind.config.ts`)
- Supabase (Postgres + RLS; Auth/Storage reserved for later phases)
- Leaflet + OpenStreetMap for maps (no API key)
- Deploy target: Vercel

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # verify before pushing
```

With **no env vars set**, the app falls back to bundled sample data
(`src/data/sample-events.ts`) and the write paths run in "demo mode" (accept input,
don't persist). To use a real DB, copy `.env.example` → `.env.local`, fill the
three Supabase keys, and run `supabase/migrations/0001_init.sql` then
`supabase/seed.sql` in the Supabase SQL editor.

## Architecture map

| Path | Role |
| --- | --- |
| `src/app/page.tsx` | Home: hero + filters + race list (server component) |
| `src/app/events/[slug]/page.tsx` | Race detail + map + updates feed |
| `src/app/feed/page.tsx` | Community feed (posts, recaps, updates) |
| `src/app/submit/page.tsx` | Public submission form → `POST /api/submit` |
| `src/app/admin/page.tsx` | Moderation dashboard (approve/reject) |
| `src/app/admin/new/page.tsx` | Create + publish a race |
| `src/app/api/submit/route.ts` | Inserts `status=pending, source=submission` |
| `src/app/api/events/route.ts` | POST creates published; PATCH changes status |
| `src/app/api/posts/route.ts` | Community posts CRUD |
| `src/lib/events.ts` | **All race data access lives here** |
| `src/lib/posts.ts` | **All post/feed data access lives here** |
| `src/lib/email.ts` | Resend email helpers (submission + approval) |
| `src/lib/types.ts` | `RaceEvent`, `Post`, and related types |
| `src/lib/format.ts` | Date / gun-start / distance formatting |
| `src/lib/supabase/` | `client.ts` (browser/anon), `server.ts` (anon + service role) |
| `supabase/` | SQL migrations + seed |

## Conventions (follow these)

- **Data access goes through `src/lib/events.ts`.** Don't query Supabase from
  components or pages directly. Add new queries there.
- **DB is snake_case, app is camelCase.** Every row passes through `fromRow()` in
  `events.ts`. Keep that mapping in sync when adding columns.
- **Preserve the sample-data fallback.** Every data function checks
  `isSupabaseConfigured()` and returns sample data otherwise, so the app always
  runs without setup. New data functions should do the same.
- **RLS model:** the anon key can only `select` published rows. All writes use the
  service-role key inside server route handlers — never expose it to the client.
- **Maps must not SSR.** Leaflet touches `window`. Load via
  `event-map-loader.tsx` (`next/dynamic`, `ssr: false`). Don't import
  `event-map.tsx` directly into a server component.
- **Client components reading query params** need a `<Suspense>` boundary (see
  `EventFilters` usage in `page.tsx`).
- Distances are integers in km: `5, 10, 21, 42`. `42` renders as the highlighted
  "full marathon" pill.
- No Drizzle — Phase 1 uses raw SQL migrations on purpose. If you add Drizzle,
  make the SQL migration the source of truth or remove it; don't let them drift.

## Design language

Theme: **"predawn start line."** Palette runs from deep predawn navy
(`predawn.800/900`) to a sunrise coral (`sunrise`) and mango first-light accent.
Race data (dates, gun starts, distances) is set in **monospace** like a timing
clock — that's the signature; keep it. Display face Archivo, body Plus Jakarta Sans.
Use the `.data-label` and `.startline` utility classes (in `globals.css`) rather
than reinventing them.

## State of the project

**Done:**
- Race directory with date/distance filters
- Race detail page with Leaflet map + CartoDB Voyager tiles
- GPX route upload + click-to-trace map (submit + admin)
- Public submission → moderation queue → admin approve/reject
- Admin CRUD (create, approve, reject, delete)
- Postgres schema with RLS, `/admin` protected with Supabase Auth
- Dynamic Open Graph race-card images (edge runtime)
- Email confirmations via Resend (submission + approval + rejection)
- Organizer email field on submit form

**In progress — Community & Social layer:**
1. Community feed (`/feed`) — posts, race recaps, runner updates (Threads-like)
2. Race updates — organizers post updates attached to a specific race
3. Reactions (likes/cheers) on posts
4. Comments on posts

**Up next after feed:**
5. Banner image uploads (Supabase Storage)
6. "I'm Joining" counter — one-click interest per race (no account needed)
7. `.ics` calendar export — add race to Google/Apple Calendar
8. Race results — post finish times after race day, runners search their name
9. Facebook Event auto-import — paste URL, AI extracts race details into admin form
10. Runner profiles + auth — personal race history, PRs, follow other runners
11. PWA + race-day push notifications
12. Admin: Facebook Event auto-import tool

## Guardrails

- Don't commit secrets. `SUPABASE_SERVICE_ROLE_KEY` is server-only.
- Run `npm run build` before declaring a change done.
- Iloilo users are mostly on mid-range Android over mobile data — keep it
  mobile-first and light; consider a PWA later, don't add heavy deps casually.
