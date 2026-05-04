"use client";
import { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/db";
import type { WeightLog, WeightUnit } from "@/types";
import { WeightChart } from "@/components/weight/weight-chart";
import { WeightLogList } from "@/components/weight/weight-log-list";
import { AddWeightSheet } from "@/components/weight/add-weight-sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { subDays, startOfDay } from "date-fns";

export default function WeightPage() {
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"graph" | "history">("graph");
  const [period, setPeriod] = useState<"week" | "month" | "all">("week");
  const [addOpen, setAddOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      let from: string | undefined;
      
      if (view === "graph" && period !== "all") {
        const days = period === "week" ? 7 : 30;
        from = startOfDay(subDays(new Date(), days)).toISOString();
      }

      const data = await db.getWeightLogs(from ? { from } : undefined);
      setLogs(data);
    } catch {
      toast.error("Failed to load weight data");
    } finally {
      setLoading(false);
    }
  }, [view, period]);

  useEffect(() => { load(); }, [load]);

  async function handleAdd(value: number, unit: WeightUnit) {
    try {
      await db.addWeightLog({ value, unit, logged_at: new Date().toISOString() });
      setAddOpen(false);
      toast.success("Weight logged!");
      await load();
    } catch {
      toast.error("Failed to save weight");
    }
  }

  async function handleEdit(id: string, value: number, unit: WeightUnit, note?: string) {
    try {
      await db.updateWeightLog(id, { value, unit, note });
      toast.success("Updated!");
      await load();
    } catch {
      toast.error("Failed to update");
    }
  }

  async function handleDelete(id: string) {
    try {
      await db.deleteWeightLog(id);
      toast.success("Deleted");
      await load();
    } catch {
      toast.error("Failed to delete");
    }
  }

  return (
    <div className="flex flex-col gap-4 px-3 py-4">
      <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
        <TabsList className="w-full mb-2">
          <TabsTrigger value="graph" className="flex-1">Progress</TabsTrigger>
          <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
        </TabsList>

        <TabsContent value="graph" className="mt-0 flex flex-col gap-5">
          <div className="flex bg-muted/50 p-1 rounded-xl gap-1">
            {["week", "month", "all"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p as typeof period)}
                className={`flex-1 text-xs font-medium py-2 rounded-lg transition-colors ${
                  period === p ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>

          <WeightChart logs={logs} loading={loading} period={period} />
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <WeightLogList
            logs={logs}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>

      <Button
        size="icon"
        className="fixed bottom-[5.5rem] right-4 z-50 size-14 rounded-full shadow-xl"
        onClick={() => setAddOpen(true)}
      >
        <Plus className="size-6" />
      </Button>

      <AddWeightSheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleAdd}
      />
    </div>
  );
}
