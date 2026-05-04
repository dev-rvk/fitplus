"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { format, parseISO, eachDayOfInterval, subDays, startOfDay } from "date-fns";
import type { FoodLog } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  logs: FoodLog[];
  loading: boolean;
  days: number;
}

export function WeeklyNutritionChart({ logs, loading, days }: Props) {
  if (loading) return <Skeleton className="h-52 rounded-2xl" />;

  const today = new Date();
  const interval = eachDayOfInterval({ start: subDays(today, days - 1), end: today });

  const data = interval.map((day) => {
    const dayStr = format(day, "yyyy-MM-dd");
    const dayLogs = logs.filter((l) => l.logged_at.startsWith(dayStr));
    return {
      date: format(day, days <= 7 ? "EEE" : "d MMM"),
      calories: Math.round(dayLogs.reduce((s, l) => s + l.calories, 0)),
      protein: Math.round(dayLogs.reduce((s, l) => s + l.protein, 0)),
    };
  });

  const avgCalories = Math.round(data.reduce((s, d) => s + d.calories, 0) / data.length);

  return (
    <Card className="rounded-2xl border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Calories</CardTitle>
          <span className="text-xs text-muted-foreground">Avg {avgCalories} kcal</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} interval={days <= 7 ? 0 : "preserveStartEnd"} />
              <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <ReferenceLine y={2200} stroke="var(--chart-3)" strokeDasharray="4 2" strokeWidth={1} />
              <Tooltip
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }}
                formatter={(v: number, name: string) => [name === "calories" ? `${v} kcal` : `${v}g`, name === "calories" ? "Calories" : "Protein"]}
              />
              <Bar dataKey="calories" fill="var(--chart-1)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
