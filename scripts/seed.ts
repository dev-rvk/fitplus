import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function rand(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function upsertUser(email: string, password: string, name: string) {
  const existing = await prisma.profile.findUnique({ where: { email } });
  if (existing) return existing.id;
  const passwordHash = await hash(password, 10);
  const user = await prisma.profile.create({ data: { email, name, passwordHash } });
  return user.id;
}

async function seedForUser(userId: string) {
  await prisma.weightLog.createMany({
    data: Array.from({ length: 21 }, (_, i) => ({
      userId,
      value: +(78 - i * 0.15 + rand(-0.3, 0.3)).toFixed(1),
      unit: "kg",
      loggedAt: daysAgo(20 - i),
      note: i === 0 ? "Starting weight" : i === 20 ? "Current" : null,
    })),
  });

  const exercises = await Promise.all(
    ["Bench Press", "Squat", "Deadlift", "Overhead Press", "Barbell Row"].map((name) =>
      prisma.exercise.create({ data: { userId, name, isPublic: false } })
    )
  );

  const meals = await Promise.all(
    ["Eggs & Toast", "Chicken & Rice", "Protein Shake"].map((name, i) =>
      prisma.meal.create({
        data: {
          userId,
          name,
          calories: 300 + i * 100,
          protein: 20 + i * 8,
          carbs: 25 + i * 7,
          fat: 8 + i * 3,
        },
      })
    )
  );

  await prisma.foodLog.createMany({
    data: Array.from({ length: 30 }, (_, i) => {
      const meal = meals[i % meals.length];
      return {
        userId,
        loggedAt: daysAgo(i % 20),
        entryType: "meal",
        mealId: meal.id,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        portionPercent: 100,
        note: i % 5 === 0 ? "Demo entry" : null,
      };
    }),
  });

  const program = await prisma.workoutProgram.create({
    data: { userId, name: "Demo Program", description: "Push/Pull mix" },
  });

  await prisma.programExercise.createMany({
    data: exercises.map((ex: { id: string }, idx: number) => ({
      programId: program.id,
      exerciseId: ex.id,
      orderIndex: idx,
      defaultSets: 3,
      defaultReps: 10,
    })),
  });

  for (const day of [1, 3, 5, 8, 10, 13, 16, 19]) {
    const workout = await prisma.workoutLog.create({
      data: {
        userId,
        programId: program.id,
        loggedAt: daysAgo(day),
        durationMinutes: randInt(35, 65),
      },
    });

    for (const ex of exercises.slice(0, 3)) {
      const exLog = await prisma.workoutExerciseLog.create({
        data: { workoutLogId: workout.id, exerciseId: ex.id },
      });
      await prisma.setLog.createMany({
        data: Array.from({ length: 3 }, (_, si) => ({
          workoutExerciseLogId: exLog.id,
          setNumber: si + 1,
          reps: randInt(6, 12),
          weight: randInt(20, 90),
          weightUnit: "kg",
        })),
      });
    }
  }
}

async function main() {
  console.log("Seeding with Prisma...");
  const adminId = await upsertUser("admin@fitplus.app", "Admin@1234", "Admin User");
  const testId = await upsertUser("test@fitplus.app", "Test@1234", "Test User");
  await seedForUser(adminId);
  await seedForUser(testId);
  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
