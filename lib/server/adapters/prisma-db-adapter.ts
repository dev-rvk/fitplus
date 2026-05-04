import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { DBPort } from "@/lib/db/port";
import type { DailySummary, FoodLog, Meal, WorkoutLog } from "@/types";

const toNumber = (value: Prisma.Decimal | number | null | undefined): number =>
  value == null ? 0 : Number(value);

const iso = (value: Date | string): string => (value instanceof Date ? value.toISOString() : value);

function mapMeal(meal: any): Meal {
  return {
    id: meal.id,
    user_id: meal.userId,
    name: meal.name,
    description: meal.description ?? undefined,
    calories: toNumber(meal.calories),
    protein: toNumber(meal.protein),
    carbs: toNumber(meal.carbs),
    fat: toNumber(meal.fat),
    serving_size: meal.servingSize == null ? undefined : toNumber(meal.servingSize),
    is_public: meal.isPublic,
    created_at: iso(meal.createdAt),
    ingredients: meal.mealIngredients?.map((mi: any) => ({
      ingredient_id: mi.ingredientId,
      ingredient: mi.ingredient
        ? {
            id: mi.ingredient.id,
            user_id: mi.ingredient.userId,
            name: mi.ingredient.name,
            calories_per_100g: toNumber(mi.ingredient.caloriesPer100),
            protein_per_100g: toNumber(mi.ingredient.proteinPer100),
            carbs_per_100g: toNumber(mi.ingredient.carbsPer100),
            fat_per_100g: toNumber(mi.ingredient.fatPer100),
            is_public: mi.ingredient.isPublic,
            created_at: iso(mi.ingredient.createdAt),
          }
        : undefined,
      quantity: toNumber(mi.quantity),
      quantity_type: mi.quantityType,
    })),
  };
}

function mapFoodLog(log: any): FoodLog {
  return {
    id: log.id,
    user_id: log.userId,
    logged_at: iso(log.loggedAt),
    entry_type: log.entryType,
    meal_id: log.mealId ?? undefined,
    meal: log.meal ? mapMeal(log.meal) : undefined,
    calories: toNumber(log.calories),
    protein: toNumber(log.protein),
    carbs: toNumber(log.carbs),
    fat: toNumber(log.fat),
    portion_percent: toNumber(log.portionPercent),
    note: log.note ?? undefined,
  };
}

function mapWorkoutLog(log: any): WorkoutLog {
  return {
    id: log.id,
    user_id: log.userId,
    program_id: log.programId ?? undefined,
    program: log.program
      ? {
          id: log.program.id,
          user_id: log.program.userId,
          name: log.program.name,
          description: log.program.description ?? undefined,
          created_at: iso(log.program.createdAt),
        }
      : undefined,
    logged_at: iso(log.loggedAt),
    duration_minutes: log.durationMinutes ?? undefined,
    note: log.note ?? undefined,
    exercises:
      log.exercises?.map((el: any) => ({
        exercise_id: el.exerciseId,
        exercise: el.exercise
          ? {
              id: el.exercise.id,
              user_id: el.exercise.userId,
              name: el.exercise.name,
              muscle_group: el.exercise.muscleGroup ?? undefined,
              description: el.exercise.description ?? undefined,
              is_public: el.exercise.isPublic,
              created_at: iso(el.exercise.createdAt),
            }
          : undefined,
        sets:
          el.setLogs?.map((s: any) => ({
            set_number: s.setNumber,
            reps: s.reps,
            weight: s.weight == null ? undefined : toNumber(s.weight),
            weight_unit: s.weightUnit ?? undefined,
            note: s.note ?? undefined,
          })) ?? [],
      })) ?? [],
  };
}

