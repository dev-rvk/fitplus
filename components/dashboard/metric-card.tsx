"use client";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string;
  subtitle: string;
  colorClass: string;
  loading?: boolean;
  href: string;
}

export function MetricCard({ icon: Icon, label, value, subtitle, colorClass, loading, href }: Props) {
  if (loading) {
    return <Skeleton className="h-24 rounded-2xl" />;
  }
  return (
    <Link href={href} className={cn("rounded-2xl p-4 flex flex-col gap-2 border border-border/50 shadow-sm active:scale-95 transition-transform", colorClass)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
        <div className="size-7 rounded-lg bg-background/50 flex items-center justify-center">
          <Icon className="size-3.5 text-foreground" />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground leading-none">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </div>
    </Link>
  );
}
