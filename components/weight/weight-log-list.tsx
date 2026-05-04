"use client";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import type { WeightLog, WeightUnit } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EditWeightSheet } from "./edit-weight-sheet";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  logs: WeightLog[];
  loading: boolean;
  onEdit: (id: string, value: number, unit: WeightUnit, note?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function WeightLogList({ logs, loading, onEdit, onDelete }: Props) {
  const [editLog, setEditLog] = useState<WeightLog | null>(null);

  if (loading) return <Skeleton className="h-48 rounded-2xl" />;

  return (
    <>
      <Card className="rounded-2xl border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">All Entries</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 flex flex-col gap-0">
          {logs.length === 0 && (
            <p className="text-sm text-muted-foreground py-4 text-center">No entries yet</p>
          )}
          {logs.map((log, i) => (
            <div key={log.id} className={`flex items-center justify-between py-3 ${i < logs.length - 1 ? "border-b border-border" : ""}`}>
              <div>
                <p className="text-sm font-semibold text-foreground">{log.value} {log.unit}</p>
                <p className="text-xs text-muted-foreground">{format(parseISO(log.logged_at), "EEE, d MMM yyyy · HH:mm")}</p>
                {log.note && <p className="text-xs text-muted-foreground italic">{log.note}</p>}
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon-sm" onClick={() => setEditLog(log)}>
                  <Pencil className="size-3.5" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive">
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
            </div>
          ))}
        </CardContent>
      </Card>

      {editLog && (
        <EditWeightSheet
          log={editLog}
          open={!!editLog}
          onClose={() => setEditLog(null)}
          onSave={async (value, unit, note) => {
            await onEdit(editLog.id, value, unit, note);
            setEditLog(null);
          }}
        />
      )}
    </>
  );
}
