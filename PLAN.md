# Todo App — Implementation Plan

## App Description
A local-first, real-time todo application built with Electric SQL + TanStack DB. Tasks sync instantly across all open tabs and devices via Electric's Postgres-to-client sync.

## Data Model

### todos
- id: UUID, primary key, defaultRandom()
- title: text, notNull
- completed: boolean, notNull, default(false)
- created_at: timestamptz, notNull, defaultNow()
- updated_at: timestamptz, notNull, defaultNow()

## Implementation Tasks
- [x] Phase 1: Plan
- [ ] Phase 2: Discover playbook skills and read relevant ones
- [ ] Phase 3: Data model — schema, zod-schemas, migrations, tests
- [ ] Phase 4: Collections & API routes
- [ ] Phase 5: UI components
- [ ] Phase 6: Build, lint & test
- [ ] Phase 7: README.md & ARCHITECTURE.md
- [ ] Phase 8: Deploy & preview

## Design Conventions
- UUID primary keys with defaultRandom()
- timestamp({ withTimezone: true }) for all dates
- snake_case for SQL table/column names
- Foreign keys with onDelete: "cascade" where appropriate

## Features
- Add new todos with a text input
- Toggle todo completion (with optimistic update)
- Delete todos
- Filter view: All / Active / Completed
- Real-time sync via Electric SQL (changes appear instantly across tabs)
- Optimistic mutations with txid handshake for confirmed persistence
