"use client";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { WeightUnit } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (value: number, unit: WeightUnit) => Promise<void>;
}

export function AddWeightSheet({ open, onClose, onSave }: Props) {
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState<WeightUnit>("kg");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) return;
    setSaving(true);
    try {
      await onSave(num, unit);
      setValue("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="rounded-t-[32px] pb-safe-bottom px-6 pt-10">
        <SheetHeader className="sr-only">
          <SheetTitle>Log Weight</SheetTitle>
        </SheetHeader>
        
        <div className="flex gap-4 items-end mb-8">
          <div className="flex-1">
            <Label htmlFor="weight-value" className="mb-2.5 block text-base font-semibold text-foreground">Log Weight</Label>
            <Input
              id="weight-value"
              type="number"
              inputMode="decimal"
              placeholder="70.5"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="text-2xl h-14 font-semibold px-4 rounded-xl"
              autoFocus
            />
          </div>
          <ToggleGroup
            type="single"
            value={unit}
            onValueChange={(v) => v && setUnit(v as WeightUnit)}
            className="h-14 bg-muted/40 rounded-xl p-1"
          >
            <ToggleGroupItem 
              value="kg" 
              className="h-full px-5 rounded-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm text-base font-medium"
              onPointerDown={(e) => e.preventDefault()}
            >
              kg
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="lbs" 
              className="h-full px-5 rounded-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm text-base font-medium"
              onPointerDown={(e) => e.preventDefault()}
            >
              lbs
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <SheetFooter className="flex flex-row gap-3 px-0 pb-6">
          <Button variant="outline" className="flex-1 h-14 text-base font-semibold rounded-xl" onClick={onClose}>Cancel</Button>
          <Button
            className="flex-1 h-14 text-base font-semibold rounded-xl"
            onClick={handleSave}
            disabled={!value || isNaN(parseFloat(value)) || saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
