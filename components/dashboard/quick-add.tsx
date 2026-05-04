"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus, X, Scale, Utensils, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const actions = [
  { href: "/weight", label: "Weight", icon: Scale, color: "bg-primary" },
  { href: "/food", label: "Food", icon: Utensils, color: "bg-chart-2" },
  { href: "/workout/log", label: "Workout", icon: Dumbbell, color: "bg-chart-4" },
];

export function QuickAdd() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Actions */}
      <div className={cn("fixed bottom-20 right-4 z-50 flex flex-col-reverse gap-3 items-end transition-all", !open && "pointer-events-none")}>
        {actions.map(({ href, label, icon: Icon, color }, i) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-2 px-4 h-10 rounded-full shadow-lg text-white text-sm font-medium transition-all duration-200",
              color,
              open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
            style={{ transitionDelay: open ? `${i * 50}ms` : "0ms" }}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </div>

      {/* FAB */}
      <Button
        size="icon"
        className={cn(
          "fixed bottom-[5.5rem] right-4 z-50 size-14 rounded-full shadow-xl transition-all duration-200",
          open && "rotate-45"
        )}
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="size-6" /> : <Plus className="size-6" />}
      </Button>
    </>
  );
}
