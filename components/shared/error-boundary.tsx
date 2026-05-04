"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary for client-side React errors.
 * Shows a friendly fallback UI instead of crashing the entire app.
 */
export function ErrorBoundary({ children }: Props) {
  const [state, setState] = useState<State>({ hasError: false, error: null });

  useEffect(() => {
    function handleError(event: ErrorEvent) {
      setState({ hasError: true, error: new Error(event.message) });
    }

    function handleRejection(event: PromiseRejectionEvent) {
      setState({ hasError: true, error: new Error(String(event.reason)) });
    }

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  if (state.hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-6 text-center">
        <div className="size-14 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="size-7 text-destructive" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Something went wrong</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            An unexpected error occurred. Try refreshing the page.
          </p>
        </div>
        {state.error && (
          <pre className="text-xs text-muted-foreground bg-muted rounded-lg p-3 max-w-xs overflow-x-auto">
            {state.error.message}
          </pre>
        )}
        <Button onClick={() => { setState({ hasError: false, error: null }); window.location.reload(); }}>
          Refresh Page
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
