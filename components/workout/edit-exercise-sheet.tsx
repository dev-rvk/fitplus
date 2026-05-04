"use client";
import { useState, useEffect } from "react";
import type { Exercise, ExerciseInput } from "@/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const MUSCLE_GROUPS = ["Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Cardio", "Full Body", "Other"];

interface Props {
  exercise: Exercise | null;
  open: boolean;
  onClose: () => void;
  onSave: (input: ExerciseInput) => Promise<void>;
}

export function EditExerciseSheet({ exercise, open, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (exercise) {
      setName(exercise.name);
      setMuscleGroup(exercise.muscle_group ?? "");
      setDescription(exercise.description ?? "");
    } else {
      setName(""); setMuscleGroup(""); setDescription("");
    }
  }, [exercise, open]);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave({ name: name.trim(), muscle_group: muscleGroup || undefined, description: description.trim() || undefined });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl pb-safe-bottom">
        <SheetHeader className="mb-4">
          <SheetTitle>{exercise ? "Edit Exercise" : "New Exercise"}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-3">
          <div>
            <Label className="mb-1.5 block text-sm">Name</Label>
            <Input placeholder="Bench Press" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </div>
          <div>
            <Label className="mb-2 block text-sm">Muscle Group</Label>
            <div className="flex flex-wrap gap-2">
              {MUSCLE_GROUPS.map((g) => (
                <button
                  key={g}
                  onClick={() => setMuscleGroup(muscleGroup === g ? "" : g)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${muscleGroup === g ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-1.5 block text-sm">Description (optional)</Label>
            <Textarea placeholder="Flat barbell bench press" value={description} onChange={(e) => setDescription(e.target.value)} className="resize-none min-h-[60px]" />
          </div>
        </div>
        <SheetFooter className="mt-6 flex-row gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" onClick={handleSave} disabled={!name.trim() || saving}>
            {saving ? "Saving..." : exercise ? "Update" : "Create"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
