# Component: EditProgramSheet

**File:** `components/workout/edit-program-sheet.tsx`

## Props
| Prop | Type |
|------|------|
| `program` | `WorkoutProgram \| null` (null = create mode) |
| `open` | `boolean` |
| `onClose` | `() => void` |
| `onSave` | `(input: WorkoutProgramInput) => void` |

## Behavior
Bottom sheet for creating/editing a workout program. Fields: name, description, ordered exercise list with default sets/reps. Exercises are picked from the user's exercise library.
