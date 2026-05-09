# Component: EditWeightSheet

**File:** `components/weight/edit-weight-sheet.tsx`

## Props
| Prop | Type |
|------|------|
| `log` | `WeightLog \| null` |
| `open` | `boolean` |
| `onClose` | `() => void` |
| `onSave` | `(id, value, unit, note?) => void` |

## Behavior
Bottom sheet pre-filled with existing weight log data. Allows editing value, unit, and note.
