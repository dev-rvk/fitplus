# Component: EditMealSheet

**File:** `components/food/edit-meal-sheet.tsx`

## Props
| Prop | Type |
|------|------|
| `meal` | `Meal \| null` (null = create mode) |
| `open` | `boolean` |
| `onClose` | `() => void` |
| `onSave` | `(input: MealInput) => void` |

## Behavior
Bottom sheet for creating or editing a meal template. Fields: name, description, calories, protein, carbs, fat, serving size, ingredients (optional).
