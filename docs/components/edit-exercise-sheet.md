# Component: EditExerciseSheet

**File:** `components/workout/edit-exercise-sheet.tsx`

## Props
| Prop | Type |
|------|------|
| `exercise` | `Exercise \| null` (null = create mode) |
| `open` | `boolean` |
| `onClose` | `() => void` |
| `onSave` | `(input: ExerciseInput) => void` |

## Behavior
Bottom sheet for creating/editing an exercise. Fields: name, muscle_group (optional), description (optional).
