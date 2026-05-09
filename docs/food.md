# Food / Nutrition Module

> Update this file when food logging, meal templates, ingredient system, or nutrition charts change.

## Overview

Log food entries (manual or from meal templates), view daily macros, weekly nutrition charts. Manage reusable meal templates.

## Files

### Pages
| File | Purpose |
|------|---------|
| `app/(app)/food/page.tsx` | Main food tracking page (Today/Week/Month tabs) |
| `app/(app)/food/meals/page.tsx` | Meal template management (CRUD) |

### Components
| File | Purpose | Doc |
|------|---------|-----|
| `components/food/add-food-sheet.tsx` | Bottom sheet to log food (manual or from meal) | `docs/components/add-food-sheet.md` |
| `components/food/food-log-list.tsx` | List of food log entries with delete | `docs/components/food-log-list.md` |
| `components/food/daily-macro-summary.tsx` | Today's calories + P/C/F summary bar | `docs/components/daily-macro-summary.md` |
| `components/food/weekly-nutrition-chart.tsx` | Stacked bar chart (calories by day) | `docs/components/weekly-nutrition-chart.md` |
| `components/food/meal-list.tsx` | List of meal templates with edit/delete | `docs/components/meal-list.md` |
| `components/food/edit-meal-sheet.tsx` | Sheet to create/edit meal template | `docs/components/edit-meal-sheet.md` |

## Data flow — Food page

- `load()` calls `db.getFoodLogs({ from, to })` filtered by period
- Period: Today (startOfDay..endOfDay), Week (7 days), Month (30 days)
- `todayLogs` filtered client-side from loaded data for the DailyMacroSummary

## Page state — Food page

| State | Type | Default |
|-------|------|---------|
| `logs` | `FoodLog[]` | `[]` |
| `loading` | `boolean` | `true` |
| `addOpen` | `boolean` | `false` |
| `period` | `"today" \| "week" \| "month"` | `"today"` |

## Tab layout — Food page

- **Today**: DailyMacroSummary + FoodLogList (today only)
- **Week**: WeeklyNutritionChart (7 days) + FoodLogList
- **Month**: WeeklyNutritionChart (30 days) + FoodLogList

Sub-nav button: "My Meals & Templates" → `/food/meals`

## CRUD

| Action | Method | Cache invalidation |
|--------|--------|-------------------|
| Add food log | `db.addFoodLog()` | `food`, `summary` |
| Delete food log | `db.deleteFoodLog()` | `food`, `summary` |
| Add meal | `db.addMeal()` | `meals` |
| Update meal | `db.updateMeal()` | `meals` |
| Delete meal | `db.deleteMeal()` | `meals` |

## Types

```ts
interface FoodLog {
  id: string; user_id: string; logged_at: string;
  entry_type: "manual" | "meal"; meal_id?: string; meal?: Meal;
  calories: number; protein: number; carbs: number; fat: number;
  portion_percent: number; note?: string;
}
interface Meal {
  id: string; user_id: string; name: string; description?: string;
  calories: number; protein: number; carbs: number; fat: number;
  serving_size?: number; ingredients?: MealIngredient[];
  is_public: boolean; created_at: string;
}
interface Ingredient {
  id: string; user_id: string; name: string;
  calories_per_100g: number; protein_per_100g: number;
  carbs_per_100g: number; fat_per_100g: number;
  is_public: boolean; created_at: string;
}
```
