"use client";
import { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/db";
import type { Meal, MealInput } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { MealList } from "@/components/food/meal-list";
import { EditMealSheet } from "@/components/food/edit-meal-sheet";

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMeal, setEditMeal] = useState<Meal | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await db.getMeals();
      setMeals(data);
    } catch {
      toast.error("Failed to load meals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSave(input: MealInput) {
    try {
      if (editMeal) {
        await db.updateMeal(editMeal.id, input);
        toast.success("Meal updated!");
      } else {
        await db.addMeal(input);
        toast.success("Meal created!");
      }
      setEditMeal(null);
      setAddOpen(false);
      await load();
    } catch {
      toast.error("Failed to save meal");
    }
  }

  async function handleDelete(id: string) {
    try {
      await db.deleteMeal(id);
      toast.success("Deleted");
      await load();
    } catch {
      toast.error("Failed to delete");
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <MealList
        meals={meals}
        loading={loading}
        onEdit={(m) => setEditMeal(m)}
        onDelete={handleDelete}
      />
      <Button
        size="icon"
        className="fixed bottom-[5.5rem] right-4 z-50 size-14 rounded-full shadow-xl"
        onClick={() => setAddOpen(true)}
      >
        <Plus className="size-6" />
      </Button>
      <EditMealSheet
        meal={null}
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleSave}
      />
      {editMeal && (
        <EditMealSheet
          meal={editMeal}
          open={!!editMeal}
          onClose={() => setEditMeal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
