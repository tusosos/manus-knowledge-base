import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, Palette, Zap, Clock, Package, Wrench, TrendingUp, Calculator } from "lucide-react";

const MATERIALS: Record<string, { pricePerKg: number; label: string }> = {
  PLA: { pricePerKg: 75, label: "PLA" },
  "PLA Silk": { pricePerKg: 105, label: "PLA Silk" },
  PETG: { pricePerKg: 100, label: "PETG" },
  ABS: { pricePerKg: 80, label: "ABS" },
  ASA: { pricePerKg: 130, label: "ASA" },
  TPU: { pricePerKg: 130, label: "TPU" },
  PA: { pricePerKg: 170, label: "PA (Nylon)" },
  PC: { pricePerKg: 180, label: "PC" },
};

const MARGIN_PRESETS = [
  { label: "50%", value: 50 },
  { label: "100%", value: 100 },
  { label: "200%", value: 200 },
  { label: "300%", value: 300 },
];

export default function CalculatorPage() {
  const [material, setMaterial] = useState("PLA");
  const [filamentWeight, setFilamentWeight] = useState("50");
  const [pricePerKg, setPricePerKg] = useState("75");
  const [printTime, setPrintTime] = useState("3");
  const [electricityRate, setElectricityRate] = useState("0.75");
  const [printerPower, setPrinterPower] = useState("350");
  const [hourlyRate, setHourlyRate] = useState("15");
  const [margin, setMargin] = useState("100");
  const [quantity, setQuantity] = useState("1");
  const [multicolor, setMulticolor] = useState(false);
  const [colorCount, setColorCount] = useState("4");
  const [purgePerChange, setPurgePerChange] = useState("8");
  const [printerCost, setPrinterCost] = useState("15000");
  const [expectedPrints, setExpectedPrints] = useState("2000");
  const [prepTime, setPrepTime] = useState("15");
  const [postProcessTime, setPostProcessTime] = useState("10");
  const [packagingCost, setPackagingCost] = useState("3");

  const qty = parseFloat(quantity) || 1;
  const filamentCost = (parseFloat(filamentWeight) / 1000) * parseFloat(pricePerKg) * qty || 0;
  const electricityCost = (parseFloat(printerPower) / 1000) * parseFloat(printTime) * parseFloat(electricityRate) * qty || 0;
  const printHours = parseFloat(printTime) || 0;
  const laborCost = printHours * parseFloat(hourlyRate) * qty || 0;
  const expPrints = parseFloat(expectedPrints) || 1;
  const amortizationPerPrint = expPrints > 0 ? (parseFloat(printerCost) || 0) / expPrints : 0;
  const amortizationCost = amortizationPerPrint * qty;

  const purgeWasteCost = multicolor
    ? ((parseFloat(colorCount) - 1) * parseFloat(purgePerChange) / 1000) * parseFloat(pricePerKg) * qty
    : 0;

  const prepCost = (parseFloat(prepTime) / 60) * parseFloat(hourlyRate) * qty || 0;
  const postCost = (parseFloat(postProcessTime) / 60) * parseFloat(hourlyRate) * qty || 0;
  const packaging = parseFloat(packagingCost) * qty || 0;

  const baseCost = filamentCost + electricityCost + laborCost + amortizationCost + purgeWasteCost + prepCost + postCost + packaging;
  const marginAmount = baseCost * (parseFloat(margin) / 100) || 0;
  const suggestedPrice = baseCost + marginAmount;
  const pricePerUnit = suggestedPrice / qty;

  function handleMaterialChange(mat: string) {
    setMaterial(mat);
    if (MATERIALS[mat]) {
      setPricePerKg(String(MATERIALS[mat].pricePerKg));
    }
  }

  function reset() {
    setMaterial("PLA"); setFilamentWeight("50"); setPricePerKg("90"); setPrintTime("3");
    setElectricityRate("0.80"); setPrinterPower("200"); setHourlyRate("15");
    setMargin("100"); setQuantity("1"); setMulticolor(false); setColorCount("4");
    setPurgePerChange("8"); setPrinterCost("15000"); setExpectedPrints("2000");
    setPrepTime("15"); setPostProcessTime("10"); setPackagingCost("3");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kalkulator Druku H2D</h1>
          <p className="text-muted-foreground mt-1">Precyzyjny kalkulator kosztow dedykowany Bambu Lab H2D Combo</p>
        </div>
        <Button variant="outline" onClick={reset} className="border-border">
          <RefreshCw className="h-4 w-4 mr-2" />Reset
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader><CardTitle className="text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2"><Package className="h-4 w-4" />Material</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Typ materialu</Label>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {Object.entries(MATERIALS).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => handleMaterialChange(key)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        material === key
                          ? "bg-primary text-black"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {val.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Waga filamentu (g)</Label>
                  <Input type="number" value={filamentWeight} onChange={e => setFilamentWeight(e.target.value)} className="bg-background border-border mt-1" min="0" step="1" />
                </div>
                <div>
                  <Label>Cena (PLN/kg)</Label>
                  <Input type="number" value={pricePerKg} onChange={e => setPricePerKg(e.target.value)} className="bg-background border-border mt-1" min="0" step="1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader><CardTitle className="text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2"><Palette className="h-4 w-4" />Multicolor (AMS)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">Tryb multicolor</span>
                  <p className="text-xs text-muted-foreground">Dodaje koszt purge waste z AMS</p>
                </div>
                <button
                  onClick={() => setMulticolor(!multicolor)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${multicolor ? "bg-primary" : "bg-zinc-700"}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${multicolor ? "translate-x-5.5 left-0.5" : "left-0.5"}`} style={{ transform: multicolor ? "translateX(22px)" : "translateX(0)" }} />
                </button>
              </div>
              {multicolor && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Liczba kolorow</Label>
                    <Input type="number" value={colorCount} onChange={e => setColorCount(e.target.value)} className="bg-background border-border mt-1" min="2" max="16" step="1" />
                    <p className="text-xs text-muted-foreground mt-1">Dual AMS: max 16</p>
                  </div>
                  <div>
                    <Label>Purge na zmiane (g)</Label>
                    <Input type="number" value={purgePerChange} onChange={e => setPurgePerChange(e.target.value)} className="bg-background border-border mt-1" min="0" step="1" />
                    <p className="text-xs text-muted-foreground mt-1">Strata filamentu</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader><CardTitle className="text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2"><Zap className="h-4 w-4" />Energia i druk</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Czas druku (h)</Label>
                  <Input type="number" value={printTime} onChange={e => setPrintTime(e.target.value)} className="bg-background border-border mt-1" min="0" step="0.5" />
                </div>
                <div>
                  <Label>Moc H2D (W)</Label>
                  <Input type="number" value={printerPower} onChange={e => setPrinterPower(e.target.value)} className="bg-background border-border mt-1" min="0" step="10" />
                </div>
              </div>
              <div>
                <Label>Cena pradu (PLN/kWh)</Label>
                <Input type="number" value={electricityRate} onChange={e => setElectricityRate(e.target.value)} className="bg-background border-border mt-1" min="0" step="0.01" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader><CardTitle className="text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2"><Wrench className="h-4 w-4" />Amortyzacja i praca</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Koszt drukarki (PLN)</Label>
                  <Input type="number" value={printerCost} onChange={e => setPrinterCost(e.target.value)} className="bg-background border-border mt-1" min="0" />
                  <p className="text-xs text-muted-foreground mt-1">H2D Combo: ~15 000 PLN</p>
                </div>
                <div>
                  <Label>Oczekiwane wydruki</Label>
                  <Input type="number" value={expectedPrints} onChange={e => setExpectedPrints(e.target.value)} className="bg-background border-border mt-1" min="1" />
                  <p className="text-xs text-muted-foreground mt-1">W calym cyklu zycia</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Stawka godzinowa (PLN/h)</Label>
                  <Input type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} className="bg-background border-border mt-1" min="0" />
                </div>
                <div>
                  <Label>Ilosc sztuk</Label>
                  <Input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} className="bg-background border-border mt-1" min="1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Przygotowanie (min)</Label>
                  <Input type="number" value={prepTime} onChange={e => setPrepTime(e.target.value)} className="bg-background border-border mt-1" min="0" />
                </div>
                <div>
                  <Label>Post-processing (min)</Label>
                  <Input type="number" value={postProcessTime} onChange={e => setPostProcessTime(e.target.value)} className="bg-background border-border mt-1" min="0" />
                </div>
              </div>
              <div>
                <Label>Koszt opakowania (PLN/szt)</Label>
                <Input type="number" value={packagingCost} onChange={e => setPackagingCost(e.target.value)} className="bg-background border-border mt-1" min="0" step="0.5" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-amber-600/30 bg-amber-900/10 sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Calculator className="h-5 w-5" />
                Wynik Kalkulacji
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Koszt materialu</span>
                  <span>{filamentCost.toFixed(2)} PLN</span>
                </div>
                {multicolor && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Purge waste ({colorCount} kol.)</span>
                    <span className="text-amber-400">{purgeWasteCost.toFixed(2)} PLN</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Koszt energii</span>
                  <span>{electricityCost.toFixed(2)} PLN</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amortyzacja drukarki</span>
                  <span>{amortizationCost.toFixed(2)} PLN</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Praca (druk)</span>
                  <span>{laborCost.toFixed(2)} PLN</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Przygotowanie + post-proc.</span>
                  <span>{(prepCost + postCost).toFixed(2)} PLN</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Opakowanie</span>
                  <span>{packaging.toFixed(2)} PLN</span>
                </div>
                <Separator className="bg-border" />
                <div className="flex justify-between text-sm font-medium">
                  <span>Koszt wlasny</span>
                  <span>{baseCost.toFixed(2)} PLN</span>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Szybki wybor marzy (%):</Label>
                <div className="flex gap-2">
                  {MARGIN_PRESETS.map(p => (
                    <button
                      key={p.value}
                      onClick={() => setMargin(String(p.value))}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        margin === String(p.value)
                          ? "bg-primary text-black"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={margin}
                      onChange={e => setMargin(e.target.value)}
                      className="bg-background border-border w-16 h-8 text-xs text-center"
                      min="0"
                    />
                    <span className="text-xs text-muted-foreground">%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Marza ({margin}%)</span>
                  <span className="text-green-400">+{marginAmount.toFixed(2)} PLN</span>
                </div>
                <Separator className="bg-border" />
                <div className="flex justify-between text-2xl font-bold text-primary">
                  <span>Cena</span>
                  <span>{suggestedPrice.toFixed(2)} PLN</span>
                </div>
                {qty > 1 && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Cena za sztuke</span>
                    <span className="font-medium">{pricePerUnit.toFixed(2)} PLN</span>
                  </div>
                )}
              </div>

              <div className="mt-4 p-4 bg-background rounded-lg border border-border space-y-2">
                <p className="font-medium text-xs text-foreground flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5 text-primary" />Porownanie cen:</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>Koszt wlasny: <span className="text-foreground font-medium">{baseCost.toFixed(2)} PLN</span></div>
                  <div>Marza 50%: <span className="text-foreground font-medium">{(baseCost * 1.5).toFixed(2)} PLN</span></div>
                  <div>Marza 100%: <span className="text-foreground font-medium">{(baseCost * 2).toFixed(2)} PLN</span></div>
                  <div>Marza 200%: <span className="text-foreground font-medium">{(baseCost * 3).toFixed(2)} PLN</span></div>
                  <div>Marza 300%: <span className="text-foreground font-medium">{(baseCost * 4).toFixed(2)} PLN</span></div>
                  <div>Marza 500%: <span className="text-foreground font-medium">{(baseCost * 6).toFixed(2)} PLN</span></div>
                </div>
              </div>

              <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Amortyzacja H2D:</p>
                <p>{amortizationPerPrint.toFixed(2)} PLN na wydruk ({printerCost} PLN / {expectedPrints} wydruków)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
