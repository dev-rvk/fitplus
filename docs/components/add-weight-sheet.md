# Component: AddWeightSheet

**File:** `components/weight/add-weight-sheet.tsx`

## Props
| Prop | Type |
|------|------|
| `open` | `boolean` |
| `onClose` | `() => void` |
| `onSave` | `(value: number, unit: WeightUnit) => void` |

## Behavior
Bottom sheet (ShadCN `Sheet`) with numeric input for weight value and unit toggle (kg/lbs).
