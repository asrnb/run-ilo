# run.ilo — project brief for Claude Code

A community directory of runs, fun runs, and marathons in **Iloilo City,
Philippines**. Users browse upcoming races; organizers submit races that an admin
moderates before they go live.

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
| `src/app/events/[slug]/page.tsx` | Race detail + map |
| `src/app/submit/page.tsx` | Public submission form → `POST /api/submit` |
| `src/app/admin/page.tsx` | Moderation dashboard (approve/reject) |
| `src/app/admin/new/page.tsx` | Create + publish a race |
| `src/app/api/submit/route.ts` | Inserts `status=pending, source=submission` |
| `src/app/api/events/route.ts` | POST creates published; PATCH changes status |
| `src/lib/events.ts` | **All data access lives here** |
| `src/lib/types.ts` | `RaceEvent` and related types |
| `src/lib/format.ts` | Date / gun-start / distance formatting |
| `src/lib/supabase/` | `client.ts` (browser/anon), `server.ts` (anon + service role) |
| `supabase/` | SQL migration + seed |

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

**Done (Phase 1):** directory, date/distance filters, race detail + map, public
submission → moderation queue, basic admin CRUD, Postgres schema with RLS,
`/admin` protected with Supabase Auth, dynamic Open Graph race-card images.

**Next, in order:**
1. Email confirmations on submission + approval (Resend).
2. Banner image uploads (Supabase Storage), organizer records.
3. Phase 3: saved/"interested" races, race-day reminders, `.ics` export.

## Guardrails

- Don't commit secrets. `SUPABASE_SERVICE_ROLE_KEY` is server-only.
- Run `npm run build` before declaring a change done.
- Iloilo users are mostly on mid-range Android over mobile data — keep it
  mobile-first and light; consider a PWA later, don't add heavy deps casually.
