"use client";

import { cacheGet, cacheSet, cacheInvalidate } from "@/lib/cache/storage";
import type { DBPort } from "./port";

/**
 * Creates a caching decorator around any DBPort adapter.
 * 
 * This follows the decorator pattern: reads are served from localStorage
 * when cached and fresh, writes go through to the underlying adapter and
 * invalidate relevant cache namespaces.
 *
 * The adapter is injected via parameter — swap the underlying DB by passing
 * a different adapter instance.
 */
function withCache<T>(
  key: string,
  ns: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = cacheGet<T>(key, ns);
  if (cached !== null) return Promise.resolve(cached);
  return fetcher().then((data) => {
    cacheSet(key, data);
    return data;
  });
}

export function createCachedAdapter(adapter: DBPort): DBPort {
  return {
    getCurrentUser: () => adapter.getCurrentUser(),
    updateUserProfile: async (d) => {
      const r = await adapter.updateUserProfile(d);
      cacheInvalidate("user");
      return r;
    },

    getWeightLogs: (opts) =>
      withCache(
        `weight:${JSON.stringify(opts ?? {})}`,
        "weight",
        () => adapter.getWeightLogs(opts)
      ),
    addWeightLog: async (input) => {
      const r = await adapter.addWeightLog(input);
      cacheInvalidate("weight");
      cacheInvalidate("summary");
      return r;
    },
    updateWeightLog: async (id, input) => {
      const r = await adapter.updateWeightLog(id, input);
      cacheInvalidate("weight");
      cacheInvalidate("summary");
      return r;
    },
    deleteWeightLog: async (id) => {
      await adapter.deleteWeightLog(id);
      cacheInvalidate("weight");
      cacheInvalidate("summary");
    },

    getIngredients: () =>
      withCache("ingredients:all", "ingredients", () => adapter.getIngredients()),
    addIngredient: async (input) => {
      const r = await adapter.addIngredient(input);
      cacheInvalidate("ingredients");
      return r;
    },
    updateIngredient: async (id, input) => {
      const r = await adapter.updateIngredient(id, input);
      cacheInvalidate("ingredients");
      return r;
    },
    deleteIngredient: async (id) => {
      await adapter.deleteIngredient(id);
      cacheInvalidate("ingredients");
    },

    getMeals: () =>
      withCache("meals:all", "meals", () => adapter.getMeals()),
    getMeal: (id) =>
      withCache(`meals:${id}`, "meals", () => adapter.getMeal(id)),
    addMeal: async (input) => {
      const r = await adapter.addMeal(input);
      cacheInvalidate("meals");
      return r;
    },
    updateMeal: async (id, input) => {
      const r = await adapter.updateMeal(id, input);
      cacheInvalidate("meals");
      return r;
    },
    deleteMeal: async (id) => {
      await adapter.deleteMeal(id);
      cacheInvalidate("meals");
    },

    getFoodLogs: (opts) =>
      withCache(
        `food:${JSON.stringify(opts ?? {})}`,
        "food",
        () => adapter.getFoodLogs(opts)
      ),
    addFoodLog: async (input) => {
      const r = await adapter.addFoodLog(input);
      cacheInvalidate("food");
      cacheInvalidate("summary");
      return r;
    },
    updateFoodLog: async (id, input) => {
      const r = await adapter.updateFoodLog(id, input);
      cacheInvalidate("food");
      cacheInvalidate("summary");
      return r;
    },
    deleteFoodLog: async (id) => {
      await adapter.deleteFoodLog(id);
      cacheInvalidate("food");
      cacheInvalidate("summary");
    },

    getExercises: () =>
      withCache("exercises:all", "exercises", () => adapter.getExercises()),
    addExercise: async (input) => {
      const r = await adapter.addExercise(input);
      cacheInvalidate("exercises");
      return r;
    },
    updateExercise: async (id, input) => {
      const r = await adapter.updateExercise(id, input);
      cacheInvalidate("exercises");
      return r;
    },
    deleteExercise: async (id) => {
      await adapter.deleteExercise(id);
      cacheInvalidate("exercises");
    },

    getWorkoutPrograms: () =>
      withCache("programs:all", "programs", () => adapter.getWorkoutPrograms()),
    getWorkoutProgram: (id) =>
      withCache(`programs:${id}`, "programs", () => adapter.getWorkoutProgram(id)),
    addWorkoutProgram: async (input) => {
      const r = await adapter.addWorkoutProgram(input);
      cacheInvalidate("programs");
      return r;
    },
    updateWorkoutProgram: async (id, input) => {
      const r = await adapter.updateWorkoutProgram(id, input);
      cacheInvalidate("programs");
      return r;
    },
    deleteWorkoutProgram: async (id) => {
      await adapter.deleteWorkoutProgram(id);
      cacheInvalidate("programs");
    },

    getWorkoutLogs: (opts) =>
      withCache(
        `workout:${JSON.stringify(opts ?? {})}`,
        "workout",
        () => adapter.getWorkoutLogs(opts)
      ),
    getWorkoutLog: (id) =>
      withCache(`workout:${id}`, "workout", () => adapter.getWorkoutLog(id)),
    addWorkoutLog: async (input) => {
      const r = await adapter.addWorkoutLog(input);
      cacheInvalidate("workout");
      cacheInvalidate("summary");
      return r;
    },
    updateWorkoutLog: async (id, input) => {
      const r = await adapter.updateWorkoutLog(id, input);
      cacheInvalidate("workout");
      cacheInvalidate("summary");
      return r;
    },
    deleteWorkoutLog: async (id) => {
      await adapter.deleteWorkoutLog(id);
      cacheInvalidate("workout");
      cacheInvalidate("summary");
    },

    getDailySummaries: (from, to) =>
      withCache(
        `summary:${from}:${to}`,
        "summary",
        () => adapter.getDailySummaries(from, to)
      ),
  };
}
