# Component: App Header

**File:** `components/shared/app-header.tsx`
**Type:** Client component (`"use client"`)

## Purpose
Top bar with page title, theme toggle (dark/light/system), and logout button.

## Props
None. Uses `usePathname()` to determine title.

## Page title mapping
| Path | Title |
|------|-------|
| `/dashboard` | `FitPlus` |
| `/weight` | `Weight` |
| `/food` | `Nutrition` |
| `/workout` | `Workouts` |

## Theme toggle
Cycles: light → dark → system. Uses `useTheme()` from `components/providers/theme-provider.tsx`.

## Logout
1. `cacheInvalidateAll()` — clears all localStorage cache
2. `logoutAction()` — server action, clears session cookie
3. `router.push("/login")` + `router.refresh()`

## Dependencies
- `lib/server/auth/actions.ts` → `logoutAction`
- `lib/cache/storage.ts` → `cacheInvalidateAll`
- Icons: `Sun`, `Moon`, `Monitor`, `LogOut`
