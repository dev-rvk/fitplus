"use client";
import { useState, useEffect } from "react";
import type { Meal, MealInput } from "@/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  meal: Meal | null;
  open: boolean;
  onClose: () => void;
  onSave: (input: MealInput) => Promise<void>;
}

export function EditMealSheet({ meal, open, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (meal) {
      setName(meal.name);
      setDescription(meal.description ?? "");
      setCalories(String(meal.calories));
      setProtein(String(meal.protein));
      setCarbs(String(meal.carbs));
      setFat(String(meal.fat));
    } else {
      setName(""); setDescription(""); setCalories(""); setProtein(""); setCarbs(""); setFat("");
    }
  }, [meal, open]);

  async function handleSave() {
    if (!name.trim() || !calories) return;
    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim() || undefined,
        calories: parseFloat(calories) || 0,
        protein: parseFloat(protein) || 0,
        carbs: parseFloat(carbs) || 0,
        fat: parseFloat(fat) || 0,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl pb-safe-bottom">
        <SheetHeader className="mb-4">
          <SheetTitle>{meal ? "Edit Meal" : "New Meal"}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-3">
          <div>
            <Label className="mb-1.5 block text-sm">Name</Label>
            <Input placeholder="Chicken & Rice" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </div>
          <div>
            <Label className="mb-1.5 block text-sm">Description (optional)</Label>
            <Textarea placeholder="High protein post-workout meal" value={description} onChange={(e) => setDescription(e.target.value)} className="resize-none min-h-[60px]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5 block text-sm">Calories (kcal)</Label>
              <Input type="number" inputMode="decimal" placeholder="500" value={calories} onChange={(e) => setCalories(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1.5 block text-sm">Protein (g)</Label>
              <Input type="number" inputMode="decimal" placeholder="40" value={protein} onChange={(e) => setProtein(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1.5 block text-sm">Carbs (g)</Label>
              <Input type="number" inputMode="decimal" placeholder="60" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1.5 block text-sm">Fat (g)</Label>
              <Input type="number" inputMode="decimal" placeholder="15" value={fat} onChange={(e) => setFat(e.target.value)} />
            </div>
          </div>
        </div>
        <SheetFooter className="mt-6 flex-row gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" onClick={handleSave} disabled={!name.trim() || !calories || saving}>
            {saving ? "Saving..." : meal ? "Update" : "Create"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
