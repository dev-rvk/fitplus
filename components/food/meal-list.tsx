"use client";
import type { Meal } from "@/types";
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
  meals: Meal[];
  loading: boolean;
  onEdit: (meal: Meal) => void;
  onDelete: (id: string) => Promise<void>;
}

export function MealList({ meals, loading, onEdit, onDelete }: Props) {
  if (loading) return <Skeleton className="h-48 rounded-2xl" />;

  return (
    <Card className="rounded-2xl border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Meal Templates</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 flex flex-col gap-0">
        {meals.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">No meals yet. Tap + to create one.</p>
        )}
        {meals.map((meal, i) => (
          <div key={meal.id} className={`flex items-start justify-between py-3 ${i < meals.length - 1 ? "border-b border-border" : ""}`}>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{meal.name}</p>
              {meal.description && <p className="text-xs text-muted-foreground italic">{meal.description}</p>}
              <p className="text-xs text-muted-foreground mt-0.5">
                {meal.calories} kcal · P {meal.protein}g · C {meal.carbs}g · F {meal.fat}g
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="icon-sm" onClick={() => onEdit(meal)}>
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
                    <AlertDialogTitle>Delete meal?</AlertDialogTitle>
                    <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={() => onDelete(meal.id)}>Delete</AlertDialogAction>
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
