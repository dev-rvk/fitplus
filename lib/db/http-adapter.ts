"use client";

import type { DBPort } from "./port";

async function call<T>(method: keyof DBPort, ...args: unknown[]): Promise<T> {
  const res = await fetch("/api/db", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ method, args }),
  });

  const payload = (await res.json()) as { data?: T; error?: string };
  if (!res.ok || payload.error) {
    throw new Error(payload.error ?? "DB request failed");
  }
  return payload.data as T;
}

export const httpAdapter: DBPort = {
  getCurrentUser: () => call("getCurrentUser"),
  updateUserProfile: (data) => call("updateUserProfile", data),
  getWeightLogs: (opts) => call("getWeightLogs", opts),
  addWeightLog: (input) => call("addWeightLog", input),
  updateWeightLog: (id, input) => call("updateWeightLog", id, input),
  deleteWeightLog: (id) => call("deleteWeightLog", id),
  getIngredients: () => call("getIngredients"),
  addIngredient: (input) => call("addIngredient", input),
  updateIngredient: (id, input) => call("updateIngredient", id, input),
  deleteIngredient: (id) => call("deleteIngredient", id),
  getMeals: () => call("getMeals"),
  getMeal: (id) => call("getMeal", id),
  addMeal: (input) => call("addMeal", input),
  updateMeal: (id, input) => call("updateMeal", id, input),
  deleteMeal: (id) => call("deleteMeal", id),
  getFoodLogs: (opts) => call("getFoodLogs", opts),
  addFoodLog: (input) => call("addFoodLog", input),
  updateFoodLog: (id, input) => call("updateFoodLog", id, input),
  deleteFoodLog: (id) => call("deleteFoodLog", id),
  getExercises: () => call("getExercises"),
  addExercise: (input) => call("addExercise", input),
  updateExercise: (id, input) => call("updateExercise", id, input),
  deleteExercise: (id) => call("deleteExercise", id),
  getWorkoutPrograms: () => call("getWorkoutPrograms"),
  getWorkoutProgram: (id) => call("getWorkoutProgram", id),
  addWorkoutProgram: (input) => call("addWorkoutProgram", input),
  updateWorkoutProgram: (id, input) => call("updateWorkoutProgram", id, input),
  deleteWorkoutProgram: (id) => call("deleteWorkoutProgram", id),
  getWorkoutLogs: (opts) => call("getWorkoutLogs", opts),
  getWorkoutLog: (id) => call("getWorkoutLog", id),
  addWorkoutLog: (input) => call("addWorkoutLog", input),
  updateWorkoutLog: (id, input) => call("updateWorkoutLog", id, input),
  deleteWorkoutLog: (id) => call("deleteWorkoutLog", id),
  getDailySummaries: (from, to) => call("getDailySummaries", from, to),
};
