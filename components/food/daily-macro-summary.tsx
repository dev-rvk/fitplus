"use client";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { FoodLog } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  logs: FoodLog[];
  loading: boolean;
}

const TARGETS = { calories: 2200, protein: 150, carbs: 250, fat: 70 };

export function DailyMacroSummary({ logs, loading }: Props) {
  if (loading) return <Skeleton className="h-44 rounded-2xl" />;

  const totals = logs.reduce(
    (acc, l) => ({
      calories: acc.calories + l.calories,
      protein: acc.protein + l.protein,
      carbs: acc.carbs + l.carbs,
      fat: acc.fat + l.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const macros = [
    { name: "Protein", value: totals.protein, color: "var(--chart-2)", target: TARGETS.protein, unit: "g" },
    { name: "Carbs", value: totals.carbs, color: "var(--chart-4)", target: TARGETS.carbs, unit: "g" },
    { name: "Fat", value: totals.fat, color: "var(--chart-5)", target: TARGETS.fat, unit: "g" },
  ];

  const pct = Math.min(100, Math.round((totals.calories / TARGETS.calories) * 100));

  return (
    <Card className="rounded-2xl border-border/50 shadow-sm">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-4">
          <div className="relative size-28 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { value: totals.calories },
                    { value: Math.max(0, TARGETS.calories - totals.calories) },
                  ]}
                  cx="50%" cy="50%"
                  innerRadius={36} outerRadius={52}
                  startAngle={90} endAngle={-270}
                  dataKey="value" stroke="none"
                >
                  <Cell fill="var(--chart-1)" />
                  <Cell fill="var(--muted)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold leading-none">{totals.calories}</span>
              <span className="text-xs text-muted-foreground">kcal</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
              <span className="font-medium text-foreground">Today</span>
              <span>{pct}% of {TARGETS.calories}</span>
            </div>
            {macros.map((m) => (
              <div key={m.name} className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full shrink-0"
                  style={{ background: m.color }}
                />
                <div className="flex-1 flex justify-between text-xs">
                  <span className="text-muted-foreground">{m.name}</span>
                  <span className="font-medium">{Math.round(m.value)}{m.unit} <span className="text-muted-foreground">/ {m.target}{m.unit}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
