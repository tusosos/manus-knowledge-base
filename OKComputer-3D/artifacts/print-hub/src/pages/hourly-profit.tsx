import React, { useState, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, X, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { PageTransition, AnimatedSection } from "@/components/page-transition";

interface Product {
  id: string;
  name: string;
  price: number;
  materialCost: number;
  prepTime: number;
  postProcessTime: number;
  packagingTime: number;
  printTime: number;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: "1", name: "Figurka smok artykulowany", price: 35, materialCost: 5, prepTime: 10, postProcessTime: 5, packagingTime: 5, printTime: 3 },
  { id: "2", name: "Organizer biurkowy", price: 24, materialCost: 8, prepTime: 5, postProcessTime: 0, packagingTime: 5, printTime: 2 },
  { id: "3", name: "Litofan zdjecie 15x20", price: 45, materialCost: 3, prepTime: 20, postProcessTime: 10, packagingTime: 10, printTime: 4 },
  { id: "4", name: "Prototyp obudowy IoT", price: 180, materialCost: 30, prepTime: 60, postProcessTime: 30, packagingTime: 15, printTime: 8 },
  { id: "5", name: "Bizuteria — pierscionek", price: 12, materialCost: 2, prepTime: 5, postProcessTime: 15, packagingTime: 5, printTime: 1 },
];

function calcHourlyRate(p: Product) {
  const profit = p.price - p.materialCost;
  const yourTimeH = (p.prepTime + p.postProcessTime + p.packagingTime) / 60;
  const hourlyRate = yourTimeH > 0 ? profit / yourTimeH : 0;
  const effectiveRate = (yourTimeH + p.printTime) > 0 ? profit / (yourTimeH + p.printTime) : 0;
  return { profit, yourTimeH, hourlyRate, effectiveRate };
}

function rateColor(rate: number): string {
  if (rate >= 80) return "#22c55e";
  if (rate >= 40) return "#fbbf24";
  return "#ef4444";
}

function rateLabel(rate: number): string {
  if (rate >= 80) return "Swietny";
  if (rate >= 40) return "OK";
  return "Slaby";
}