export function createPrismaDbAdapter(userId: string): DBPort {
  return {
    async getCurrentUser() {
      const user = await prisma.profile.findUnique({ where: { id: userId } });
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        weight_unit: user.weightUnit,
        created_at: iso(user.createdAt),
      };
    },
    async updateUserProfile(data) {
      const user = await prisma.profile.update({
        where: { id: userId },
        data: { name: data.name, weightUnit: data.weight_unit },
      });
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        weight_unit: user.weightUnit,
        created_at: iso(user.createdAt),
      };
    },
    async getWeightLogs(opts) {
      const rows = await prisma.weightLog.findMany({
        where: {
          userId,
          loggedAt: { gte: opts?.from ? new Date(opts.from) : undefined, lte: opts?.to ? new Date(opts.to) : undefined },
        },
        take: opts?.limit,
        orderBy: { loggedAt: "desc" },
      });
      return rows.map((r: any) => ({
        id: r.id,
        user_id: r.userId,
        value: toNumber(r.value),
        unit: r.unit,
        logged_at: iso(r.loggedAt),
        note: r.note ?? undefined,
      }));
    },
    async addWeightLog(input) {
      const row = await prisma.weightLog.create({
        data: { userId, value: input.value, unit: input.unit, loggedAt: new Date(input.logged_at), note: input.note },
      });
      return {
        id: row.id,
        user_id: row.userId,
        value: toNumber(row.value),
        unit: row.unit,
        logged_at: iso(row.loggedAt),
        note: row.note ?? undefined,
      };
    },
    async updateWeightLog(id, input) {
      const row = await prisma.weightLog.update({
        where: { id },
        data: { value: input.value, unit: input.unit, loggedAt: input.logged_at ? new Date(input.logged_at) : undefined, note: input.note },
      });
      return { id: row.id, user_id: row.userId, value: toNumber(row.value), unit: row.unit, logged_at: iso(row.loggedAt), note: row.note ?? undefined };
    },
    async deleteWeightLog(id) {
      await prisma.weightLog.delete({ where: { id } });
    },
    async getIngredients() {
      const rows = await prisma.ingredient.findMany({
        where: { OR: [{ userId }, { isPublic: true }] },
        orderBy: { name: "asc" },
      });
      return rows.map((r: any) => ({
        id: r.id,
        user_id: r.userId,
        name: r.name,
        calories_per_100g: toNumber(r.caloriesPer100),
        protein_per_100g: toNumber(r.proteinPer100),
        carbs_per_100g: toNumber(r.carbsPer100),
        fat_per_100g: toNumber(r.fatPer100),
        is_public: r.isPublic,
        created_at: iso(r.createdAt),
      }));
    },
    async addIngredient(input) {
      const r = await prisma.ingredient.create({ data: { userId, ...input } });
      return {
        id: r.id,
        user_id: r.userId,
        name: r.name,
        calories_per_100g: toNumber(r.caloriesPer100),
        protein_per_100g: toNumber(r.proteinPer100),
        carbs_per_100g: toNumber(r.carbsPer100),
        fat_per_100g: toNumber(r.fatPer100),
        is_public: r.isPublic,
        created_at: iso(r.createdAt),
      };
    },
    async updateIngredient(id, input) {
      const r = await prisma.ingredient.update({
        where: { id },
        data: {
          name: input.name,
          caloriesPer100: input.calories_per_100g,
          proteinPer100: input.protein_per_100g,
          carbsPer100: input.carbs_per_100g,
          fatPer100: input.fat_per_100g,
        },
      });
      return {
        id: r.id,
        user_id: r.userId,
        name: r.name,
        calories_per_100g: toNumber(r.caloriesPer100),
        protein_per_100g: toNumber(r.proteinPer100),
        carbs_per_100g: toNumber(r.carbsPer100),
        fat_per_100g: toNumber(r.fatPer100),
        is_public: r.isPublic,
        created_at: iso(r.createdAt),
      };
    },
    async deleteIngredient(id) {
      await prisma.ingredient.delete({ where: { id } });
    },
    async getMeals() {
      const rows = await prisma.meal.findMany({
        where: { OR: [{ userId }, { isPublic: true }] },
        include: { mealIngredients: { include: { ingredient: true } } },
        orderBy: { name: "asc" },
      });
      return rows.map(mapMeal);
    },
    async getMeal(id) {
      const row = await prisma.meal.findUnique({
        where: { id },
        include: { mealIngredients: { include: { ingredient: true } } },
      });
      return row ? mapMeal(row) : null;
    },
    async addMeal(input) {
      const row = await prisma.meal.create({
        data: {
          userId,
          name: input.name,
          description: input.description,
          calories: input.calories,
          protein: input.protein,
          carbs: input.carbs,
          fat: input.fat,
          servingSize: input.serving_size,
          mealIngredients: input.ingredients?.length
            ? {
                create: input.ingredients.map((i) => ({
                  ingredientId: i.ingredient_id,
                  quantity: i.quantity,
                  quantityType: i.quantity_type,
                })),
              }
            : undefined,
        },
        include: { mealIngredients: { include: { ingredient: true } } },
      });
      return mapMeal(row);
    },
    async updateMeal(id, input) {
      await prisma.meal.update({
        where: { id },
        data: {
          name: input.name,
          description: input.description,
          calories: input.calories,
          protein: input.protein,
          carbs: input.carbs,
          fat: input.fat,
          servingSize: input.serving_size,
        },
      });
      if (input.ingredients !== undefined) {
        await prisma.mealIngredient.deleteMany({ where: { mealId: id } });
        if (input.ingredients.length) {
          await prisma.mealIngredient.createMany({
            data: input.ingredients.map((i) => ({
              mealId: id,
              ingredientId: i.ingredient_id,
              quantity: i.quantity,
              quantityType: i.quantity_type,
            })),
          });
        }
      }
      const row = await prisma.meal.findUniqueOrThrow({
        where: { id },
        include: { mealIngredients: { include: { ingredient: true } } },
      });
      return mapMeal(row);
    },
    async deleteMeal(id) {
      await prisma.meal.delete({ where: { id } });
    },
    async getFoodLogs(opts) {
      const rows = await prisma.foodLog.findMany({
        where: {
          userId,
          loggedAt: { gte: opts?.from ? new Date(opts.from) : undefined, lte: opts?.to ? new Date(opts.to) : undefined },
        },
        include: { meal: { include: { mealIngredients: { include: { ingredient: true } } } } },
        orderBy: { loggedAt: "desc" },
      });
      return rows.map(mapFoodLog);
    },
    async addFoodLog(input) {
      const row = await prisma.foodLog.create({
        data: {
          userId,
          loggedAt: new Date(input.logged_at),
          entryType: input.entry_type,
          mealId: input.meal_id,
          calories: input.calories,
          protein: input.protein,
          carbs: input.carbs,
          fat: input.fat,
          portionPercent: input.portion_percent,
          note: input.note,
        },
        include: { meal: { include: { mealIngredients: { include: { ingredient: true } } } } },
      });
      return mapFoodLog(row);
    },
    async updateFoodLog(id, input) {
      const row = await prisma.foodLog.update({
        where: { id },
        data: {
          loggedAt: input.logged_at ? new Date(input.logged_at) : undefined,
          entryType: input.entry_type,
          mealId: input.meal_id,
          calories: input.calories,
          protein: input.protein,
          carbs: input.carbs,
          fat: input.fat,
          portionPercent: input.portion_percent,
          note: input.note,
        },
        include: { meal: { include: { mealIngredients: { include: { ingredient: true } } } } },
      });
      return mapFoodLog(row);
    },
    async deleteFoodLog(id) {
      await prisma.foodLog.delete({ where: { id } });
    },
    async getExercises() {
      const rows = await prisma.exercise.findMany({
        where: { OR: [{ userId }, { isPublic: true }] },
        orderBy: { name: "asc" },
      });
      return rows.map((r: any) => ({
        id: r.id,
        user_id: r.userId,
        name: r.name,
        muscle_group: r.muscleGroup ?? undefined,
        description: r.description ?? undefined,
        is_public: r.isPublic,
        created_at: iso(r.createdAt),
      }));
    },
    async addExercise(input) {
      const r = await prisma.exercise.create({ data: { userId, name: input.name, muscleGroup: input.muscle_group, description: input.description } });
      return {
        id: r.id,
        user_id: r.userId,
        name: r.name,
        muscle_group: r.muscleGroup ?? undefined,
        description: r.description ?? undefined,
        is_public: r.isPublic,
        created_at: iso(r.createdAt),
      };
    },
    async updateExercise(id, input) {
      const r = await prisma.exercise.update({ where: { id }, data: { name: input.name, muscleGroup: input.muscle_group, description: input.description } });
      return {
        id: r.id,
        user_id: r.userId,
        name: r.name,
        muscle_group: r.muscleGroup ?? undefined,
        description: r.description ?? undefined,
        is_public: r.isPublic,
        created_at: iso(r.createdAt),
      };
    },
    async deleteExercise(id) {
      await prisma.exercise.delete({ where: { id } });
    },
    async getWorkoutPrograms() {
      const rows = await prisma.workoutProgram.findMany({
        where: { userId },
        include: { exercises: { include: { exercise: true }, orderBy: { orderIndex: "asc" } } },
        orderBy: { name: "asc" },
      });
      return rows.map((p: any) => ({
        id: p.id,
        user_id: p.userId,
        name: p.name,
        description: p.description ?? undefined,
        created_at: iso(p.createdAt),
        exercises: p.exercises.map((pe: any) => ({
          exercise_id: pe.exerciseId,
          exercise: {
            id: pe.exercise.id,
            user_id: pe.exercise.userId,
            name: pe.exercise.name,
            muscle_group: pe.exercise.muscleGroup ?? undefined,
            description: pe.exercise.description ?? undefined,
            is_public: pe.exercise.isPublic,
            created_at: iso(pe.exercise.createdAt),
          },
          order_index: pe.orderIndex,
          default_sets: pe.defaultSets,
          default_reps: pe.defaultReps,
        })),
      }));
    },
    async getWorkoutProgram(id) {
      const p = await prisma.workoutProgram.findUnique({
        where: { id },
        include: { exercises: { include: { exercise: true }, orderBy: { orderIndex: "asc" } } },
      });
      if (!p) return null;
      return {
        id: p.id,
        user_id: p.userId,
        name: p.name,
        description: p.description ?? undefined,
        created_at: iso(p.createdAt),
        exercises: p.exercises.map((pe: any) => ({
          exercise_id: pe.exerciseId,
          exercise: {
            id: pe.exercise.id,
            user_id: pe.exercise.userId,
            name: pe.exercise.name,
            muscle_group: pe.exercise.muscleGroup ?? undefined,
            description: pe.exercise.description ?? undefined,
            is_public: pe.exercise.isPublic,
            created_at: iso(pe.exercise.createdAt),
          },
          order_index: pe.orderIndex,
          default_sets: pe.defaultSets,
          default_reps: pe.defaultReps,
        })),
      };
    },
    async addWorkoutProgram(input) {
      const p = await prisma.workoutProgram.create({
        data: {
          userId,
          name: input.name,
          description: input.description,
          exercises: input.exercises?.length
            ? {
                create: input.exercises.map((e) => ({
                  exerciseId: e.exercise_id,
                  orderIndex: e.order_index,
                  defaultSets: e.default_sets,
                  defaultReps: e.default_reps,
                })),
              }
            : undefined,
        },
        include: { exercises: { include: { exercise: true }, orderBy: { orderIndex: "asc" } } },
      });
      return {
        id: p.id,
        user_id: p.userId,
        name: p.name,
        description: p.description ?? undefined,
        created_at: iso(p.createdAt),
        exercises: p.exercises.map((pe: any) => ({
          exercise_id: pe.exerciseId,
          exercise: {
            id: pe.exercise.id,
            user_id: pe.exercise.userId,
            name: pe.exercise.name,
            muscle_group: pe.exercise.muscleGroup ?? undefined,
            description: pe.exercise.description ?? undefined,
            is_public: pe.exercise.isPublic,
            created_at: iso(pe.exercise.createdAt),
          },
          order_index: pe.orderIndex,
          default_sets: pe.defaultSets,
          default_reps: pe.defaultReps,
        })),
      };
    },
    async updateWorkoutProgram(id, input) {
      await prisma.workoutProgram.update({
        where: { id },
        data: { name: input.name, description: input.description },
      });
      if (input.exercises !== undefined) {
        await prisma.programExercise.deleteMany({ where: { programId: id } });
        if (input.exercises.length) {
          await prisma.programExercise.createMany({
            data: input.exercises.map((e) => ({
              programId: id,
              exerciseId: e.exercise_id,
              orderIndex: e.order_index,
              defaultSets: e.default_sets,
              defaultReps: e.default_reps,
            })),
          });
        }
      }
      const p = await prisma.workoutProgram.findUniqueOrThrow({
        where: { id },
        include: { exercises: { include: { exercise: true }, orderBy: { orderIndex: "asc" } } },
      });
      return {
        id: p.id,
        user_id: p.userId,
        name: p.name,
        description: p.description ?? undefined,
        created_at: iso(p.createdAt),
        exercises: p.exercises.map((pe: any) => ({
          exercise_id: pe.exerciseId,
          exercise: {
            id: pe.exercise.id,
            user_id: pe.exercise.userId,
            name: pe.exercise.name,
            muscle_group: pe.exercise.muscleGroup ?? undefined,
            description: pe.exercise.description ?? undefined,
            is_public: pe.exercise.isPublic,
            created_at: iso(pe.exercise.createdAt),
          },
          order_index: pe.orderIndex,
          default_sets: pe.defaultSets,
          default_reps: pe.defaultReps,
        })),
      };
    },
    async deleteWorkoutProgram(id) {
      await prisma.workoutProgram.delete({ where: { id } });
    },
    async getWorkoutLogs(opts) {
      const rows = await prisma.workoutLog.findMany({
        where: {
          userId,
          loggedAt: { gte: opts?.from ? new Date(opts.from) : undefined, lte: opts?.to ? new Date(opts.to) : undefined },
        },
        include: {
          program: true,
          exercises: { include: { exercise: true, setLogs: { orderBy: { setNumber: "asc" } } } },
        },
        orderBy: { loggedAt: "desc" },
      });
      return rows.map(mapWorkoutLog);
    },
    async getWorkoutLog(id) {
      const row = await prisma.workoutLog.findUnique({
        where: { id },
        include: {
          program: true,
          exercises: { include: { exercise: true, setLogs: { orderBy: { setNumber: "asc" } } } },
        },
      });
      return row ? mapWorkoutLog(row) : null;
    },
    async addWorkoutLog(input) {
      const row = await prisma.workoutLog.create({
        data: {
          userId,
          programId: input.program_id,
          loggedAt: new Date(input.logged_at),
          durationMinutes: input.duration_minutes,
          note: input.note,
          exercises: {
            create: input.exercises.map((e) => ({
              exerciseId: e.exercise_id,
              setLogs: {
                create: e.sets.map((s) => ({
                  setNumber: s.set_number,
                  reps: s.reps,
                  weight: s.weight,
                  weightUnit: s.weight_unit,
                  note: s.note,
                })),
              },
            })),
          },
        },
        include: {
          program: true,
          exercises: { include: { exercise: true, setLogs: { orderBy: { setNumber: "asc" } } } },
        },
      });
      return mapWorkoutLog(row);
    },
    async updateWorkoutLog(id, input) {
      await prisma.workoutLog.update({
        where: { id },
        data: {
          programId: input.program_id,
          loggedAt: input.logged_at ? new Date(input.logged_at) : undefined,
          durationMinutes: input.duration_minutes,
          note: input.note,
        },
      });
      if (input.exercises !== undefined) {
        await prisma.workoutExerciseLog.deleteMany({ where: { workoutLogId: id } });
        if (input.exercises.length) {
          for (const e of input.exercises) {
            await prisma.workoutExerciseLog.create({
              data: {
                workoutLogId: id,
                exerciseId: e.exercise_id,
                setLogs: {
                  create: e.sets.map((s) => ({
                    setNumber: s.set_number,
                    reps: s.reps,
                    weight: s.weight,
                    weightUnit: s.weight_unit,
                    note: s.note,
                  })),
                },
              },
            });
          }
        }
      }
      const row = await prisma.workoutLog.findUniqueOrThrow({
        where: { id },
        include: {
          program: true,
          exercises: { include: { exercise: true, setLogs: { orderBy: { setNumber: "asc" } } } },
        },
      });
      return mapWorkoutLog(row);
    },
    async deleteWorkoutLog(id) {
      await prisma.workoutLog.delete({ where: { id } });
    },
    async getDailySummaries(from, to) {
      const [weights, foodLogs, workoutLogs] = await Promise.all([
        prisma.weightLog.findMany({ where: { userId, loggedAt: { gte: new Date(from), lte: new Date(to) } } }),
        prisma.foodLog.findMany({ where: { userId, loggedAt: { gte: new Date(from), lte: new Date(to) } } }),
        prisma.workoutLog.findMany({ where: { userId, loggedAt: { gte: new Date(from), lte: new Date(to) } }, select: { loggedAt: true } }),
      ]);

      const byDate: Record<string, DailySummary> = {};
      const addDay = (date: string) => {
        if (!byDate[date]) byDate[date] = { date, calories: 0, protein: 0, carbs: 0, fat: 0, workout_count: 0 };
      };

      for (const w of weights) {
        const d = iso(w.loggedAt).slice(0, 10);
        addDay(d);
        byDate[d].weight = toNumber(w.value);
        byDate[d].weight_unit = w.unit;
      }
      for (const f of foodLogs) {
        const d = iso(f.loggedAt).slice(0, 10);
        addDay(d);
        byDate[d].calories += toNumber(f.calories);
        byDate[d].protein += toNumber(f.protein);
        byDate[d].carbs += toNumber(f.carbs);
        byDate[d].fat += toNumber(f.fat);
      }
      for (const wl of workoutLogs) {
        const d = iso(wl.loggedAt).slice(0, 10);
        addDay(d);
        byDate[d].workout_count += 1;
      }
      return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
    },
  };
}
