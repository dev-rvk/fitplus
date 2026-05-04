"use client";

/**
 * Database instance — the single entry point for all DB operations.
 *
 * This wires together the hexagonal architecture:
 *   DBPort (interface) → HttpAdapter (implementation) → CachedAdapter (decorator)
 *
 * To swap the database, replace `httpAdapter` with any other DBPort implementation.
 */
import { httpAdapter } from "./http-adapter";
import { createCachedAdapter } from "./cached-adapter";
import type { DBPort } from "./port";

export const db: DBPort = createCachedAdapter(httpAdapter);

export { type DBPort } from "./port";
