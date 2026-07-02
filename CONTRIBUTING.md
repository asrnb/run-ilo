# Contributing to run.ilo

Thanks for helping map every run in Iloilo. This guide covers local setup and the
conventions that keep the project consistent.

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
```

The app runs with no configuration using bundled sample races. For real data,
connect Supabase (see `README.md` → "Connect Supabase").

## Branches & commits

- Branch off `main`: `feature/og-images`, `fix/filter-reset`, etc.
- Keep commits small and present-tense: `add race-day reminder email`.
- Run `npm run build` before opening a PR — it must compile cleanly.

## Where things go

- **Data access:** `src/lib/events.ts` only. Components and pages never query
  Supabase directly.
- **Types:** `src/lib/types.ts`. The DB is snake_case; the app is camelCase. New
  columns must be added to the `fromRow()` mapping.
- **Formatting** (dates, gun starts, distances): `src/lib/format.ts`.
- **UI components:** `src/components/`. Reuse `DistancePills`, the `.data-label`
  and `.startline` classes, and the color tokens in `tailwind.config.ts` instead
  of hardcoding hex values.

## Adding a race

- **As an organizer/visitor:** use the `/submit` form. It lands in the admin
  moderation queue with `status=pending` and goes live only after approval.
- **As an admin:** `/admin/new` publishes immediately. `/admin` lists pending
  submissions to approve or reject.

## Data model notes

- `status`: `draft` → `pending` → `published`. Public pages show only
  `published`.
- `source`: `admin` | `submission` | `scraped` — track where a race came from.
- `distances`: integer kilometers, e.g. `{3,5,10,21,42}`.
- Row-level security lets the public read only published races; all writes use
  the service-role key in server routes.

## Before deploying publicly

- [ ] `/admin` and admin API routes are gated behind Supabase Auth (they are
      **open** by default — do not skip this).
- [ ] Real Supabase env vars set in the host (Vercel project settings).
- [ ] Seeded with real upcoming Iloilo races so the directory isn't empty.
- [x] Open Graph images render correctly when a race link is shared.

## Style

- TypeScript, no `any` where avoidable.
- Mobile-first — most users are on mid-range Android over mobile data. Keep
  dependencies and payloads light.
- Match the existing visual language (predawn navy → sunrise; mono for race data).
