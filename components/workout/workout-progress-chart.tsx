"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO, eachDayOfInterval, subDays } from "date-fns";
import type { WorkoutLog } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  logs: WorkoutLog[];
  loading: boolean;
}

export function WorkoutProgressChart({ logs, loading }: Props) {
  if (loading) return <Skeleton className="h-52 rounded-2xl" />;
  if (logs.length === 0) {
    return (
      <Card className="rounded-2xl border-border/50 shadow-sm">
        <CardContent className="py-6 text-center">
          <p className="text-sm text-muted-foreground">Log workouts to see your progress</p>
        </CardContent>
      </Card>
    );
  }

  const totalSessions = logs.length;
  const totalSets = logs.reduce((s, l) => s + l.exercises.reduce((es, e) => es + e.sets.length, 0), 0);

  // Group by day
  const today = new Date();
  const days = 14;
  const interval = eachDayOfInterval({ start: subDays(today, days - 1), end: today });
  const data = interval.map((day) => {
    const dayStr = format(day, "yyyy-MM-dd");
    const dayLogs = logs.filter((l) => l.logged_at.startsWith(dayStr));
    const sets = dayLogs.reduce((s, l) => s + l.exercises.reduce((es, e) => es + e.sets.length, 0), 0);
    return { date: format(day, "d"), sessions: dayLogs.length, sets };
  });

  return (
    <Card className="rounded-2xl border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Workouts</CardTitle>
          <span className="text-xs text-muted-foreground">{totalSessions} sessions · {totalSets} sets</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} interval={1} />
              <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }}
                formatter={(v: number, name: string) => [v, name === "sessions" ? "Sessions" : "Sets"]}
              />
              <Bar dataKey="sessions" fill="var(--chart-4)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
