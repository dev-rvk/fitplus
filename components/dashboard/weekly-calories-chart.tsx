"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { format, parseISO } from "date-fns";
import type { DailySummary } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  summaries: DailySummary[];
  loading: boolean;
}

export function WeeklyCaloriesChart({ summaries, loading }: Props) {
  if (loading) return <Skeleton className="h-48 rounded-2xl" />;

  const data = summaries.map((s) => ({
    day: format(parseISO(s.date), "EEE"),
    calories: Math.round(s.calories),
  }));

  const target = 2200;

  return (
    <Card className="rounded-2xl border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">7-Day Calories</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }}
                formatter={(v: number) => [`${v} kcal`, "Calories"]}
              />
              <ReferenceLine y={target} stroke="var(--chart-3)" strokeDasharray="4 2" strokeWidth={1.5} />
              <Bar dataKey="calories" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Target: {target} kcal/day</p>
      </CardContent>
    </Card>
  );
}
