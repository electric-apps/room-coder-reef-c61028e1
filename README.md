# Todo App

A local-first, real-time todo application powered by Electric SQL and TanStack DB. Changes sync instantly across all open tabs and devices.

## Features

- Add, complete, and delete todos
- Filter by All / Active / Completed
- Real-time sync across tabs via Electric SQL
- Optimistic mutations — UI updates instantly, confirmed by Postgres txid handshake
- Persistent storage in Postgres via Drizzle ORM

## Tech Stack

- **[Electric SQL](https://electric-sql.com)** — Postgres-to-client real-time sync
- **[TanStack DB](https://tanstack.com/db)** — reactive collections and optimistic mutations
- **[Drizzle ORM](https://orm.drizzle.team)** — schema definitions and migrations
- **[TanStack Start](https://tanstack.com/start)** — React meta-framework with SSR + server functions
- **[Radix UI Themes](https://www.radix-ui.com/themes)** — accessible component library

## Getting Started

```bash
pnpm install
pnpm drizzle-kit generate && pnpm drizzle-kit migrate
pnpm dev:start
```

The app runs at `http://localhost:8080`.

## Project Structure

```
src/
  db/
    schema.ts              # Drizzle table definitions
    zod-schemas.ts         # Zod schemas derived from Drizzle
    collections/todos.ts   # TanStack DB Electric collection
  routes/
    index.tsx              # Main todo UI (ssr: false)
    api/todos.ts           # Electric shape proxy
    api/mutations/
      todos.ts             # POST — create todo
      todos.$id.ts         # PATCH / DELETE — update / delete todo
```

## License

MIT
