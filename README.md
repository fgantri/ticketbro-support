# TicketBro Support

Support and self-service center. See [SPEC.md](./SPEC.md) for scope and requirements.

## Development

```bash
npm install
npm run db:seed   # creates ticketbro.db, applies migrations, loads seed data
npm run dev
```

The app runs at http://localhost:3000.

## Stack

- Next.js 16 (App Router, React Server Components)
- SQLite via Drizzle ORM — the schema in `src/lib/db/schema.ts` is the single
  source of truth for both the database and the TypeScript types
- Tailwind CSS v4

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Lint with ESLint |
| `npm run db:generate` | Generate a migration from schema changes |
| `npm run db:seed` | Apply migrations and reload seed data (idempotent) |
| `npm run db:studio` | Browse the database in Drizzle Studio |

## Data model

One entity so far: `articles`. Help articles are titled as questions the user
would actually ask, and `home_rank` pins an article to the home page at a fixed
position — `NULL` means it is only reachable through search.

## API

| Route | Description |
| --- | --- |
| `GET /api/articles` | All articles, pinned ones first |
| `GET /api/articles?persona=customer` | Filter by persona (`customer`, `provider`) |
| `GET /api/articles?top` | Only articles pinned to the home page |
| `GET /api/articles?limit=6` | Cap the number of results |
