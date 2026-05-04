"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/db";
import type { Exercise, WorkoutProgram, ExerciseLog, SetLog, WorkoutLogInput } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface SetEntry {
  reps: string;
  weight: string;
}

interface ExerciseEntry {
  exerciseId: string;
  sets: SetEntry[];
}

export default function LogWorkoutPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [loading, setLoading] = useState(true);

  const [programId, setProgramId] = useState<string>("none");
  const [duration, setDuration] = useState("");
  const [note, setNote] = useState("");
  const [exerciseEntries, setExerciseEntries] = useState<ExerciseEntry[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([db.getExercises(), db.getWorkoutPrograms()])
      .then(([exs, progs]) => { setExercises(exs); setPrograms(progs); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleProgramChange(id: string) {
    setProgramId(id);
    if (id === "none") { setExerciseEntries([]); return; }
    const prog = programs.find((p) => p.id === id);
    if (!prog?.exercises) return;
    const entries = prog.exercises
      .sort((a, b) => a.order_index - b.order_index)
      .map((pe) => ({
        exerciseId: pe.exercise_id,
        sets: Array.from({ length: pe.default_sets }, () => ({ reps: String(pe.default_reps), weight: "" })),
      }));
    setExerciseEntries(entries);
  }

  function addExercise() {
    setExerciseEntries((prev) => [...prev, { exerciseId: "", sets: [{ reps: "10", weight: "" }] }]);
  }

  function removeExercise(i: number) {
    setExerciseEntries((prev) => prev.filter((_, idx) => idx !== i));
  }

  function addSet(exIdx: number) {
    setExerciseEntries((prev) =>
      prev.map((e, i) => i === exIdx ? { ...e, sets: [...e.sets, { reps: "10", weight: "" }] } : e)
    );
  }

  function removeSet(exIdx: number, setIdx: number) {
    setExerciseEntries((prev) =>
      prev.map((e, i) => i === exIdx ? { ...e, sets: e.sets.filter((_, si) => si !== setIdx) } : e)
    );
  }

  function updateSet(exIdx: number, setIdx: number, field: "reps" | "weight", value: string) {
    setExerciseEntries((prev) =>
      prev.map((e, i) =>
        i === exIdx
          ? { ...e, sets: e.sets.map((s, si) => si === setIdx ? { ...s, [field]: value } : s) }
          : e
      )
    );
  }

  function updateExercise(exIdx: number, exerciseId: string) {
    setExerciseEntries((prev) =>
      prev.map((e, i) => i === exIdx ? { ...e, exerciseId } : e)
    );
  }

  async function handleSave() {
    const validEntries = exerciseEntries.filter((e) => e.exerciseId && e.sets.length > 0);
    if (validEntries.length === 0) {
      toast.error("Add at least one exercise");
      return;
    }
    setSaving(true);
    try {
      const exerciseLogs: ExerciseLog[] = validEntries.map((entry, exIdx) => ({
        exercise_id: entry.exerciseId,
        sets: entry.sets.map((s, si) => ({
          set_number: si + 1,
          reps: parseInt(s.reps) || 0,
          weight: s.weight ? parseFloat(s.weight) : undefined,
          weight_unit: "kg",
        } satisfies SetLog)),
      }));

      const input: WorkoutLogInput = {
        program_id: programId !== "none" ? programId : undefined,
        logged_at: new Date().toISOString(),
        duration_minutes: duration ? parseInt(duration) : undefined,
        note: note.trim() || undefined,
        exercises: exerciseLogs,
      };

      await db.addWorkoutLog(input);
      toast.success("Workout logged!");
      router.push("/workout");
    } catch {
      toast.error("Failed to save workout");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-4"><Skeleton className="h-64 rounded-2xl" /></div>;

  return (
    <div className="flex flex-col gap-4 px-4 py-4 pb-28">
      {/* Program select */}
      <Card className="rounded-2xl border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Workout Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 flex flex-col gap-3">
          <div>
            <Label className="mb-1.5 block text-sm">Program (optional)</Label>
            <Select value={programId} onValueChange={handleProgramChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No program</SelectItem>
                {programs.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5 block text-sm">Duration (min)</Label>
              <Input type="number" inputMode="numeric" placeholder="45" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
          </div>
          <div>
            <Label className="mb-1.5 block text-sm">Note (optional)</Label>
            <Textarea placeholder="How was it?" value={note} onChange={(e) => setNote(e.target.value)} className="resize-none min-h-[60px]" />
          </div>
        </CardContent>
      </Card>

      {/* Exercises */}
      <div className="flex flex-col gap-3">
        {exerciseEntries.map((entry, exIdx) => {
          const exercise = exercises.find((e) => e.id === entry.exerciseId);
          return (
            <Card key={exIdx} className="rounded-2xl border-border/50 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <Select value={entry.exerciseId || "none"} onValueChange={(v) => updateExercise(exIdx, v === "none" ? "" : v)}>
                    <SelectTrigger className="flex-1 h-8 text-sm">
                      <SelectValue placeholder="Select exercise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Select exercise</SelectItem>
                      {exercises.map((e) => (
                        <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive shrink-0" onClick={() => removeExercise(exIdx)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
                {exercise?.muscle_group && (
                  <Badge variant="secondary" className="w-fit text-xs mt-1">{exercise.muscle_group}</Badge>
                )}
              </CardHeader>
              <CardContent className="pt-0 flex flex-col gap-2">
                <div className="grid grid-cols-[2rem_1fr_1fr_2rem] gap-1.5 items-center">
                  <span className="text-xs text-muted-foreground text-center">#</span>
                  <span className="text-xs text-muted-foreground text-center">Reps</span>
                  <span className="text-xs text-muted-foreground text-center">kg</span>
                  <span />
                </div>
                {entry.sets.map((set, setIdx) => (
                  <div key={setIdx} className="grid grid-cols-[2rem_1fr_1fr_2rem] gap-1.5 items-center">
                    <span className="text-xs text-muted-foreground text-center">{setIdx + 1}</span>
                    <Input
                      type="number" inputMode="numeric"
                      value={set.reps}
                      onChange={(e) => updateSet(exIdx, setIdx, "reps", e.target.value)}
                      className="h-8 text-center text-sm"
                    />
                    <Input
                      type="number" inputMode="decimal"
                      value={set.weight}
                      onChange={(e) => updateSet(exIdx, setIdx, "weight", e.target.value)}
                      placeholder="—"
                      className="h-8 text-center text-sm"
                    />
                    <Button variant="ghost" size="icon-sm" className="text-muted-foreground h-8 w-8" onClick={() => removeSet(exIdx, setIdx)}>
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="mt-1 w-full text-xs h-7" onClick={() => addSet(exIdx)}>
                  <Plus className="size-3 mr-1" /> Add Set
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button variant="outline" className="rounded-xl" onClick={addExercise}>
        <Plus className="size-4 mr-2" /> Add Exercise
      </Button>

      <div className="fixed bottom-[5.5rem] left-1/2 -translate-x-1/2 w-[calc(min(448px,100vw)-2rem)] flex gap-2 z-50">
        <Button variant="outline" className="flex-1" onClick={() => router.back()}>Cancel</Button>
        <Button className="flex-1" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Workout"}
        </Button>
      </div>
    </div>
  );
}
