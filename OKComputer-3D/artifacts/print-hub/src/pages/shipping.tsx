import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, RefreshCw } from "lucide-react";

const COURIERS = [
  { name: "InPost Paczkomat", icon: "IP", base: 10.99, perKg: 0, maxWeight: 25, maxDims: "64x38x41cm", time: "1-2 dni", features: ["24h odbiór", "Śledzenie", "SMS"] },
  { name: "DPD", icon: "DP", base: 13.99, perKg: 1.5, maxWeight: 31.5, maxDims: "175x80x80cm", time: "1-2 dni", features: ["Gwarantowany termin", "Śledzenie", "Ubezpieczenie"] },
  { name: "DHL", icon: "DH", base: 15.99, perKg: 2.0, maxWeight: 30, maxDims: "180x80x80cm", time: "1 dzień", features: ["Express", "Śledzenie na żywo", "Dostarczenie do 12:00"] },
  { name: "Pocztex Kurier", icon: "PK", base: 12.49, perKg: 1.0, maxWeight: 30, maxDims: "Bez ograniczeń", time: "2-3 dni", features: ["Zwrot za pobraniem", "Śledzenie"] },
  { name: "GLS", icon: "GL", base: 11.99, perKg: 1.2, maxWeight: 40, maxDims: "Bez ograniczeń", time: "2-3 dni", features: ["Śledzenie", "Zbiorki"] },
];

export default function Shipping() {
  const [weight, setWeight] = useState("0.5");
  const [length, setLength] = useState("20");
  const [width, setWidth] = useState("15");
  const [height, setHeight] = useState("10");
  const [declared, setDeclared] = useState("100");

  const weightKg = parseFloat(weight) || 0;
  const vol = (parseFloat(length) * parseFloat(width) * parseFloat(height)) / 5000;
  const chargeableWeight = Math.max(weightKg, vol);

  const results = COURIERS.map(c => {
    const price = c.base + (chargeableWeight > 1 ? (chargeableWeight - 1) * c.perKg : 0);
    const tooHeavy = weightKg > c.maxWeight;
    return { ...c, price: Math.round(price * 100) / 100, tooHeavy };
  }).sort((a, b) => a.price - b.price);

  function reset() {
    setWeight("0.5"); setLength("20"); setWidth("15"); setHeight("10"); setDeclared("100");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kalkulator Wysyłki</h1>
          <p className="text-muted-foreground mt-1">Porównaj koszty kurierów dla twojej przesyłki</p>
        </div>
        <Button variant="outline" onClick={reset} className="border-border">
          <RefreshCw className="h-4 w-4 mr-2" />Reset
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-border bg-card md:col-span-1">
          <CardHeader><CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Dane przesyłki</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Waga (kg)</Label>
              <Input type="number" value={weight} onChange={e => setWeight(e.target.value)} step="0.1" min="0.1" className="bg-background border-border mt-1" />
            </div>
            <div>
              <Label>Wymiary (cm)</Label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <Input type="number" value={length} onChange={e => setLength(e.target.value)} placeholder="Dł." className="bg-background border-border" />
                <Input type="number" value={width} onChange={e => setWidth(e.target.value)} placeholder="Szer." className="bg-background border-border" />
                <Input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="Wys." className="bg-background border-border" />
              </div>
            </div>
            <div>
              <Label>Wartość do ubezpieczenia (PLN)</Label>
              <Input type="number" value={declared} onChange={e => setDeclared(e.target.value)} className="bg-background border-border mt-1" />
            </div>
            <Separator className="bg-border" />
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Waga fizyczna:</span><span>{weightKg.toFixed(2)} kg</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Waga objętościowa:</span><span>{vol.toFixed(2)} kg</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Waga rozliczeniowa:</span><span className="text-primary">{chargeableWeight.toFixed(2)} kg</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-2">
          <p className="text-xs text-muted-foreground mb-3">Wyniki posortowane od najtańszego:</p>
          {results.map((c, i) => (
            <Card key={c.name} className={`border-border bg-card transition-colors ${c.tooHeavy ? "opacity-50" : "hover:border-primary/30"} ${i === 0 && !c.tooHeavy ? "border-primary/40 bg-primary/5" : ""}`}>
              <CardContent className="flex items-center gap-4 py-3 px-4">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {c.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{c.name}</span>
                    {i === 0 && !c.tooHeavy && <Badge className="text-xs border-0 bg-primary text-black">Najtaniej</Badge>}
                    {c.tooHeavy && <Badge className="text-xs border-0 bg-red-900 text-red-200">Za ciężka</Badge>}
                  </div>
                  <div className="flex gap-3 mt-0.5 text-xs text-muted-foreground">
                    <span><Truck className="h-3 w-3 inline mr-0.5" />{c.time}</span>
                    <span>Max: {c.maxWeight}kg</span>
                    {c.features.slice(0, 2).map(f => <span key={f}>{f}</span>)}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xl font-bold text-primary">{c.price.toFixed(2)} PLN</div>
                  <div className="text-xs text-muted-foreground">brutto</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
