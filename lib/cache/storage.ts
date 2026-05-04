"use client";

const VERSION = "v1";
const PREFIX = `fitplus:${VERSION}:`;

/** TTL per namespace in milliseconds */
const TTL_MS: Record<string, number> = {
  weight: 5 * 60_000,        // 5 min
  food: 5 * 60_000,           // 5 min
  meals: 30 * 60_000,         // 30 min — templates change rarely
  ingredients: 30 * 60_000,   // 30 min
  exercises: 30 * 60_000,     // 30 min
  programs: 30 * 60_000,      // 30 min
  workout: 5 * 60_000,        // 5 min
  summary: 5 * 60_000,        // 5 min
  user: 10 * 60_000,          // 10 min
};

const DEFAULT_TTL = 5 * 60_000;

interface CacheEntry<T> {
  data: T;
  ts: number;
}

function getStorage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function cacheGet<T>(key: string, ns: string): T | null {
  const store = getStorage();
  if (!store) return null;
  try {
    const raw = store.getItem(`${PREFIX}${key}`);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    const ttl = TTL_MS[ns] ?? DEFAULT_TTL;
    if (Date.now() - entry.ts > ttl) {
      store.removeItem(`${PREFIX}${key}`);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

export function cacheSet<T>(key: string, data: T): void {
  const store = getStorage();
  if (!store) return;
  try {
    const entry: CacheEntry<T> = { data, ts: Date.now() };
    store.setItem(`${PREFIX}${key}`, JSON.stringify(entry));
  } catch {
    // Storage quota exceeded — silently ignore
  }
}

/**
 * Invalidate all cache entries whose key contains the given pattern.
 * Uses exact namespace prefix matching to avoid accidental invalidation.
 */
export function cacheInvalidate(ns: string): void {
  const store = getStorage();
  if (!store) return;
  const matchPrefix = `${PREFIX}${ns}`;
  const keys: string[] = [];
  for (let i = 0; i < store.length; i++) {
    const k = store.key(i);
    if (k?.startsWith(matchPrefix)) keys.push(k);
  }
  keys.forEach((k) => store.removeItem(k));
}

/** Clear all FitPlus cache entries. Used on logout. */
export function cacheInvalidateAll(): void {
  const store = getStorage();
  if (!store) return;
  const keys: string[] = [];
  for (let i = 0; i < store.length; i++) {
    const k = store.key(i);
    if (k?.startsWith(PREFIX)) keys.push(k);
  }
  keys.forEach((k) => store.removeItem(k));
}
