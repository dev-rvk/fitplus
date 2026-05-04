"use client";
import { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/db";
import type { WorkoutProgram, WorkoutProgramInput } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ProgramList } from "@/components/workout/program-list";
import { EditProgramSheet } from "@/components/workout/edit-program-sheet";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [editProgram, setEditProgram] = useState<WorkoutProgram | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await db.getWorkoutPrograms();
      setPrograms(data);
    } catch {
      toast.error("Failed to load programs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSave(input: WorkoutProgramInput) {
    try {
      if (editProgram) {
        await db.updateWorkoutProgram(editProgram.id, input);
        toast.success("Program updated!");
      } else {
        await db.addWorkoutProgram(input);
        toast.success("Program created!");
      }
      setEditProgram(null);
      setAddOpen(false);
      await load();
    } catch {
      toast.error("Failed to save program");
    }
  }

  async function handleDelete(id: string) {
    try {
      await db.deleteWorkoutProgram(id);
      toast.success("Deleted");
      await load();
    } catch {
      toast.error("Failed to delete");
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <ProgramList programs={programs} loading={loading} onEdit={setEditProgram} onDelete={handleDelete} />
      <Button
        size="icon"
        className="fixed bottom-[5.5rem] right-4 z-50 size-14 rounded-full shadow-xl"
        onClick={() => setAddOpen(true)}
      >
        <Plus className="size-6" />
      </Button>
      <EditProgramSheet program={null} open={addOpen} onClose={() => setAddOpen(false)} onSave={handleSave} />
      {editProgram && (
        <EditProgramSheet program={editProgram} open={!!editProgram} onClose={() => setEditProgram(null)} onSave={handleSave} />
      )}
    </div>
  );
}