export default function HourlyProfit() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [showAdd, setShowAdd] = useState(false);
  const [newP, setNewP] = useState({ name: "", price: "", materialCost: "", prepTime: "", postProcessTime: "", packagingTime: "", printTime: "" });
  const [threshold, setThreshold] = useState("40");

  const analyzed = products.map(p => ({
    ...p,
    ...calcHourlyRate(p),
  })).sort((a, b) => b.hourlyRate - a.hourlyRate);

  const avgRate = analyzed.length > 0 ? analyzed.reduce((s, p) => s + p.hourlyRate, 0) / analyzed.length : 0;
  const best = analyzed[0];
  const worst = analyzed[analyzed.length - 1];
  const parsedThreshold = parseFloat(threshold);
  const thresholdVal = Number.isFinite(parsedThreshold) ? parsedThreshold : 40;
  const belowThreshold = analyzed.filter(p => p.hourlyRate < thresholdVal);

  const chartData = analyzed.map(p => ({
    name: p.name.length > 15 ? p.name.slice(0, 15) + "..." : p.name,
    rate: Math.round(p.hourlyRate),
    effective: Math.round(p.effectiveRate),
    color: rateColor(p.hourlyRate),
  }));

  function addProduct() {
    if (!newP.name) return;
    const p: Product = {
      id: Date.now().toString(),
      name: newP.name,
      price: parseFloat(newP.price) || 0,
      materialCost: parseFloat(newP.materialCost) || 0,
      prepTime: parseFloat(newP.prepTime) || 0,
      postProcessTime: parseFloat(newP.postProcessTime) || 0,
      packagingTime: parseFloat(newP.packagingTime) || 0,
      printTime: parseFloat(newP.printTime) || 0,
    };
    setProducts(prev => [...prev, p]);
    setNewP({ name: "", price: "", materialCost: "", prepTime: "", postProcessTime: "", packagingTime: "", printTime: "" });
    setShowAdd(false);
  }

  function removeProduct(id: string) {
    setProducts(prev => prev.filter(p => p.id !== id));
  }

  return (
    <PageTransition className="space-y-6">
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Zysk na Godzine</h1>
            <p className="text-muted-foreground mt-1">Ile naprawde zarabiasz na kazdym produkcie? Analiza Twojego czasu.</p>
          </div>
          <Button size="sm" onClick={() => setShowAdd(!showAdd)} className="bg-primary text-black hover:bg-primary/90 min-h-[44px]" aria-label="Dodaj nowy produkt do analizy">
            <Plus className="h-4 w-4 mr-1" aria-hidden="true" />Dodaj produkt
          </Button>
        </div>
      </AnimatedSection>

      {showAdd && (
        <AnimatedSection>
          <Card className="border-primary/30 bg-card">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <Input placeholder="Nazwa produktu" value={newP.name} onChange={e => setNewP(p => ({ ...p, name: e.target.value }))} className="bg-background border-border" aria-label="Nazwa produktu" />
                <Input type="number" placeholder="Cena sprzedazy (PLN)" value={newP.price} onChange={e => setNewP(p => ({ ...p, price: e.target.value }))} className="bg-background border-border" aria-label="Cena sprzedazy" />
                <Input type="number" placeholder="Koszt materialu (PLN)" value={newP.materialCost} onChange={e => setNewP(p => ({ ...p, materialCost: e.target.value }))} className="bg-background border-border" aria-label="Koszt materialu" />
                <Input type="number" placeholder="Czas druku (h)" value={newP.printTime} onChange={e => setNewP(p => ({ ...p, printTime: e.target.value }))} className="bg-background border-border" aria-label="Czas druku w godzinach" />
                <Input type="number" placeholder="Przygotowanie (min)" value={newP.prepTime} onChange={e => setNewP(p => ({ ...p, prepTime: e.target.value }))} className="bg-background border-border" aria-label="Czas przygotowania w minutach" />
                <Input type="number" placeholder="Post-processing (min)" value={newP.postProcessTime} onChange={e => setNewP(p => ({ ...p, postProcessTime: e.target.value }))} className="bg-background border-border" aria-label="Czas post-processingu w minutach" />
                <Input type="number" placeholder="Pakowanie (min)" value={newP.packagingTime} onChange={e => setNewP(p => ({ ...p, packagingTime: e.target.value }))} className="bg-background border-border" aria-label="Czas pakowania w minutach" />
                <Button onClick={addProduct} className="bg-primary text-black min-h-[44px]">Dodaj</Button>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      )}

      <AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-5 w-5 mx-auto mb-1 text-primary" aria-hidden="true" />
              <div className="text-2xl font-bold" style={{ color: rateColor(avgRate) }}>{Math.round(avgRate)} PLN/h</div>
              <p className="text-xs text-muted-foreground">Srednia stawka godzinowa</p>
            </CardContent>
          </Card>
          <Card className="border-green-800/50 bg-card">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-400" aria-hidden="true" />
              <div className="text-2xl font-bold text-green-400">{best ? Math.round(best.hourlyRate) : 0} PLN/h</div>
              <p className="text-xs text-muted-foreground truncate">{best?.name || "-"}</p>
            </CardContent>
          </Card>
          <Card className={`border-border bg-card ${worst && worst.hourlyRate < thresholdVal ? "border-red-800/50" : ""}`}>
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-5 w-5 mx-auto mb-1 text-red-400" aria-hidden="true" />
              <div className="text-2xl font-bold text-red-400">{worst ? Math.round(worst.hourlyRate) : 0} PLN/h</div>
              <p className="text-xs text-muted-foreground truncate">{worst?.name || "-"}</p>
            </CardContent>
          </Card>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>Stawka godzinowa (Twoj czas) vs efektywna (z drukiem)</span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-normal">
                <label htmlFor="threshold-input">Prog eliminacji:</label>
                <Input id="threshold-input" type="number" value={threshold} onChange={e => setThreshold(e.target.value)} className="w-16 h-6 text-xs bg-background border-border text-center" min="0" />
                <span>PLN/h</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                <XAxis type="number" stroke="#888" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#888" fontSize={11} width={120} />
                <Tooltip
                  contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", fontSize: "12px" }}
                  formatter={(value: number, name: string) => [`${value} PLN/h`, name === "rate" ? "Twoj czas" : "Z drukiem"]}
                />
                <ReferenceLine x={thresholdVal} stroke="#ef4444" strokeDasharray="5 5" label={{ value: `${threshold} PLN/h`, fill: "#ef4444", fontSize: 10 }} />
                <Bar dataKey="rate" name="Twoj czas" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
                <Bar dataKey="effective" name="Z drukiem" fill="#555" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </AnimatedSection>

      <AnimatedSection>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Ranking produktow</p>
          {analyzed.map((p, i) => (
            <Card key={p.id} className="border-border bg-card hover:border-primary/20 transition-colors">
              <CardContent className="py-3 px-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: rateColor(p.hourlyRate) + "22", color: rateColor(p.hourlyRate) }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{p.name}</span>
                    <Badge className="text-[10px] border-0" style={{ background: rateColor(p.hourlyRate) + "22", color: rateColor(p.hourlyRate) }}>{rateLabel(p.hourlyRate)}</Badge>
                    {p.hourlyRate < thresholdVal && <Badge className="text-[10px] border-0 bg-red-900 text-red-200">Ponizej progu</Badge>}
                  </div>
                  <div className="flex gap-2 sm:gap-4 mt-1 text-xs text-muted-foreground flex-wrap">
                    <span>Cena: {p.price} PLN</span>
                    <span>Koszt mat.: {p.materialCost} PLN</span>
                    <span>Zysk: {p.profit.toFixed(0)} PLN</span>
                    <span>Twoj czas: {(p.yourTimeH * 60).toFixed(0)} min</span>
                    <span>Druk: {p.printTime}h</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold" style={{ color: rateColor(p.hourlyRate) }}>{Math.round(p.hourlyRate)} PLN/h</div>
                  <div className="text-xs text-muted-foreground">efektywna: {Math.round(p.effectiveRate)} PLN/h</div>
                </div>
                <button
                  onClick={() => removeProduct(p.id)}
                  className="text-zinc-600 hover:text-red-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={`Usun produkt: ${p.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </AnimatedSection>

      {belowThreshold.length > 0 && (
        <AnimatedSection>
          <Card className="border-red-800/50 bg-red-900/10">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-sm" role="alert">
                  <p className="font-medium text-red-400">Rekomendacja: Rozważ eliminację {belowThreshold.length} produkt{belowThreshold.length === 1 ? "u" : "ow"} ponizej {threshold} PLN/h</p>
                  <p className="text-muted-foreground mt-1">
                    {belowThreshold.map(p => p.name).join(", ")} — te produkty zjadaja Twoj czas przy niskim zysku.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      )}
    </PageTransition>
  );
}
