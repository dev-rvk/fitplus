"use client";
import { useState, useEffect } from "react";
import type { WorkoutProgram, WorkoutProgramInput, Exercise, ProgramExercise } from "@/types";
import { db } from "@/lib/db";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface ExerciseRow {
  exerciseId: string;
  defaultSets: string;
  defaultReps: string;
}

interface Props {
  program: WorkoutProgram | null;
  open: boolean;
  onClose: () => void;
  onSave: (input: WorkoutProgramInput) => Promise<void>;
}

export function EditProgramSheet({ program, open, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rows, setRows] = useState<ExerciseRow[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    db.getExercises().then(setExercises).catch(() => {});
  }, []);

  useEffect(() => {
    if (program) {
      setName(program.name);
      setDescription(program.description ?? "");
      setRows(
        (program.exercises ?? [])
          .sort((a, b) => a.order_index - b.order_index)
          .map((pe) => ({
            exerciseId: pe.exercise_id,
            defaultSets: String(pe.default_sets),
            defaultReps: String(pe.default_reps),
          }))
      );
    } else {
      setName(""); setDescription(""); setRows([]);
    }
  }, [program, open]);

  function addRow() {
    setRows((prev) => [...prev, { exerciseId: "", defaultSets: "3", defaultReps: "10" }]);
  }

  function removeRow(i: number) {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateRow(i: number, field: keyof ExerciseRow, value: string) {
    setRows((prev) => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
  }

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const programExercises: ProgramExercise[] = rows
        .filter((r) => r.exerciseId)
        .map((r, i) => ({
          exercise_id: r.exerciseId,
          order_index: i,
          default_sets: parseInt(r.defaultSets) || 3,
          default_reps: parseInt(r.defaultReps) || 10,
        }));
      await onSave({ name: name.trim(), description: description.trim() || undefined, exercises: programExercises });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl pb-safe-bottom max-h-[90vh] overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>{program ? "Edit Program" : "New Program"}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-3">
          <div>
            <Label className="mb-1.5 block text-sm">Name</Label>
            <Input placeholder="Push Day" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </div>
          <div>
            <Label className="mb-1.5 block text-sm">Description (optional)</Label>
            <Textarea placeholder="Upper body push exercises" value={description} onChange={(e) => setDescription(e.target.value)} className="resize-none min-h-[56px]" />
          </div>
          <Label className="text-sm">Exercises</Label>
          {rows.map((row, i) => (
            <div key={i} className="flex gap-2 items-end">
              <div className="flex-1">
                <Select value={row.exerciseId || "none"} onValueChange={(v) => updateRow(i, "exerciseId", v === "none" ? "" : v)}>
                  <SelectTrigger className="w-full h-9 text-sm">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select exercise</SelectItem>
                    {exercises.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-12">
                <Label className="text-xs text-muted-foreground block mb-1">Sets</Label>
                <Input type="number" value={row.defaultSets} onChange={(e) => updateRow(i, "defaultSets", e.target.value)} className="h-9 text-center text-sm px-2" />
              </div>
              <div className="w-12">
                <Label className="text-xs text-muted-foreground block mb-1">Reps</Label>
                <Input type="number" value={row.defaultReps} onChange={(e) => updateRow(i, "defaultReps", e.target.value)} className="h-9 text-center text-sm px-2" />
              </div>
              <Button variant="ghost" size="icon-sm" className="text-destructive mb-0.5" onClick={() => removeRow(i)}>
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full text-xs" onClick={addRow}>
            <Plus className="size-3.5 mr-1" /> Add Exercise
          </Button>
        </div>
        <SheetFooter className="mt-6 flex-row gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" onClick={handleSave} disabled={!name.trim() || saving}>
            {saving ? "Saving..." : program ? "Update" : "Create"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
