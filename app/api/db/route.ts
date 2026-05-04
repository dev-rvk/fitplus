import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/server/auth/session";
import { createPrismaDbAdapter } from "@/lib/server/adapters/prisma-db-adapter";
import type { DBPort } from "@/lib/db/port";

type MethodName = keyof DBPort;
type DBRequestBody = { method: MethodName; args?: unknown[] };

const ALLOWED_METHODS = new Set<string>([
  "getCurrentUser", "updateUserProfile",
  "getWeightLogs", "addWeightLog", "updateWeightLog", "deleteWeightLog",
  "getIngredients", "addIngredient", "updateIngredient", "deleteIngredient",
  "getMeals", "getMeal", "addMeal", "updateMeal", "deleteMeal",
  "getFoodLogs", "addFoodLog", "updateFoodLog", "deleteFoodLog",
  "getExercises", "addExercise", "updateExercise", "deleteExercise",
  "getWorkoutPrograms", "getWorkoutProgram", "addWorkoutProgram", "updateWorkoutProgram", "deleteWorkoutProgram",
  "getWorkoutLogs", "getWorkoutLog", "addWorkoutLog", "updateWorkoutLog", "deleteWorkoutLog",
  "getDailySummaries",
]);

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized — your session has expired. Please log in again." },
      { status: 401 }
    );
  }

  let body: DBRequestBody;
  try {
    body = (await req.json()) as DBRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body — expected JSON with { method, args? }." },
      { status: 400 }
    );
  }

  const { method, args = [] } = body;

  if (!method || !ALLOWED_METHODS.has(method)) {
    return NextResponse.json(
      { error: `Invalid DB method "${method}". Allowed methods: ${[...ALLOWED_METHODS].join(", ")}.` },
      { status: 400 }
    );
  }

  const adapter = createPrismaDbAdapter(userId);
  const fn = adapter[method];

  try {
    const result = await (fn as (...params: unknown[]) => Promise<unknown>)(...args);
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error(`[FitPlus] DB error in ${method}:`, error);

    const message = error instanceof Error ? error.message : "Unexpected database error";
    const hint = message.includes("does not exist")
      ? " Run `bun run prisma:migrate:dev` to apply migrations."
      : message.includes("connect")
        ? " Ensure the database is running (`bun run db:up`)."
        : "";

    return NextResponse.json(
      { error: `Database error in ${method}: ${message}.${hint}` },
      { status: 500 }
    );
  }
}
