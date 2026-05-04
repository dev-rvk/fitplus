"use client";
import { format, parseISO } from "date-fns";
import type { FoodLog } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  logs: FoodLog[];
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
}

export function FoodLogList({ logs, loading, onDelete }: Props) {
  if (loading) return <Skeleton className="h-48 rounded-2xl" />;

  return (
    <Card className="rounded-2xl border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Entries</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 flex flex-col gap-0">
        {logs.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">No entries yet</p>
        )}
        {logs.map((log, i) => (
          <div key={log.id} className={`flex items-center justify-between py-3 ${i < logs.length - 1 ? "border-b border-border" : ""}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium text-foreground">
                  {log.meal?.name ?? (log.note || "Manual entry")}
                </p>
                <Badge variant="secondary" className="text-xs shrink-0">
                  {log.entry_type === "meal" ? "Meal" : "Manual"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {log.calories} kcal · P {Math.round(log.protein)}g · C {Math.round(log.carbs)}g · F {Math.round(log.fat)}g
              </p>
              <p className="text-xs text-muted-foreground">{format(parseISO(log.logged_at), "HH:mm")}{log.portion_percent !== 100 ? ` · ${log.portion_percent}%` : ""}</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive shrink-0">
                  <Trash2 className="size-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete entry?</AlertDialogTitle>
                  <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={() => onDelete(log.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
