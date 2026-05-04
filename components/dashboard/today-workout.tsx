"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { db } from "@/lib/db";
import type { WorkoutLog } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TodayWorkout() {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    db.getWorkoutLogs({ from: today + "T00:00:00", to: today + "T23:59:59" }).then(setLogs).catch(() => {});
  }, [today]);

  if (logs.length === 0) {
    return (
      <Card className="rounded-2xl border-border/50 shadow-sm">
        <CardContent className="py-5">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="size-10 rounded-xl bg-muted flex items-center justify-center">
              <Dumbbell className="size-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No workout today</p>
            <p className="text-xs text-muted-foreground">Log your first session</p>
            <Button asChild size="sm" className="mt-1">
              <Link href="/workout/log">Log Workout</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Today&apos;s Workout</CardTitle>
          <Link href="/workout" className="text-xs text-primary flex items-center gap-0.5">
            View all <ChevronRight className="size-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex flex-col gap-2">
        {logs.map((log) => (
          <div key={log.id} className="flex items-center justify-between p-2 rounded-lg bg-muted">
            <div>
              <p className="text-sm font-medium text-foreground">{log.program?.name ?? "Custom Workout"}</p>
              <p className="text-xs text-muted-foreground">
                {log.exercises.length} exercises · {log.duration_minutes ? `${log.duration_minutes} min` : ""}
              </p>
            </div>
            <Badge variant="secondary" className="text-xs">{format(new Date(log.logged_at), "HH:mm")}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
