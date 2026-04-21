import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Palette, Box, AlertTriangle, Sparkles } from "lucide-react";

type Slot = { name: string; color: string; material: string; purpose: string };

const defaultSlotsAMS1: Slot[] = [
  { name: "A1-1", color: "#fbbf24", material: "PLA", purpose: "Kolor glowny" },
  { name: "A1-2", color: "#1a1a1a", material: "PLA", purpose: "Czarne detale" },
  { name: "A1-3", color: "#f5f5f5", material: "PLA", purpose: "Biale akcenty" },
  { name: "A1-4", color: "#ef4444", material: "PLA", purpose: "Czerwone oznaczenia" },
  { name: "A1-5", color: "#3b82f6", material: "PLA", purpose: "Niebieskie" },
  { name: "A1-6", color: "#22c55e", material: "PLA", purpose: "Zielone" },
  { name: "A1-7", color: "#a855f7", material: "PLA", purpose: "Fioletowe" },
  { name: "A1-8", color: "#f97316", material: "PLA", purpose: "Pomaranczowe" },
];

const defaultSlotsAMS2: Slot[] = [
  { name: "A2-1", color: "#ec4899", material: "PLA", purpose: "Rozowe" },
  { name: "A2-2", color: "#14b8a6", material: "PLA", purpose: "Turkusowe" },
  { name: "A2-3", color: "#84cc16", material: "PLA", purpose: "Limonkowe" },
  { name: "A2-4", color: "#f59e0b", material: "PLA", purpose: "Zlote" },
  { name: "A2-5", color: "#6366f1", material: "PLA", purpose: "Indygo" },
  { name: "A2-6", color: "#78716c", material: "PLA", purpose: "Szare" },
  { name: "A2-7", color: "#b45309", material: "PLA", purpose: "Brazowe" },
  { name: "A2-8", color: "#be185d", material: "PLA", purpose: "Malinowe" },
];

const POPULAR_COMBOS = [
  { name: "Fidget Dragon", colors: ["#ef4444", "#fbbf24", "#1a1a1a", "#f5f5f5"], desc: "Smok - bestseller, marza 400%" },
  { name: "Litofan", colors: ["#f5f5f5"], desc: "Biale PLA, zdjecie 3D, marza 400%" },
  { name: "Figurka RPG", colors: ["#6366f1", "#a855f7", "#fbbf24", "#1a1a1a", "#ef4444"], desc: "Multicolor premium, marza 500%" },
  { name: "Organizer biurkowy", colors: ["#1a1a1a", "#fbbf24"], desc: "2 kolory, marza 200%" },
  { name: "Etui na telefon", colors: ["#3b82f6", "#f5f5f5", "#1a1a1a"], desc: "Personalizowane, marza 300%" },
  { name: "Dekoracja swiateczna", colors: ["#ef4444", "#22c55e", "#fbbf24", "#f5f5f5"], desc: "Sezonowe, marza 200%" },
];

