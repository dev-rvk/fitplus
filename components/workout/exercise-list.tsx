"use client";
import type { Exercise } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  exercises: Exercise[];
  loading: boolean;
  onEdit: (e: Exercise) => void;
  onDelete: (id: string) => Promise<void>;
}

export function ExerciseList({ exercises, loading, onEdit, onDelete }: Props) {
  if (loading) return <Skeleton className="h-48 rounded-2xl" />;

  return (
    <Card className="rounded-2xl border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Exercises</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 flex flex-col gap-0">
        {exercises.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">No exercises yet. Tap + to add one.</p>
        )}
        {exercises.map((ex, i) => (
          <div key={ex.id} className={`flex items-center justify-between py-3 ${i < exercises.length - 1 ? "border-b border-border" : ""}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium text-foreground">{ex.name}</p>
                {ex.muscle_group && <Badge variant="secondary" className="text-xs">{ex.muscle_group}</Badge>}
              </div>
              {ex.description && <p className="text-xs text-muted-foreground italic">{ex.description}</p>}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="icon-sm" onClick={() => onEdit(ex)}>
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
                    <AlertDialogTitle>Delete exercise?</AlertDialogTitle>
                    <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={() => onDelete(ex.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
