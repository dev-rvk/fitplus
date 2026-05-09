# Auth Module

> Update this file when auth flow, session handling, or middleware changes.

## Overview

Custom JWT-based auth. No external auth provider. Passwords hashed with `bcryptjs` (10 rounds). Sessions are signed JWTs in `httpOnly` cookies (14-day TTL).

## Files

### Backend

| File | Purpose |
|------|---------|
| `lib/server/auth/session.ts` | `createSession()`, `clearSession()`, `getSessionUserId()` — JWT signing/verification via `jose` |
| `lib/server/auth/actions.ts` | Server actions: `loginAction()`, `registerAction()`, `logoutAction()` |
| `middleware.ts` | Route protection — validates JWT on every request |
| `lib/prisma.ts` | Singleton Prisma client |

### Frontend

| File | Purpose |
|------|---------|
| `app/(auth)/login/page.tsx` | Login form, calls `loginAction()` |
| `app/(auth)/register/page.tsx` | Register form, calls `registerAction()` |
| `app/(auth)/layout.tsx` | Auth layout (no bottom nav) |
| `components/shared/app-header.tsx` | Logout button, calls `logoutAction()` |

## Session flow

1. User submits login form → `loginAction()` server action
2. Server action finds user by email in `profiles` table, compares `bcrypt` hash
3. On success, signs a JWT with `{ sub: userId }` using `AUTH_JWT_SECRET`
4. Sets `fitplus_session` cookie (`httpOnly`, `sameSite: lax`, 14-day expiry)
5. Middleware reads this cookie on every request, verifies JWT
6. `getSessionUserId()` extracts `sub` from JWT for API route auth

## Middleware rules

- `/login`, `/register` → accessible without session; redirects to `/dashboard` if already authenticated
- `/api/*` → passed through (API route handles its own auth via `getSessionUserId()`)
- All other routes → require valid session; redirects to `/login` if missing
- Static assets (`_next/static`, `favicon.ico`, `icons`, `manifest`) are excluded from middleware

## Cookie name

`fitplus_session`

## Env dependency

`AUTH_JWT_SECRET` — must be set. Throws if missing.

## Component docs

- Login page: `docs/components/login-page.md`
- Register page: `docs/components/register-page.md`
- App header: `docs/components/app-header.md`