export default function Multicolor() {
  const [ams1, setAms1] = useState<Slot[]>(defaultSlotsAMS1);
  const [ams2, setAms2] = useState<Slot[]>(defaultSlotsAMS2);
  const [printName, setPrintName] = useState("Moj wydruk multicolor");
  const [purgePerChange, setPurgePerChange] = useState("8");
  const [pricePerKg, setPricePerKg] = useState("90");
  const [totalWeight, setTotalWeight] = useState("100");
  const [colorChanges, setColorChanges] = useState("120");

  const allSlots = [...ams1, ...ams2];
  const activeSlots = allSlots.filter(s => s.purpose.length > 0);
  const purgeWaste = parseFloat(colorChanges) * parseFloat(purgePerChange);
  const purgeWasteCost = (purgeWaste / 1000) * parseFloat(pricePerKg);
  const totalFilament = parseFloat(totalWeight) + purgeWaste;
  const wastePercent = totalFilament > 0 ? ((purgeWaste / totalFilament) * 100) : 0;

  function updateSlot(ams: 1 | 2, i: number, key: keyof Slot, val: string) {
    const setter = ams === 1 ? setAms1 : setAms2;
    setter(prev => prev.map((s, idx) => idx === i ? { ...s, [key]: val } : s));
  }

  function renderAmsUnit(label: string, amsNum: 1 | 2, slots: Slot[]) {
    return (
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Box className="h-4 w-4 text-primary" />
            {label} (8 slotow)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {slots.map((slot, i) => (
            <div key={i} className="flex gap-2 items-center">
              <div className="text-xs text-muted-foreground w-8 text-center font-mono">{slot.name}</div>
              <button
                onClick={() => {
                  const el = document.getElementById(`color-${amsNum}-${i}`);
                  el?.click();
                }}
                className="w-7 h-7 rounded border border-zinc-700 flex-shrink-0 cursor-pointer hover:border-primary transition-colors"
                style={{ background: slot.color }}
                title="Zmien kolor"
              />
              <input
                type="color"
                value={slot.color}
                onChange={e => updateSlot(amsNum, i, "color", e.target.value)}
                className="w-0 h-0 opacity-0 absolute"
                id={`color-${amsNum}-${i}`}
              />
              <Input
                value={slot.purpose}
                onChange={e => updateSlot(amsNum, i, "purpose", e.target.value)}
                placeholder="Przeznaczenie"
                className="bg-background border-border text-xs flex-1 h-8"
              />
              <Input
                value={slot.material}
                onChange={e => updateSlot(amsNum, i, "material", e.target.value)}
                className="bg-background border-border text-xs w-16 h-8"
              />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Multicolor Planner</h1>
        <p className="text-muted-foreground mt-1">Planuj sloty filamentow dla Bambu Lab H2D Combo z Dual AMS (16 kolorow)</p>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Projekt</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Nazwa projektu</Label>
          <Input value={printName} onChange={e => setPrintName(e.target.value)} className="bg-background border-border mt-1" />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {renderAmsUnit("AMS #1 (Lewa)", 1, ams1)}
        {renderAmsUnit("AMS #2 (Prawa)", 2, ams2)}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border bg-card">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Palette className="h-4 w-4 text-primary" />Wizualizacja Dual AMS</CardTitle></CardHeader>
          <CardContent>
            <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-700">
              <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wider text-center">{printName}</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-center text-muted-foreground mb-2">AMS #1</div>
                  <div className="grid grid-cols-4 gap-2">
                    {ams1.map((slot, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className="w-full aspect-square rounded-lg border-2 border-zinc-700 shadow-lg" style={{ background: slot.color }} />
                        <div className="text-xs font-mono text-zinc-500">{i + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-center text-muted-foreground mb-2">AMS #2</div>
                  <div className="grid grid-cols-4 gap-2">
                    {ams2.map((slot, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className="w-full aspect-square rounded-lg border-2 border-zinc-700 shadow-lg" style={{ background: slot.color }} />
                        <div className="text-xs font-mono text-zinc-500">{i + 9}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-400" />Kalkulator Purge Waste</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Waga wydruku (g)</Label>
                  <Input type="number" value={totalWeight} onChange={e => setTotalWeight(e.target.value)} className="bg-background border-border mt-1 h-8 text-sm" min="0" />
                </div>
                <div>
                  <Label className="text-xs">Zmian kolorow</Label>
                  <Input type="number" value={colorChanges} onChange={e => setColorChanges(e.target.value)} className="bg-background border-border mt-1 h-8 text-sm" min="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Purge na zmiane (g)</Label>
                  <Input type="number" value={purgePerChange} onChange={e => setPurgePerChange(e.target.value)} className="bg-background border-border mt-1 h-8 text-sm" min="0" />
                </div>
                <div>
                  <Label className="text-xs">Cena filamentu (PLN/kg)</Label>
                  <Input type="number" value={pricePerKg} onChange={e => setPricePerKg(e.target.value)} className="bg-background border-border mt-1 h-8 text-sm" min="0" />
                </div>
              </div>

              <Separator className="bg-border" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purge waste</span>
                  <span className="text-amber-400 font-medium">{purgeWaste.toFixed(0)} g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Koszt purge</span>
                  <span className="text-amber-400">{purgeWasteCost.toFixed(2)} PLN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Laczny filament</span>
                  <span className="font-medium">{totalFilament.toFixed(0)} g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Procent straty</span>
                  <span className={wastePercent > 50 ? "text-red-400" : "text-amber-400"}>{wastePercent.toFixed(1)}%</span>
                </div>
              </div>

              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden mt-2">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(wastePercent, 100)}%` }} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Popularne kombinacje</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {POPULAR_COMBOS.map((combo, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-primary/30 transition-colors">
                  <div className="flex gap-0.5 flex-shrink-0">
                    {combo.colors.map((c, j) => (
                      <div key={j} className="w-4 h-4 rounded-sm border border-zinc-700" style={{ background: c }} />
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium">{combo.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{combo.desc}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
