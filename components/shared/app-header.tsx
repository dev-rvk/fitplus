"use client";
import { usePathname } from "next/navigation";
import { Sun, Moon, Monitor, LogOut } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cacheInvalidateAll } from "@/lib/cache/storage";
import { logoutAction } from "@/lib/server/auth/actions";

const pageTitles: Record<string, string> = {
  "/dashboard": "FitPlus",
  "/weight": "Weight",
  "/food": "Nutrition",
  "/food/meals": "My Meals",
  "/workout": "Workout",
  "/workout/log": "Log Workout",
  "/workout/exercises": "Exercises",
  "/workout/programs": "Programs",
};

export function AppHeader() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const title = pageTitles[pathname] ?? "FitPlus";

  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;
  const nextTheme = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";

  async function handleLogout() {
    cacheInvalidateAll();
    await logoutAction();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border safe-top">
      <div className="flex items-center justify-between h-14 px-4">
        <h1 className="text-base font-semibold text-foreground">{title}</h1>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setTheme(nextTheme)}
            aria-label={`Switch to ${nextTheme} theme`}
          >
            <ThemeIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8" onClick={handleLogout} aria-label="Sign out">
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
