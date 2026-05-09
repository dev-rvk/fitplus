# Component: BottomNav

**File:** `components/shared/bottom-nav.tsx`
**Type:** Client component

## Purpose
Fixed bottom navigation bar for authenticated routes.

## Tabs
| Label | Icon | Path |
|-------|------|------|
| Home | `LayoutDashboard` | `/dashboard` |
| Weight | `Scale` | `/weight` |
| Food | `UtensilsCrossed` | `/food` |
| Workout | `Dumbbell` | `/workout` |

## Behavior
Uses `usePathname()` to highlight active tab. Section matching — e.g. `/workout/log` highlights the Workout tab.
