# Component: ErrorBoundary

**File:** `components/shared/error-boundary.tsx`
**Type:** Class component (React error boundary)

## Props
| Prop | Type |
|------|------|
| `children` | `ReactNode` |

## Behavior
Catches React render errors. Displays a fallback UI with error message and "Try Again" button that reloads the page. Wraps the `(app)` layout.
