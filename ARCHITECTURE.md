# Architecture

## Entities

### todos
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key, defaultRandom() |
| title | text | Not null |
| completed | boolean | Not null, default false |
| created_at | timestamptz | Not null, defaultNow() |
| updated_at | timestamptz | Not null, defaultNow() |

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Main todo UI — `ssr: false`, preloads `todosCollection` |
| `/api/todos` | Electric shape proxy (GET) — forwards to Electric service |
| `/api/mutations/todos` | Create todo (POST) |
| `/api/mutations/todos/$id` | Update (PATCH) / Delete (DELETE) todo |

## Components

- `src/routes/index.tsx` — Full todo page: input, filter tabs, todo list, footer

## Data Flow

1. **Read**: Electric syncs `todos` table → `todosCollection` → `useLiveQuery` → React UI
2. **Write**: `collection.insert/update/delete` → optimistic update in UI → fetch mutation route → Postgres → returns `txid` → Electric streams back confirmed state → optimistic state dropped
3. **Sync**: Electric shape proxy at `/api/todos` forwards browser requests to the Electric service, injecting server-side auth credentials
