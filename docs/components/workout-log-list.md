# Component: WorkoutLogList

**File:** `components/workout/workout-log-list.tsx`

## Props
| Prop | Type |
|------|------|
| `logs` | `WorkoutLog[]` |
| `loading` | `boolean` |
| `onDelete` | `(id: string) => void` |

## Behavior
List of workout sessions. Shows date, program name, duration, exercise count. Delete via `ConfirmDeleteDialog`.
