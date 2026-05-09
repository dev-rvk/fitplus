# FitPlus — Agent Instructions

> **Rule:** When you change a feature, update the relevant AGENT.md file in `docs/`. If you add a new module, create a new `docs/<module>.md`.

## What is this app?

Installable PWA fitness tracker. Tracks weight, nutrition, and workouts. Mobile-first (portrait only), dark/light theme.

## Tech stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Runtime | Bun |
| DB | PostgreSQL (Docker local, Supabase prod) |
| ORM | Prisma 7 |
| Auth | Custom JWT sessions (`jose` + `bcryptjs`) |
| Styling | Tailwind CSS v4 + ShadCN UI |
| Charts | Recharts |
| Font | Inter (via `next/font`) |
| PWA | Service worker (`public/sw.js`) + `manifest.json` |

## Architecture

Hexagonal (ports & adapters). The UI never imports Prisma directly.

```
Client Components → db (lib/db/index.ts)
  → CachedAdapter (localStorage TTL decorator)
    → HttpAdapter (POST /api/db)
      → API Route (app/api/db/route.ts)
        → PrismaDbAdapter (lib/server/adapters/prisma-db-adapter.ts)
          → PostgreSQL
```

### Key constraint
- `lib/db/` is `"use client"` — no server imports allowed.
- `lib/server/` is server-only — never import from client components.
- All DB operations go through `DBPort` interface (`lib/db/port.ts`).

## Directory structure

```
app/
  (app)/          # Authenticated routes (dashboard, weight, food, workout)
  (auth)/         # Login, register pages
  api/db/         # Single API route bridging client → Prisma
  layout.tsx      # Root layout (font, theme, SW registration)
components/
  dashboard/      # Dashboard widgets (metric-card, charts, quick-add)
  food/           # Food/nutrition components
  weight/         # Weight tracking components
  workout/        # Workout components
  shared/         # Bottom nav, app header, error boundary, confirm dialog
  ui/             # ShadCN primitives
  providers/      # Theme provider
lib/
  db/             # Client-side DB layer (port, http-adapter, cached-adapter)
  cache/          # localStorage cache with TTL
  server/
    auth/         # JWT session + server actions (login, register, logout)
    adapters/     # PrismaDbAdapter
  prisma.ts       # Singleton Prisma client
  utils.ts        # cn() helper
types/index.ts    # All domain types (User, WeightLog, Meal, Exercise, etc.)
prisma/
  schema.prisma   # Single source of truth for DB schema
scripts/
  seed.ts         # Seeds demo data via Prisma
public/
  sw.js           # Service worker
  manifest.json   # PWA manifest
middleware.ts     # JWT validation, route protection
```

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `AUTH_JWT_SECRET` | ✅ | Secret for signing session JWTs (64+ chars) |

Local `.env`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fitplus"
AUTH_JWT_SECRET="dev-secret-change-me-in-production"
```

## Commands

| Script | What it does |
|--------|-------------|
| `bun run dev` | Start dev server (Turbopack) |
| `bun run build` | Production build |
| `bun run db:up` | Start local PostgreSQL (Docker) |
| `bun run db:down` | Stop local PostgreSQL |
| `bun run db:setup` | Full bootstrap: db:up → generate → migrate → seed |
| `bun run prisma:generate` | Generate Prisma client |
| `bun run prisma:migrate:dev` | Create/apply migrations |
| `bun run prisma:studio` | Visual DB browser |
| `bun run seed` | Seed demo users + data |
| `bun run typecheck` | TypeScript check |

## Docker Compose

File: `docker-compose.yaml` — runs PostgreSQL 15 on port 5432.
- User: `postgres`, Password: `postgres`, DB: `fitplus`
- Data persisted in `fitplus-db-data` volume.

## Demo accounts (after seed)

| Email | Password |
|-------|----------|
| `admin@fitplus.app` | `Admin@1234` |
| `test@fitplus.app` | `Test@1234` |

## Module docs

| Module | Doc path |
|--------|----------|
| Auth | `docs/auth.md` |
| Database layer | `docs/database.md` |
| Dashboard | `docs/dashboard.md` |
| Weight | `docs/weight.md` |
| Food / Nutrition | `docs/food.md` |
| Workout | `docs/workout.md` |

## Conventions

1. All pages are `"use client"` and call `db.*` from `@/lib/db`.
2. Types live in `types/index.ts`. Both `*` (read model) and `*Input` (write model) variants.
3. Prisma field names are camelCase; domain types use snake_case. The adapter maps between them.
4. Cache namespaces: `weight`, `food`, `meals`, `ingredients`, `exercises`, `programs`, `workout`, `summary`, `user`. Writes invalidate relevant namespaces.
5. Toast notifications via `sonner`. Success = `toast.success()`, error = `toast.error()`.
6. FAB (floating action button) positioned `fixed bottom-[5.5rem] right-4`.
7. ShadCN components in `components/ui/` — do not modify directly unless upgrading.
