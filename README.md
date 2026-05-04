# FitPlus

Installable PWA fitness tracker built with **Next.js 15**, **Prisma 7**, **PostgreSQL**, and **Tailwind CSS v4**.

Track weight, nutrition, and workouts — all from your phone's home screen.

---

## Architecture

FitPlus uses **hexagonal architecture** (ports & adapters) for its database layer. This means the UI never talks to the database directly — it goes through a clean interface that can be swapped without touching any component code.

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌──────────────────┐
│  Components │ ──▶ │  CachedAdapter│ ──▶ │  HttpAdapter  │ ──▶ │  API Route       │
│  (client)   │     │  (decorator) │     │  (fetch)      │     │  /api/db         │
└─────────────┘     └──────────────┘     └───────────────┘     └────────┬─────────┘
                                                                        │
                                                                        ▼
                                                               ┌──────────────────┐
                                                               │ PrismaDbAdapter   │
                                                               │ (server-only)    │
                                                               └────────┬─────────┘
                                                                        │
                                                                        ▼
                                                               ┌──────────────────┐
                                                               │   PostgreSQL     │
                                                               │ (local / cloud)  │
                                                               └──────────────────┘
```

### Key files

| File | Purpose |
|------|---------|
| `lib/db/port.ts` | `DBPort` interface — the contract every adapter implements |
| `lib/db/http-adapter.ts` | Client-side adapter that calls the server API via `fetch` |
| `lib/db/cached-adapter.ts` | Decorator that adds `localStorage` caching on reads |
| `lib/server/adapters/prisma-db-adapter.ts` | Server-side Prisma implementation of `DBPort` |
| `app/api/db/route.ts` | API route that bridges client requests to the Prisma adapter |
| `lib/prisma.ts` | Singleton Prisma client (shared across all server code) |
| `prisma/schema.prisma` | Database schema (single source of truth) |
| `prisma.config.ts` | Prisma 7 config for CLI (migrations, datasource) |

---

## Database Strategy

FitPlus uses **Prisma as the only database layer**. There is no Supabase SDK — the database is always accessed through Prisma.

| Environment | Database | How |
|-------------|----------|-----|
| **Local dev** | Docker Compose PostgreSQL | `DATABASE_URL` points to `localhost:5432` |
| **Production** | Supabase PostgreSQL | `DATABASE_URL` points to your Supabase connection string |

To switch environments, just change `DATABASE_URL`. Nothing else needs to change.

---

## Quick Start

### Prerequisites
- [Node.js 18+](https://nodejs.org/) or [Bun](https://bun.sh/) (recommended)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for local PostgreSQL)

### One-command setup

```bash
# Clone and install
bun install
cp .env.example .env

# Start DB, generate client, run migrations, and seed — all at once
bun run db:setup
```

### Manual setup (step by step)

```bash
# 1. Install dependencies
bun install
cp .env.example .env

# 2. Start local PostgreSQL via Docker
bun run db:up

# 3. Generate Prisma client
bun run prisma:generate

# 4. Apply database migrations
bun run prisma:migrate:dev

# 5. Seed demo data (optional — creates admin@fitplus.app / Admin@1234)
bun run seed

# 6. Start dev server
bun run dev
```

> **Tip:** To stop the database, run `bun run db:down`.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `AUTH_JWT_SECRET` | ✅ | Secret for signing JWT session cookies (use 64+ random chars) |

### Local `.env` example
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fitplus"
AUTH_JWT_SECRET="dev-secret-change-me-in-production-use-a-64-char-random-string"
```

### Production (Vercel)
Set these in your Vercel project settings → Environment Variables:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres
AUTH_JWT_SECRET=your-production-secret-here
```

---

## Scripts

### App
| Script | Description |
|--------|-------------|
| `bun run dev` | Start dev server (Turbopack) |
| `bun run build` | Production build |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint |
| `bun run typecheck` | Run TypeScript type checker |

### Database
| Script | Description |
|--------|-------------|
| `bun run db:up` | Start local PostgreSQL (Docker Compose) |
| `bun run db:down` | Stop local PostgreSQL |
| `bun run db:setup` | **Full bootstrap**: start DB → generate → migrate → seed |

### Prisma
| Script | Description |
|--------|-------------|
| `bun run prisma:generate` | Generate Prisma client from schema |
| `bun run prisma:migrate:dev` | Create & apply migrations (local development) |
| `bun run prisma:migrate:deploy` | Apply existing migrations (production/CI) |
| `bun run prisma:migrate:reset` | Drop all data and re-run all migrations |
| `bun run prisma:studio` | Open Prisma Studio (visual DB browser) |
| `bun run seed` | Seed demo users and data |

---

## PWA (Progressive Web App)

FitPlus is a fully installable PWA. Users can add it to their home screen from any modern browser.

**What makes it installable:**
- `public/manifest.json` — app name, icons, display mode
- `public/sw.js` — service worker for offline caching
- Service worker registration in the root layout
- Proper meta tags and Apple touch icon

**Caching strategy:**
- **Static assets** (JS, CSS, fonts, images): cache-first
- **Pages**: network-first, cache-fallback
- **API calls**: never cached by the service worker (handled by the client-side cache layer instead)

---

## Auth

FitPlus uses a **custom JWT-based session** system. No external auth provider is needed.

- Passwords are hashed with `bcryptjs` (10 rounds)
- Sessions are signed JWTs stored in `httpOnly` cookies (14-day expiry)
- Middleware validates sessions on every request
- Session helper: `lib/server/auth/session.ts`
- Auth actions: `lib/server/auth/actions.ts`

### Demo accounts (after seeding)
| Email | Password |
|-------|----------|
| `admin@fitplus.app` | `Admin@1234` |
| `test@fitplus.app` | `Test@1234` |

---

## Deployment (Vercel + Supabase)

1. Push your code to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Create a PostgreSQL database in [Supabase](https://supabase.com)
4. In Vercel → Project Settings → Environment Variables, set:
   - `DATABASE_URL` = your Supabase PostgreSQL connection string
   - `AUTH_JWT_SECRET` = a long random secret
5. Deploy — Vercel will run `next build` automatically
6. Run migrations against the production database:
   ```bash
   DATABASE_URL="your-supabase-url" bunx prisma migrate deploy
   ```
