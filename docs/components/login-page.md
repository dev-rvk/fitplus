# Component: Login Page

**File:** `app/(auth)/login/page.tsx`
**Type:** Client component (`"use client"`)

## Props
None (page component).

## State
| State | Type | Default |
|-------|------|---------|
| `email` | `string` | `""` |
| `password` | `string` | `""` |
| `showPw` | `boolean` | `false` |
| `loading` | `boolean` | `false` |

## Behavior
- Calls `loginAction({ email, password })` server action on submit
- On success → `router.push("/dashboard")` + `router.refresh()`
- On error → `toast.error(res.error)`
- Shows demo credentials in a muted box at bottom

## Dependencies
- `lib/server/auth/actions.ts` → `loginAction`
- ShadCN: `Button`, `Input`, `Card`, `Label`
- Icons: `Activity`, `Eye`, `EyeOff`
