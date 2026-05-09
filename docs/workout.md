# Workout Module

> Update this file when workout logging, exercise library, program management, or charts change.

## Overview

Log workouts with exercises and sets. Manage reusable exercise library and workout programs. View progress charts.

## Files

### Pages
| File | Purpose |
|------|---------|
| `app/(app)/workout/page.tsx` | Workout history (Week/Month/All tabs) |
| `app/(app)/workout/log/page.tsx` | Log a new workout session |
| `app/(app)/workout/exercises/page.tsx` | Exercise library management (CRUD) |
| `app/(app)/workout/programs/page.tsx` | Workout program management (CRUD) |

### Components
| File | Purpose | Doc |
|------|---------|-----|
| `components/workout/workout-log-list.tsx` | List of workout sessions with delete | `docs/components/workout-log-list.md` |
| `components/workout/workout-progress-chart.tsx` | Chart showing workout frequency/volume | `docs/components/workout-progress-chart.md` |
| `components/workout/exercise-list.tsx` | Exercise library list with edit/delete | `docs/components/exercise-list.md` |
| `components/workout/edit-exercise-sheet.tsx` | Sheet to create/edit exercise | `docs/components/edit-exercise-sheet.md` |
| `components/workout/program-list.tsx` | Program list with edit/delete | `docs/components/program-list.md` |
| `components/workout/edit-program-sheet.tsx` | Sheet to create/edit program | `docs/components/edit-program-sheet.md` |

## Data flow — Workout page

- `load()` calls `db.getWorkoutLogs(opts)` filtered by period
- Period: Week (7 days), Month (30 days), All (no filter)

## Page state — Workout page

| State | Type | Default |
|-------|------|---------|
| `logs` | `WorkoutLog[]` | `[]` |
| `loading` | `boolean` | `true` |
| `period` | `"week" \| "month" \| "all"` | `"month"` |

## Sub-pages

### `/workout/log` — Log a workout
Full-page form. Select program (optional), add exercises, log sets (reps + weight). Submits via `db.addWorkoutLog()`.

### `/workout/exercises` — Exercise library
CRUD list. Each exercise has: name, muscle_group (optional), description (optional). `db.getExercises()` / `addExercise()` / `updateExercise()` / `deleteExercise()`.

### `/workout/programs` — Workout programs
CRUD list. Program has: name, description, ordered list of exercises with default sets/reps. `db.getWorkoutPrograms()` / `addWorkoutProgram()` etc.

## CRUD

| Action | Method | Cache invalidation |
|--------|--------|-------------------|
| Log workout | `db.addWorkoutLog()` | `workout`, `summary` |
| Delete workout log | `db.deleteWorkoutLog()` | `workout`, `summary` |
| Add exercise | `db.addExercise()` | `exercises` |
| Update exercise | `db.updateExercise()` | `exercises` |
| Delete exercise | `db.deleteExercise()` | `exercises` |
| Add program | `db.addWorkoutProgram()` | `programs` |
| Update program | `db.updateWorkoutProgram()` | `programs` |
| Delete program | `db.deleteWorkoutProgram()` | `programs` |

## Types

```ts
interface Exercise {
  id: string; user_id: string; name: string;
  muscle_group?: string; description?: string;
  is_public: boolean; created_at: string;
}
interface WorkoutProgram {
  id: string; user_id: string; name: string; description?: string;
  exercises?: ProgramExercise[]; created_at: string;
}
interface ProgramExercise {
  exercise_id: string; exercise?: Exercise;
  order_index: number; default_sets: number; default_reps: number;
}
interface WorkoutLog {
  id: string; user_id: string; program_id?: string; program?: WorkoutProgram;
  logged_at: string; duration_minutes?: number; note?: string;
  exercises: ExerciseLog[];
}
interface ExerciseLog {
  exercise_id: string; exercise?: Exercise;
  sets: SetLog[];
}
interface SetLog {
  set_number: number; reps: number;
  weight?: number; weight_unit?: WeightUnit; note?: string;
}
```
