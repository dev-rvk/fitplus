# Database Layer

> Update this file when `DBPort` interface changes, adapters are added/modified, or caching strategy changes.

## Architecture

Hexagonal (ports & adapters) with a caching decorator.

```
db (lib/db/index.ts)  ← single import for all components
  → createCachedAdapter(httpAdapter)
    → CachedAdapter (localStorage TTL)
      → HttpAdapter (POST /api/db with { method, args })
        → API Route (extracts userId from session)
          → createPrismaDbAdapter(userId)
            → Prisma → PostgreSQL
```

## Files

| File | Role |
|------|------|
| `lib/db/port.ts` | `DBPort` interface — contract for all adapters |
| `lib/db/http-adapter.ts` | Client-side adapter, `"use client"`, calls `POST /api/db` |
| `lib/db/cached-adapter.ts` | Decorator, wraps any `DBPort` with `localStorage` caching |
| `lib/db/index.ts` | Composition root — exports `db: DBPort` |
| `app/api/db/route.ts` | API route — auth check + method dispatch to Prisma adapter |
| `lib/server/adapters/prisma-db-adapter.ts` | Server-only Prisma implementation of `DBPort` |
| `lib/prisma.ts` | Singleton `PrismaClient` |
| `prisma/schema.prisma` | Database schema (source of truth) |
| `lib/cache/storage.ts` | `cacheGet()`, `cacheSet()`, `cacheInvalidate()`, `cacheInvalidateAll()` |
| `types/index.ts` | All domain types used by `DBPort` |

## DBPort methods

### User
- `getCurrentUser()` → `User | null`
- `updateUserProfile(data)` → `User`

### Weight
- `getWeightLogs(opts?)` → `WeightLog[]` (opts: `from`, `to`, `limit`)
- `addWeightLog(input)` → `WeightLog`
- `updateWeightLog(id, input)` → `WeightLog`
- `deleteWeightLog(id)` → `void`

### Ingredients
- `getIngredients()` → `Ingredient[]`
- `addIngredient(input)` / `updateIngredient(id, input)` / `deleteIngredient(id)`

### Meals
- `getMeals()` → `Meal[]` (includes `mealIngredients`)
- `getMeal(id)` → `Meal | null`
- `addMeal(input)` / `updateMeal(id, input)` / `deleteMeal(id)`

### Food Logs
- `getFoodLogs(opts?)` → `FoodLog[]` (opts: `from`, `to`)
- `addFoodLog(input)` / `updateFoodLog(id, input)` / `deleteFoodLog(id)`

### Exercises
- `getExercises()` → `Exercise[]`
- `addExercise(input)` / `updateExercise(id, input)` / `deleteExercise(id)`

### Workout Programs
- `getWorkoutPrograms()` → `WorkoutProgram[]` (includes exercises)
- `getWorkoutProgram(id)` → `WorkoutProgram | null`
- `addWorkoutProgram(input)` / `updateWorkoutProgram(id, input)` / `deleteWorkoutProgram(id)`

### Workout Logs
- `getWorkoutLogs(opts?)` → `WorkoutLog[]` (includes exercises + sets)
- `getWorkoutLog(id)` → `WorkoutLog | null`
- `addWorkoutLog(input)` / `updateWorkoutLog(id, input)` / `deleteWorkoutLog(id)`

### Summary
- `getDailySummaries(from, to)` → `DailySummary[]`

## Cache namespaces & TTL

| Namespace | TTL | Invalidated by |
|-----------|-----|----------------|
| `weight` | 5 min | add/update/delete weight log |
| `food` | 5 min | add/update/delete food log |
| `meals` | 30 min | add/update/delete meal |
| `ingredients` | 30 min | add/update/delete ingredient |
| `exercises` | 30 min | add/update/delete exercise |
| `programs` | 30 min | add/update/delete program |
| `workout` | 5 min | add/update/delete workout log |
| `summary` | 5 min | weight/food/workout changes |
| `user` | 10 min | profile updates |

## API route (`POST /api/db`)

Request body: `{ method: string, args?: unknown[] }`

- Validates session via `getSessionUserId()`
- Validates `method` against an allowlist
- Creates `PrismaDbAdapter(userId)` and calls the method
- Returns `{ data }` on success, `{ error }` on failure

## Adding a new DB method

1. Add method signature to `lib/db/port.ts` (`DBPort` interface)
2. Add matching type(s) to `types/index.ts` if needed
3. Implement in `lib/server/adapters/prisma-db-adapter.ts`
4. Add method name to `ALLOWED_METHODS` set in `app/api/db/route.ts`
5. Add passthrough in `lib/db/http-adapter.ts`
6. Add caching (or passthrough) in `lib/db/cached-adapter.ts`
7. Update Prisma schema if new tables/columns are needed → run `bun run prisma:migrate:dev`

## Prisma ↔ Domain type mapping

Prisma uses camelCase (`userId`, `loggedAt`). Domain types use snake_case (`user_id`, `logged_at`). The Prisma adapter maps between them. Helper functions: `toNumber()` converts `Decimal` → `number`, `iso()` converts `Date` → ISO string.
