"use client";
import { useEffect, useState, useCallback } from "react";
import { subDays } from "date-fns";
import { db } from "@/lib/db";
import type { WorkoutLog } from "@/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { WorkoutLogList } from "@/components/workout/workout-log-list";
import { WorkoutProgressChart } from "@/components/workout/workout-progress-chart";

export default function WorkoutPage() {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"week" | "month" | "all">("month");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const now = new Date();
      const from =
        period === "week"
          ? subDays(now, 7).toISOString()
          : period === "month"
          ? subDays(now, 30).toISOString()
          : undefined;
      const data = await db.getWorkoutLogs(from ? { from } : undefined);
      setLogs(data);
    } catch {
      toast.error("Failed to load workouts");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id: string) {
    try {
      await db.deleteWorkoutLog(id);
      toast.success("Deleted");
      await load();
    } catch {
      toast.error("Failed to delete");
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      {/* Sub-navigation for exercises & programs */}
      <div className="flex gap-2">
        <Button asChild variant="outline" size="sm" className="flex-1 rounded-xl">
          <Link href="/workout/exercises">My Exercises</Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="flex-1 rounded-xl">
          <Link href="/workout/programs">My Programs</Link>
        </Button>
      </div>

      <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
        <TabsList className="w-full">
          <TabsTrigger value="week" className="flex-1">Week</TabsTrigger>
          <TabsTrigger value="month" className="flex-1">Month</TabsTrigger>
          <TabsTrigger value="all" className="flex-1">All Time</TabsTrigger>
        </TabsList>
        <TabsContent value={period} className="mt-4 flex flex-col gap-4">
          <WorkoutProgressChart logs={logs} loading={loading} />
          <WorkoutLogList logs={logs} loading={loading} onDelete={handleDelete} />
        </TabsContent>
      </Tabs>

      <Button
        size="icon"
        className="fixed bottom-[5.5rem] right-4 z-50 size-14 rounded-full shadow-xl"
        asChild
      >
        <Link href="/workout/log">
          <Plus className="size-6" />
        </Link>
      </Button>
    </div>
  );
}
