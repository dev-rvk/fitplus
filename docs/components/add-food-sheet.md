# Component: AddFoodSheet

**File:** `components/food/add-food-sheet.tsx`

## Props
| Prop | Type |
|------|------|
| `open` | `boolean` |
| `onClose` | `() => void` |
| `onSave` | `(input: FoodLogInput) => void` |

## Behavior
Bottom sheet with two modes: manual entry (calories/macros) or select from meal templates. When meal selected, auto-fills macros. Portion slider (0-200%).
