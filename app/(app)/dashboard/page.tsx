"use client";
import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { db } from "@/lib/db";
import type { DailySummary, WeightLog } from "@/types";
import { MetricCard } from "@/components/dashboard/metric-card";
import { WeeklyCaloriesChart } from "@/components/dashboard/weekly-calories-chart";
import { WeightSparkline } from "@/components/dashboard/weight-sparkline";
import { MacroRing } from "@/components/dashboard/macro-ring";
import { QuickAdd } from "@/components/dashboard/quick-add";
import { TodayWorkout } from "@/components/dashboard/today-workout";
import { Scale, Flame, Beef, Dumbbell } from "lucide-react";

export default function DashboardPage() {
  const [summaries, setSummaries] = useState<DailySummary[]>([]);
  const [recentWeight, setRecentWeight] = useState<WeightLog | null>(null);
  const [weeklyWeights, setWeeklyWeights] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(true);

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const weekAgo = format(subDays(new Date(), 6), "yyyy-MM-dd");

  useEffect(() => {
    async function load() {
      try {
        const [sums, latestWeights, weekWeights] = await Promise.all([
          db.getDailySummaries(weekAgo, todayStr + "T23:59:59"),
          db.getWeightLogs({ limit: 1 }),
          db.getWeightLogs({ from: weekAgo + "T00:00:00Z" }),
        ]);
        setSummaries(sums);
        setRecentWeight(latestWeights[0] ?? null);
        setWeeklyWeights(weekWeights);
      } catch {
        // handled silently
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [todayStr, weekAgo]);

  const today = summaries.find((s) => s.date === todayStr);
  const todayCalories = today?.calories ?? 0;
  const todayProtein = today?.protein ?? 0;
  const todayCarbs = today?.carbs ?? 0;
  const todayFat = today?.fat ?? 0;
  const todayWorkouts = today?.workout_count ?? 0;

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      {/* Greeting */}
      <div>
        <p suppressHydrationWarning className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
          {format(new Date(), "EEEE, MMMM d")}
        </p>
        <h2 className="text-xl font-bold text-foreground mt-0.5">Today&apos;s Summary</h2>
      </div>

      {/* Top metric cards */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          icon={Scale}
          label="Weight"
          value={recentWeight ? `${recentWeight.value} ${recentWeight.unit}` : "—"}
          subtitle="latest entry"
          colorClass="card-weight"
          loading={loading}
          href="/weight"
        />
        <MetricCard
          icon={Flame}
          label="Calories"
          value={todayCalories > 0 ? `${Math.round(todayCalories)}` : "—"}
          subtitle="kcal today"
          colorClass="card-calories"
          loading={loading}
          href="/food"
        />
        <MetricCard
          icon={Beef}
          label="Protein"
          value={todayProtein > 0 ? `${Math.round(todayProtein)}g` : "—"}
          subtitle="today"
          colorClass="card-protein"
          loading={loading}
          href="/food"
        />
        <MetricCard
          icon={Dumbbell}
          label="Workouts"
          value={todayWorkouts > 0 ? `${todayWorkouts}` : "—"}
          subtitle="today"
          colorClass="card-workout"
          loading={loading}
          href="/workout"
        />
      </div>

      {/* Macro ring */}
      {(todayCalories > 0) && (
        <MacroRing
          calories={todayCalories}
          protein={todayProtein}
          carbs={todayCarbs}
          fat={todayFat}
        />
      )}

      {/* 7-day calorie chart */}
      <WeeklyCaloriesChart summaries={summaries} loading={loading} />

      {/* Weight sparkline */}
      <WeightSparkline logs={weeklyWeights} loading={loading} />

      {/* Today's workout */}
      <TodayWorkout />

      {/* Quick add FAB */}
      <QuickAdd />
    </div>
  );
}
