# Component: ConfirmDeleteDialog

**File:** `components/shared/confirm-delete-dialog.tsx`

## Props
| Prop | Type |
|------|------|
| `open` | `boolean` |
| `onClose` | `() => void` |
| `onConfirm` | `() => void` |
| `title` | `string` (optional, default: "Delete?") |
| `description` | `string` (optional) |

## Behavior
Reusable confirmation dialog using ShadCN `AlertDialog`. Cancel + Delete buttons.
