"use client";
import { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/db";
import type { Exercise, ExerciseInput } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ExerciseList } from "@/components/workout/exercise-list";
import { EditExerciseSheet } from "@/components/workout/edit-exercise-sheet";

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [editExercise, setEditExercise] = useState<Exercise | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await db.getExercises();
      setExercises(data);
    } catch {
      toast.error("Failed to load exercises");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSave(input: ExerciseInput) {
    try {
      if (editExercise) {
        await db.updateExercise(editExercise.id, input);
        toast.success("Updated!");
      } else {
        await db.addExercise(input);
        toast.success("Created!");
      }
      setEditExercise(null);
      setAddOpen(false);
      await load();
    } catch {
      toast.error("Failed to save exercise");
    }
  }

  async function handleDelete(id: string) {
    try {
      await db.deleteExercise(id);
      toast.success("Deleted");
      await load();
    } catch {
      toast.error("Failed to delete");
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <ExerciseList exercises={exercises} loading={loading} onEdit={setEditExercise} onDelete={handleDelete} />
      <Button
        size="icon"
        className="fixed bottom-[5.5rem] right-4 z-50 size-14 rounded-full shadow-xl"
        onClick={() => setAddOpen(true)}
      >
        <Plus className="size-6" />
      </Button>
      <EditExerciseSheet exercise={null} open={addOpen} onClose={() => setAddOpen(false)} onSave={handleSave} />
      {editExercise && (
        <EditExerciseSheet exercise={editExercise} open={!!editExercise} onClose={() => setEditExercise(null)} onSave={handleSave} />
      )}
    </div>
  );
}
