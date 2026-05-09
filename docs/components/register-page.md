# Component: Register Page

**File:** `app/(auth)/register/page.tsx`
**Type:** Client component (`"use client"`)

## State
| State | Type | Default |
|-------|------|---------|
| `name` | `string` | `""` |
| `email` | `string` | `""` |
| `password` | `string` | `""` |
| `showPw` | `boolean` | `false` |
| `loading` | `boolean` | `false` |

## Behavior
- Client-side validation: password >= 8 chars
- Calls `registerAction({ email, password, name })` server action
- On success → `toast.success()` + redirect to `/dashboard`

## Dependencies
- `lib/server/auth/actions.ts` → `registerAction`
- ShadCN: `Button`, `Input`, `Card`, `Label`
