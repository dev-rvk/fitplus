"use client";
import { useEffect, useState, useCallback } from "react";
import { startOfDay, endOfDay } from "date-fns";
import { db } from "@/lib/db";
import type { FoodLog, FoodLogInput } from "@/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { FoodLogList } from "@/components/food/food-log-list";
import { DailyMacroSummary } from "@/components/food/daily-macro-summary";
import { WeeklyNutritionChart } from "@/components/food/weekly-nutrition-chart";
import { AddFoodSheet } from "@/components/food/add-food-sheet";

export default function FoodPage() {
  const [logs, setLogs] = useState<FoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [period, setPeriod] = useState<"today" | "week" | "month">("today");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const now = new Date();
      const from =
        period === "today"
          ? startOfDay(now).toISOString()
          : period === "week"
          ? new Date(now.getTime() - 7 * 86400000).toISOString()
          : new Date(now.getTime() - 30 * 86400000).toISOString();
      const to = endOfDay(now).toISOString();
      const data = await db.getFoodLogs({ from, to });
      setLogs(data);
    } catch {
      toast.error("Failed to load nutrition data");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { load(); }, [load]);

  async function handleAdd(input: FoodLogInput) {
    try {
      await db.addFoodLog(input);
      setAddOpen(false);
      toast.success("Food logged!");
      await load();
    } catch {
      toast.error("Failed to save food log");
    }
  }

  async function handleDelete(id: string) {
    try {
      await db.deleteFoodLog(id);
      toast.success("Deleted");
      await load();
    } catch {
      toast.error("Failed to delete");
    }
  }

  const todayLogs = logs.filter((l) => {
    const d = new Date(l.logged_at);
    const today = new Date();
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  });

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      {/* Sub-navigation for meal templates */}
      <Button asChild variant="outline" size="sm" className="w-full rounded-xl">
        <Link href="/food/meals">My Meals &amp; Templates</Link>
      </Button>

      <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
        <TabsList className="w-full">
          <TabsTrigger value="today" className="flex-1">Today</TabsTrigger>
          <TabsTrigger value="week" className="flex-1">Week</TabsTrigger>
          <TabsTrigger value="month" className="flex-1">Month</TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="mt-4 flex flex-col gap-4">
          <DailyMacroSummary logs={todayLogs} loading={loading} />
          <FoodLogList logs={todayLogs} loading={loading} onDelete={handleDelete} />
        </TabsContent>
        <TabsContent value="week" className="mt-4 flex flex-col gap-4">
          <WeeklyNutritionChart logs={logs} loading={loading} days={7} />
          <FoodLogList logs={logs} loading={loading} onDelete={handleDelete} />
        </TabsContent>
        <TabsContent value="month" className="mt-4 flex flex-col gap-4">
          <WeeklyNutritionChart logs={logs} loading={loading} days={30} />
          <FoodLogList logs={logs} loading={loading} onDelete={handleDelete} />
        </TabsContent>
      </Tabs>

      <Button
        size="icon"
        className="fixed bottom-[5.5rem] right-4 z-50 size-14 rounded-full shadow-xl"
        onClick={() => setAddOpen(true)}
      >
        <Plus className="size-6" />
      </Button>

      <AddFoodSheet open={addOpen} onClose={() => setAddOpen(false)} onSave={handleAdd} />
    </div>
  );
}
