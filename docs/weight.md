# Weight Module

> Update this file when weight tracking features, chart behavior, or data model changes.

## Overview

Log daily weight, view progress chart with period filters, manage history entries.

## Files

### Page
| File | Purpose |
|------|---------|
| `app/(app)/weight/page.tsx` | Weight tracking page with tabs (Progress / History) |

### Components
| File | Purpose | Doc |
|------|---------|-----|
| `components/weight/weight-chart.tsx` | Line chart (Recharts) showing weight over time | `docs/components/weight-chart.md` |
| `components/weight/weight-log-list.tsx` | Scrollable list of weight entries with edit/delete | `docs/components/weight-log-list.md` |
| `components/weight/add-weight-sheet.tsx` | Bottom sheet to add new weight entry | `docs/components/add-weight-sheet.md` |
| `components/weight/edit-weight-sheet.tsx` | Bottom sheet to edit existing weight entry | `docs/components/edit-weight-sheet.md` |

## Data flow

- `load()` calls `db.getWeightLogs(opts)` with optional `from` filter based on period
- Period filter: Week (7 days), Month (30 days), All (no filter)
- Data re-fetched when `view` or `period` state changes

## Page state

| State | Type | Default |
|-------|------|---------|
| `logs` | `WeightLog[]` | `[]` |
| `loading` | `boolean` | `true` |
| `view` | `"graph" \| "history"` | `"graph"` |
| `period` | `"week" \| "month" \| "all"` | `"week"` |
| `addOpen` | `boolean` | `false` |

## Tab layout

- **Progress tab**: Period selector (Week/Month/All) + WeightChart
- **History tab**: WeightLogList with edit/delete actions

## CRUD

| Action | Method | Cache invalidation |
|--------|--------|-------------------|
| Add | `db.addWeightLog()` | `weight`, `summary` |
| Edit | `db.updateWeightLog()` | `weight`, `summary` |
| Delete | `db.deleteWeightLog()` | `weight`, `summary` |

## Types

```ts
interface WeightLog {
  id: string; user_id: string; value: number;
  unit: WeightUnit; logged_at: string; note?: string;
}
interface WeightLogInput {
  value: number; unit: WeightUnit; logged_at: string; note?: string;
}
type WeightUnit = "kg" | "lbs";
```
