# run.ilo

A community directory of runs, fun runs, and marathons in **Iloilo City,
Philippines**. Browse upcoming races, view route maps, and submit a race for
admin review....

## Stacks

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com) (Postgres + Row Level Security, Auth)
- [Leaflet](https://leafletjs.com) + OpenStreetMap for race maps (no API key needed)
- Deployed on [Vercel](https://vercel.com)

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

With no environment variables set, the app runs in **demo mode**: it falls
back to bundled sample data (`src/data/sample-events.ts`) and write paths
accept input without persisting anything. This means you can run and explore
the whole app with zero setup.

To connect a real database:

1. Copy `.env.example` to `.env.local` and fill in your Supabase project's URL,
   anon key, and service role key.
2. Run `supabase/migrations/0001_init.sql`, then `supabase/migrations/0002_admins.sql`,
   then `supabase/seed.sql` in the Supabase SQL editor.
3. Grant yourself admin access by inserting your auth user's id into the
   `admins` table (see the comment at the top of `0002_admins.sql`).

## Scripts

```bash
npm run dev      # start the dev server
npm run build    # production build — run this before pushing
npm run start    # run a production build locally
npm run lint     # lint the project
```

## Project structure

See [`CLAUDE.md`](./CLAUDE.md) for the architecture map, conventions, and
current roadmap. See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for contribution
guidelines and the pre-deploy checklist.

## License

Not currently licensed for reuse.
