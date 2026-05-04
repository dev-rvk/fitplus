"use client";
import type { WorkoutProgram } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  programs: WorkoutProgram[];
  loading: boolean;
  onEdit: (p: WorkoutProgram) => void;
  onDelete: (id: string) => Promise<void>;
}

export function ProgramList({ programs, loading, onEdit, onDelete }: Props) {
  if (loading) return <Skeleton className="h-48 rounded-2xl" />;

  return (
    <Card className="rounded-2xl border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Programs</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 flex flex-col gap-0">
        {programs.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">No programs yet. Tap + to create one.</p>
        )}
        {programs.map((prog, i) => (
          <div key={prog.id} className={`flex items-start justify-between py-3 ${i < programs.length - 1 ? "border-b border-border" : ""}`}>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{prog.name}</p>
              {prog.description && <p className="text-xs text-muted-foreground italic">{prog.description}</p>}
              {prog.exercises && (
                <p className="text-xs text-muted-foreground mt-0.5">{prog.exercises.length} exercise{prog.exercises.length !== 1 ? "s" : ""}</p>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="icon-sm" onClick={() => onEdit(prog)}>
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
                    <AlertDialogTitle>Delete program?</AlertDialogTitle>
                    <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={() => onDelete(prog.id)}>Delete</AlertDialogAction>
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
