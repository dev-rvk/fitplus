"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function MacroRing({ calories, protein, carbs, fat }: Props) {
  const data = [
    { name: "Protein", value: Math.round(protein), color: "var(--chart-2)", cal: protein * 4 },
    { name: "Carbs", value: Math.round(carbs), color: "var(--chart-3)", cal: carbs * 4 },
    { name: "Fat", value: Math.round(fat), color: "var(--chart-4)", cal: fat * 9 },
  ];

  return (
    <Card className="rounded-2xl border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Today&apos;s Macros</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-4">
          <div className="w-28 h-28 relative flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={32} outerRadius={50} dataKey="cal" strokeWidth={0}>
                  {data.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "11px" }}
                  formatter={(v: number) => [`${Math.round(v)} kcal`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-bold text-foreground">{Math.round(calories)}</span>
              <span className="text-[9px] text-muted-foreground">kcal</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            {data.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="size-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-muted-foreground flex-1">{d.name}</span>
                <span className="text-xs font-semibold text-foreground">{d.value}g</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
