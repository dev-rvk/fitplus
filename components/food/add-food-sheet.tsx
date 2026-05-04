"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/db";
import type { FoodLogInput, Meal } from "@/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (input: FoodLogInput) => Promise<void>;
}

export function AddFoodSheet({ open, onClose, onSave }: Props) {
  const [tab, setTab] = useState<"manual" | "meal">("manual");
  const [saving, setSaving] = useState(false);

  // Manual
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [note, setNote] = useState("");

  // Meal
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealsLoading, setMealsLoading] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [portion, setPortion] = useState(100);

  useEffect(() => {
    if (open && tab === "meal" && meals.length === 0) {
      setMealsLoading(true);
      db.getMeals().then(setMeals).catch(() => {}).finally(() => setMealsLoading(false));
    }
  }, [open, tab, meals.length]);

  function reset() {
    setCalories(""); setProtein(""); setCarbs(""); setFat(""); setNote("");
    setSelectedMeal(null); setPortion(100);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (tab === "manual") {
        await onSave({
          entry_type: "manual",
          logged_at: new Date().toISOString(),
          calories: parseFloat(calories) || 0,
          protein: parseFloat(protein) || 0,
          carbs: parseFloat(carbs) || 0,
          fat: parseFloat(fat) || 0,
          portion_percent: 100,
          note: note.trim() || undefined,
        });
      } else if (selectedMeal) {
        const scale = portion / 100;
        await onSave({
          entry_type: "meal",
          meal_id: selectedMeal.id,
          logged_at: new Date().toISOString(),
          calories: Math.round(selectedMeal.calories * scale),
          protein: Math.round(selectedMeal.protein * scale * 10) / 10,
          carbs: Math.round(selectedMeal.carbs * scale * 10) / 10,
          fat: Math.round(selectedMeal.fat * scale * 10) / 10,
          portion_percent: portion,
        });
      }
      reset();
    } finally {
      setSaving(false);
    }
  }

  const mealPreview = selectedMeal
    ? {
        calories: Math.round(selectedMeal.calories * (portion / 100)),
        protein: Math.round(selectedMeal.protein * (portion / 100) * 10) / 10,
        carbs: Math.round(selectedMeal.carbs * (portion / 100) * 10) / 10,
        fat: Math.round(selectedMeal.fat * (portion / 100) * 10) / 10,
      }
    : null;

  const canSave =
    tab === "manual"
      ? !!calories && !isNaN(parseFloat(calories))
      : !!selectedMeal;

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) { onClose(); reset(); } }}>
      <SheetContent side="bottom" className="rounded-t-2xl pb-safe-bottom max-h-[90vh] overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Log Food</SheetTitle>
        </SheetHeader>
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="manual" className="flex-1">Manual</TabsTrigger>
            <TabsTrigger value="meal" className="flex-1">Meal Template</TabsTrigger>
          </TabsList>
          <TabsContent value="manual" className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1.5 block text-sm">Calories (kcal)</Label>
                <Input type="number" inputMode="decimal" placeholder="500" value={calories} onChange={(e) => setCalories(e.target.value)} />
              </div>
              <div>
                <Label className="mb-1.5 block text-sm">Protein (g)</Label>
                <Input type="number" inputMode="decimal" placeholder="30" value={protein} onChange={(e) => setProtein(e.target.value)} />
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
            <div>
              <Label className="mb-1.5 block text-sm">Note (optional)</Label>
              <Textarea placeholder="What did you eat?" value={note} onChange={(e) => setNote(e.target.value)} className="resize-none min-h-[60px]" />
            </div>
          </TabsContent>
          <TabsContent value="meal" className="flex flex-col gap-3">
            {mealsLoading ? (
              <Skeleton className="h-32 rounded-xl" />
            ) : meals.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No meal templates yet. Create meals in the Meals section.</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                {meals.map((meal) => (
                  <button
                    key={meal.id}
                    onClick={() => setSelectedMeal(selectedMeal?.id === meal.id ? null : meal)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-colors ${selectedMeal?.id === meal.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                  >
                    <div>
                      <p className="text-sm font-medium">{meal.name}</p>
                      <p className="text-xs text-muted-foreground">{meal.calories} kcal · P {meal.protein}g · C {meal.carbs}g · F {meal.fat}g</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {selectedMeal && (
              <div className="flex flex-col gap-2 p-3 rounded-xl bg-muted">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Portion: {portion}%</Label>
                  {mealPreview && (
                    <span className="text-xs text-muted-foreground">{mealPreview.calories} kcal</span>
                  )}
                </div>
                <Slider value={[portion]} onValueChange={([v]) => setPortion(v)} min={10} max={200} step={5} />
                {mealPreview && (
                  <p className="text-xs text-muted-foreground">P {mealPreview.protein}g · C {mealPreview.carbs}g · F {mealPreview.fat}g</p>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
        <SheetFooter className="mt-6 flex-row gap-2">
          <Button variant="outline" className="flex-1" onClick={() => { onClose(); reset(); }}>Cancel</Button>
          <Button className="flex-1" onClick={handleSave} disabled={!canSave || saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
