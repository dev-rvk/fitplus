// ============================================================
// Core Domain Types
// ============================================================

export type WeightUnit = "kg" | "lbs";
export type QuantityType = "number" | "weight";
export type MacroEntry = { calories: number; protein: number; carbs: number; fat: number };

// ---- User ----
export interface User {
  id: string;
  email: string;
  name: string;
  weight_unit: WeightUnit;
  created_at: string;
}

// ---- Weight ----
export interface WeightLog {
  id: string;
  user_id: string;
  value: number;
  unit: WeightUnit;
  logged_at: string;
  note?: string;
}

export interface WeightLogInput {
  value: number;
  unit: WeightUnit;
  logged_at: string;
  note?: string;
}

// ---- Food / Nutrition ----
export interface Ingredient {
  id: string;
  user_id: string;
  name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  is_public: boolean;
  created_at: string;
}

export interface IngredientInput {
  name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
}

export interface MealIngredient {
  ingredient_id: string;
  ingredient?: Ingredient;
  quantity: number;
  quantity_type: QuantityType;
}

export interface Meal {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size?: number;
  ingredients?: MealIngredient[];
  is_public: boolean;
  created_at: string;
}

export interface MealInput {
  name: string;
  description?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size?: number;
  ingredients?: MealIngredient[];
}

export interface FoodLog {
  id: string;
  user_id: string;
  logged_at: string;
  entry_type: "manual" | "meal";
  meal_id?: string;
  meal?: Meal;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion_percent: number;
  note?: string;
}

export interface FoodLogInput {
  logged_at: string;
  entry_type: "manual" | "meal";
  meal_id?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion_percent: number;
  note?: string;
}

// ---- Workout ----
export interface Exercise {
  id: string;
  user_id: string;
  name: string;
  muscle_group?: string;
  description?: string;
  is_public: boolean;
  created_at: string;
}

export interface ExerciseInput {
  name: string;
  muscle_group?: string;
  description?: string;
}

export interface ProgramExercise {
  exercise_id: string;
  exercise?: Exercise;
  order_index: number;
  default_sets: number;
  default_reps: number;
}

export interface WorkoutProgram {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  exercises?: ProgramExercise[];
  created_at: string;
}

export interface WorkoutProgramInput {
  name: string;
  description?: string;
  exercises?: ProgramExercise[];
}

export interface SetLog {
  set_number: number;
  reps: number;
  weight?: number;
  weight_unit?: WeightUnit;
  note?: string;
}

export interface ExerciseLog {
  exercise_id: string;
  exercise?: Exercise;
  sets: SetLog[];
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  program_id?: string;
  program?: WorkoutProgram;
  logged_at: string;
  duration_minutes?: number;
  note?: string;
  exercises: ExerciseLog[];
}

export interface WorkoutLogInput {
  program_id?: string;
  logged_at: string;
  duration_minutes?: number;
  note?: string;
  exercises: ExerciseLog[];
}

// ---- Dashboard / Summary ----
export interface DailySummary {
  date: string;
  weight?: number;
  weight_unit?: WeightUnit;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  workout_count: number;
}

// ---- Auth ----
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}
