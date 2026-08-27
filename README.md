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

## Pages

| Route | Description |
| --- | --- |
| `/start` | Persona picker (provider disabled for the MVP) |
| `/` | Search bar and the six top questions |
| `/search?q=` | Ranked results; no match links on to find-booking |
| `/articles/[slug]` | A single article |
| `/find-booking` | Order number + email lookup |
| `/booking` | Header, diagnosis, actions and timeline for the looked-up order |
