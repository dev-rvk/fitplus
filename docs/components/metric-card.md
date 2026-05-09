# Component: MetricCard

**File:** `components/dashboard/metric-card.tsx`

## Props
| Prop | Type | Description |
|------|------|-------------|
| `icon` | `LucideIcon` | Icon component |
| `label` | `string` | Card title |
| `value` | `string` | Display value |
| `subtitle` | `string` | Subtext |
| `colorClass` | `string` | CSS class for accent color |
| `loading` | `boolean` | Show skeleton |
| `href` | `string` | Optional link destination |

## Behavior
Wraps in `<Link>` if `href` is provided. Shows skeleton when loading.
