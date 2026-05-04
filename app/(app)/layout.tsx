import { BottomNav } from "@/components/shared/bottom-nav";
import { AppHeader } from "@/components/shared/app-header";
import { ErrorBoundary } from "@/components/shared/error-boundary";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-dvh bg-background max-w-md mx-auto relative">
      <AppHeader />
      <main className="flex-1 overflow-y-auto pb-20 no-scrollbar">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      <BottomNav />
    </div>
  );
}
