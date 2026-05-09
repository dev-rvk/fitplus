# Component: FoodLogList

**File:** `components/food/food-log-list.tsx`

## Props
| Prop | Type |
|------|------|
| `logs` | `FoodLog[]` |
| `loading` | `boolean` |
| `onDelete` | `(id) => void` |

## Behavior
List of food log entries showing meal name or "Manual entry", calories, macros. Swipe or button to delete with `ConfirmDeleteDialog`.
