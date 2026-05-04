"use client";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, YAxis } from "recharts";
import { format, parseISO } from "date-fns";
import type { WeightLog } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

interface Props {
  logs: WeightLog[];
  loading: boolean;
}

export function WeightSparkline({ logs, loading }: Props) {
  if (loading) return <Skeleton className="h-40 rounded-2xl" />;

  const weightData = [...logs]
    .sort((a, b) => a.logged_at.localeCompare(b.logged_at))
    .map((s) => ({
      day: format(parseISO(s.logged_at), "d MMM"),
      weight: s.value,
      unit: s.unit,
    }));

  if (weightData.length < 2) return null;

  const first = weightData[0].weight;
  const last = weightData[weightData.length - 1].weight;
  const diff = last - first;
  const unit = weightData[0].unit;

  const TrendIcon = diff < -0.1 ? TrendingDown : diff > 0.1 ? TrendingUp : Minus;
  const trendColor = diff < -0.1 ? "text-chart-2" : diff > 0.1 ? "text-destructive" : "text-muted-foreground";

  return (
    <Card className="rounded-2xl border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Weekly Weight Trend</CardTitle>
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon className="size-3.5" />
            <span>{diff > 0 ? "+" : ""}{diff.toFixed(1)} {unit}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }}
                formatter={(v: number) => [`${v} ${unit}`, "Weight"]}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--chart-1)", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
