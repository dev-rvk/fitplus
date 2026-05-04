"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { format, parseISO } from "date-fns";
import type { WeightLog } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

interface Props {
  logs: WeightLog[];
  loading: boolean;
  period: "week" | "month" | "all";
}

const CustomXAxisTick = ({ x, y, payload, period }: any) => {
  const date = parseISO(payload.value);
  let line1 = "";
  let line2 = "";

  if (period === "week") {
    line1 = format(date, "d");
    line2 = format(date, "MMM");
  } else {
    line1 = format(date, "MMM");
    line2 = format(date, "yyyy");
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={10} dy={0} textAnchor="middle" fill="var(--muted-foreground)" fontSize={10} fontWeight={500}>
        {line1}
      </text>
      <text x={0} y={22} dy={0} textAnchor="middle" fill="var(--muted-foreground)" fontSize={9} opacity={0.7}>
        {line2}
      </text>
    </g>
  );
};

export function WeightChart({ logs, loading, period }: Props) {
  if (loading) return <Skeleton className="h-52 rounded-2xl" />;
  if (logs.length < 2) {
    return (
      <Card className="rounded-2xl border-border/50 shadow-sm mx-1">
        <CardContent className="py-12 text-center">
          <p className="text-sm text-muted-foreground">Log at least 2 entries to see progress chart.</p>
        </CardContent>
      </Card>
    );
  }

  const sorted = [...logs].sort((a, b) => a.logged_at.localeCompare(b.logged_at));
  const data = sorted.map((l) => ({ rawDate: l.logged_at, weight: l.value }));
  const unit = sorted[0].unit;
  const first = sorted[0].value;
  const last = sorted[sorted.length - 1].value;
  const diff = last - first;
  const avg = sorted.reduce((s, l) => s + l.value, 0) / sorted.length;

  const TrendIcon = diff < -0.1 ? TrendingDown : diff > 0.1 ? TrendingUp : Minus;
  const trendColor = diff < -0.1 ? "text-green-500" : diff > 0.1 ? "text-destructive" : "text-muted-foreground";

  return (
    <Card className="rounded-2xl border-border/50 shadow-sm mx-1">
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Trend</CardTitle>
          <div className={`flex items-center gap-1 text-xs font-semibold ${trendColor} bg-muted/30 px-2 py-0.5 rounded-md`}>
            <TrendIcon className="size-3.5" />
            <span>{diff > 0 ? "+" : ""}{diff.toFixed(1)} {unit}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-4 px-2">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.5} />
              <XAxis 
                dataKey="rawDate" 
                tick={(props) => <CustomXAxisTick {...props} period={period} />} 
                axisLine={false} 
                tickLine={false} 
                interval="preserveStartEnd"
                tickMargin={12}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontWeight: 500 }} 
                axisLine={false} 
                tickLine={false} 
                domain={["auto", "auto"]} 
                width={45}
              />
              <ReferenceLine y={avg} stroke="var(--chart-3)" strokeDasharray="4 4" strokeWidth={1} opacity={0.6} />
              <Tooltip
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                labelFormatter={(label) => format(parseISO(label as string), "EEE, d MMM yyyy")}
                formatter={(v: number) => [`${v} ${unit}`, "Weight"]}
                cursor={{ stroke: "var(--border)", strokeWidth: 1, strokeDasharray: "4 4" }}
              />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="var(--chart-1)" 
                strokeWidth={3} 
                dot={{ r: 4, fill: "var(--background)", stroke: "var(--chart-1)", strokeWidth: 2 }} 
                activeDot={{ r: 6, fill: "var(--chart-1)", stroke: "var(--background)", strokeWidth: 2 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between text-[11px] font-medium text-muted-foreground mt-4 px-4 bg-muted/20 py-2 rounded-lg">
          <div className="flex flex-col items-center">
            <span className="uppercase text-[9px] tracking-wider mb-0.5">Start</span>
            <span className="text-foreground">{first} {unit}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="uppercase text-[9px] tracking-wider mb-0.5">Avg</span>
            <span className="text-foreground">{avg.toFixed(1)} {unit}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="uppercase text-[9px] tracking-wider mb-0.5">Now</span>
            <span className="text-foreground">{last} {unit}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
