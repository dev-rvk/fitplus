# Dashboard Module

> Update this file when dashboard widgets, data sources, or layout changes.

## Overview

Home screen showing today's summary: weight, calories, protein, workouts, macro ring, weekly charts, and a quick-add FAB.

## Files

### Page
| File | Purpose |
|------|---------|
| `app/(app)/dashboard/page.tsx` | Main dashboard page |

### Components
| File | Purpose | Doc |
|------|---------|-----|
| `components/dashboard/metric-card.tsx` | Stat card (icon, label, value, optional link) | `docs/components/metric-card.md` |
| `components/dashboard/macro-ring.tsx` | Donut chart for today's macros (P/C/F) | `docs/components/macro-ring.md` |
| `components/dashboard/weekly-calories-chart.tsx` | 7-day bar chart of calories | `docs/components/weekly-calories-chart.md` |
| `components/dashboard/weight-sparkline.tsx` | Small line chart of recent weight | `docs/components/weight-sparkline.md` |
| `components/dashboard/today-workout.tsx` | Shows today's workout if any | `docs/components/today-workout.md` |
| `components/dashboard/quick-add.tsx` | FAB with backdrop menu (log weight/food/workout) | `docs/components/quick-add.md` |

## Data flow

Page loads 3 parallel requests:
1. `db.getDailySummaries(weekAgo, today)` → 7-day summary data
2. `db.getWeightLogs({ limit: 1 })` → latest weight entry
3. `db.getWeightLogs({ from: weekAgo })` → week's weight for sparkline

Today's data extracted from summaries array by matching `date === todayStr`.

## Layout

```
[Date greeting]
[4x MetricCard grid (Weight, Calories, Protein, Workouts)]
[MacroRing — conditional, only if calories > 0]
[WeeklyCaloriesChart]
[WeightSparkline]
[TodayWorkout]
[QuickAdd FAB]
```

## Metric cards link to

- Weight → `/weight`
- Calories → `/food`
- Protein → `/food`
- Workouts → `/workout`
