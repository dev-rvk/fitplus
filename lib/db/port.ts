/**
 * Database Port — the interface every adapter must implement.
 *
 * This follows the Hexagonal Architecture (ports & adapters) pattern.
 * To swap databases, implement this interface with a new adapter and
 * pass it to `createCachedAdapter()`.
 */
import type {
  User, WeightLog, WeightLogInput,
  Ingredient, IngredientInput,
  Meal, MealInput,
  FoodLog, FoodLogInput,
  Exercise, ExerciseInput,
  WorkoutProgram, WorkoutProgramInput,
  WorkoutLog, WorkoutLogInput,
  DailySummary,
} from "@/types";

export interface DBPort {
  // --- Auth / User ---
  getCurrentUser(): Promise<User | null>;
  updateUserProfile(data: Partial<Pick<User, "name" | "weight_unit">>): Promise<User>;

  // --- Weight ---
  getWeightLogs(opts?: { from?: string; to?: string; limit?: number }): Promise<WeightLog[]>;
  addWeightLog(input: WeightLogInput): Promise<WeightLog>;
  updateWeightLog(id: string, input: Partial<WeightLogInput>): Promise<WeightLog>;
  deleteWeightLog(id: string): Promise<void>;

  // --- Ingredients ---
  getIngredients(): Promise<Ingredient[]>;
  addIngredient(input: IngredientInput): Promise<Ingredient>;
  updateIngredient(id: string, input: Partial<IngredientInput>): Promise<Ingredient>;
  deleteIngredient(id: string): Promise<void>;

  // --- Meals ---
  getMeals(): Promise<Meal[]>;
  getMeal(id: string): Promise<Meal | null>;
  addMeal(input: MealInput): Promise<Meal>;
  updateMeal(id: string, input: Partial<MealInput>): Promise<Meal>;
  deleteMeal(id: string): Promise<void>;

  // --- Food Logs ---
  getFoodLogs(opts?: { from?: string; to?: string }): Promise<FoodLog[]>;
  addFoodLog(input: FoodLogInput): Promise<FoodLog>;
  updateFoodLog(id: string, input: Partial<FoodLogInput>): Promise<FoodLog>;
  deleteFoodLog(id: string): Promise<void>;

  // --- Exercises ---
  getExercises(): Promise<Exercise[]>;
  addExercise(input: ExerciseInput): Promise<Exercise>;
  updateExercise(id: string, input: Partial<ExerciseInput>): Promise<Exercise>;
  deleteExercise(id: string): Promise<void>;

  // --- Workout Programs ---
  getWorkoutPrograms(): Promise<WorkoutProgram[]>;
  getWorkoutProgram(id: string): Promise<WorkoutProgram | null>;
  addWorkoutProgram(input: WorkoutProgramInput): Promise<WorkoutProgram>;
  updateWorkoutProgram(id: string, input: Partial<WorkoutProgramInput>): Promise<WorkoutProgram>;
  deleteWorkoutProgram(id: string): Promise<void>;

  // --- Workout Logs ---
  getWorkoutLogs(opts?: { from?: string; to?: string }): Promise<WorkoutLog[]>;
  getWorkoutLog(id: string): Promise<WorkoutLog | null>;
  addWorkoutLog(input: WorkoutLogInput): Promise<WorkoutLog>;
  updateWorkoutLog(id: string, input: Partial<WorkoutLogInput>): Promise<WorkoutLog>;
  deleteWorkoutLog(id: string): Promise<void>;

  // --- Summary / Analytics ---
  getDailySummaries(from: string, to: string): Promise<DailySummary[]>;
}
