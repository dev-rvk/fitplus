"use client";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { WeightLog, WeightUnit } from "@/types";

interface Props {
  log: WeightLog;
  open: boolean;
  onClose: () => void;
  onSave: (value: number, unit: WeightUnit, note?: string) => Promise<void>;
}

export function EditWeightSheet({ log, open, onClose, onSave }: Props) {
  const [value, setValue] = useState(String(log.value));
  const [unit, setUnit] = useState<WeightUnit>(log.unit);
  const [note, setNote] = useState(log.note ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValue(String(log.value));
    setUnit(log.unit);
    setNote(log.note ?? "");
  }, [log]);

  async function handleSave() {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) return;
    setSaving(true);
    try {
      await onSave(num, unit, note.trim() || undefined);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl pb-safe-bottom">
        <SheetHeader className="mb-4">
          <SheetTitle>Edit Entry</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Label htmlFor="edit-weight-value" className="mb-1.5 block text-sm">Weight</Label>
              <Input
                id="edit-weight-value"
                type="number"
                inputMode="decimal"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="text-lg h-11"
                autoFocus
              />
            </div>
            <ToggleGroup
              type="single"
              value={unit}
              onValueChange={(v) => v && setUnit(v as WeightUnit)}
              className="h-11"
            >
              <ToggleGroupItem value="kg" className="h-11 px-4">kg</ToggleGroupItem>
              <ToggleGroupItem value="lbs" className="h-11 px-4">lbs</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div>
            <Label htmlFor="edit-weight-note" className="mb-1.5 block text-sm">Note (optional)</Label>
            <Textarea
              id="edit-weight-note"
              placeholder="Morning weigh-in, after workout..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="resize-none min-h-[72px]"
            />
          </div>
        </div>
        <SheetFooter className="mt-6 flex-row gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button
            className="flex-1"
            onClick={handleSave}
            disabled={!value || isNaN(parseFloat(value)) || saving}
          >
            {saving ? "Saving..." : "Update"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
