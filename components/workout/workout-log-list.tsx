"use client";
import { format, parseISO } from "date-fns";
import type { WorkoutLog } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Trash2, Dumbbell } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  logs: WorkoutLog[];
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
}

export function WorkoutLogList({ logs, loading, onDelete }: Props) {
  if (loading) return <Skeleton className="h-48 rounded-2xl" />;

  return (
    <Card className="rounded-2xl border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Sessions</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 flex flex-col gap-0">
        {logs.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">No workouts yet</p>
        )}
        {logs.map((log, i) => {
          const totalSets = log.exercises.reduce((s, e) => s + e.sets.length, 0);
          return (
            <div key={log.id} className={`flex items-start justify-between py-3 ${i < logs.length - 1 ? "border-b border-border" : ""}`}>
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <Dumbbell className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {log.program?.name ?? "Custom Workout"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {log.exercises.length} exercise{log.exercises.length !== 1 ? "s" : ""} · {totalSets} sets
                    {log.duration_minutes ? ` · ${log.duration_minutes} min` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(parseISO(log.logged_at), "EEE, d MMM · HH:mm")}
                  </p>
                  {log.note && <p className="text-xs text-muted-foreground italic">{log.note}</p>}
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive shrink-0">
                    <Trash2 className="size-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent size="sm">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete workout?</AlertDialogTitle>
                    <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={() => onDelete(log.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
