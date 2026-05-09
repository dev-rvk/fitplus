# Component: WeightLogList

**File:** `components/weight/weight-log-list.tsx`

## Props
| Prop | Type |
|------|------|
| `logs` | `WeightLog[]` |
| `loading` | `boolean` |
| `onEdit` | `(id, value, unit, note?) => void` |
| `onDelete` | `(id) => void` |

## Behavior
Scrollable list of weight entries. Each row shows date, value+unit, optional note. Edit opens `EditWeightSheet`. Delete uses `ConfirmDeleteDialog`.
