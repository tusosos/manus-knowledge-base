import React, { useState, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, DollarSign, Clock, CheckCircle2, Lightbulb, Users, Wrench } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { PageTransition, AnimatedSection } from "@/components/page-transition";

function safeNum(val: string, fallback: number): number {
  const n = parseFloat(val);
  return Number.isFinite(n) ? n : fallback;
}

const SCALING_MILESTONES = [
  { orders: "0-20", phase: "Start", actions: "Buduj portfolio, testuj rynek, zbieraj opinie. Skupienie na jakosci.", printers: "1x H2D", monthly: "0-3 000 PLN" },
  { orders: "20-50", phase: "Stabilizacja", actions: "Optymalizacja procesow, marketing na Etsy/Allegro. Stali klienci.", printers: "1x H2D", monthly: "3 000-7 500 PLN" },
  { orders: "50-100", phase: "Wzrost", actions: "Rozważ 2. drukarke. Zatrudnij pomoc na czesc etatu. Automatyzacja.", printers: "1-2x H2D", monthly: "7 500-15 000 PLN" },
  { orders: "100-200", phase: "Skalowanie", actions: "2 drukarki, pracownik na etat. Wlasna strona WWW, B2B.", printers: "2x H2D", monthly: "15 000-30 000 PLN" },
  { orders: "200+", phase: "Studio 3D", actions: "3-4 drukarki, 2-3 pracownikow. Biuro/warsztat, SLA w ofercie.", printers: "3-4 drukarki", monthly: "30 000+ PLN" },
];

const AUTOMATION_TIPS = [
  { area: "Wyceny", tip: "Uzyj kalkulatora w aplikacji + szablony wycen. Automatyczna wycena na Etsy przez API.", time: "1-2h/tyg. oszczednosci" },
  { area: "Oferty", tip: "Szablony listing na Etsy/Allegro. Kopiuj i modyfikuj zamiast pisac od zera.", time: "2-3h/tyg. oszczednosci" },
  { area: "Wysylka", tip: "Integracja z InPost/DPD API. Automatyczne etykiety, śledzenie przesylek.", time: "1-2h/tyg. oszczednosci" },
  { area: "Ksiegowosc", tip: "Program do faktur online (iFirma, inFakt). Automatyczny import bankowy.", time: "2-4h/mies. oszczednosci" },
  { area: "Social media", tip: "Planowanie postow z wyprzedzeniem (Buffer, Later). Batch content creation.", time: "1-2h/tyg. oszczednosci" },
  { area: "Druk", tip: "Multi-plate w Bambu Studio — automatyczne drukowanie kolejnych plyt bez nadzoru.", time: "Ciagla produkcja" },
];

const HIRING_PLAN = [
  { role: "Asystent produkcji (pol etatu)", when: "50+ zamowien/mies.", tasks: "Post-processing, pakowanie, wysylka, QC", cost: "~2 500 PLN/mies." },
  { role: "Operator drukarki (etat)", when: "100+ zamowien/mies.", tasks: "Obsluga drukarek, slicing, monitoring, konserwacja", cost: "~4 500 PLN/mies." },
  { role: "Obsluga klienta (pol etatu)", when: "150+ zamowien/mies.", tasks: "Komunikacja z klientami, wyceny, reklamacje", cost: "~2 500 PLN/mies." },
  { role: "Projektant 3D (freelance)", when: "Na zlecenie", tasks: "Custom modele, modyfikacje, CAD", cost: "50-150 PLN/h" },
];

export default function Scaling() {
  const [monthlyOrders, setMonthlyOrders] = useState("40");
  const [avgOrderValue, setAvgOrderValue] = useState("120");
  const [avgPrintTime, setAvgPrintTime] = useState("4");
  const [growthRate, setGrowthRate] = useState("10");
  const [secondPrinterCost, setSecondPrinterCost] = useState("15000");
  const [additionalMonthlyCost, setAdditionalMonthlyCost] = useState("300");
  const [variableCostPct, setVariableCostPct] = useState("40");

  const orders = safeNum(monthlyOrders, 0);
  const avgVal = safeNum(avgOrderValue, 0);
  const printH = safeNum(avgPrintTime, 1) || 1;
  const growth = safeNum(growthRate, 0) / 100;
  const printerPrice = safeNum(secondPrinterCost, 15000);
  const extraMonthlyCost = safeNum(additionalMonthlyCost, 0);
  const varCostPct = safeNum(variableCostPct, 0) / 100;

  const maxHoursPerDay = 20;
  const daysPerMonth = 26;
  const singleCapacityHours = maxHoursPerDay * daysPerMonth;
  const singleCapacityOrders = singleCapacityHours / printH;
  const dualCapacityOrders = singleCapacityOrders * 2;

  const data = Array.from({ length: 13 }, (_, month) => {
    const demand = Math.round(orders * Math.pow(1 + growth, month));
    const singleCap = Math.round(singleCapacityOrders);
    const dualCap = Math.round(dualCapacityOrders);
    const singleFulfilled = Math.min(demand, singleCap);
    const dualFulfilled = Math.min(demand, dualCap);
    const lostOrders = Math.max(0, demand - singleCap);
    const lostRevenue = lostOrders * avgVal;
    const singleRevenue = singleFulfilled * avgVal;
    const dualRevenue = dualFulfilled * avgVal;
    const singleProfit = singleRevenue * (1 - varCostPct);
    const dualProfit = dualRevenue * (1 - varCostPct) - extraMonthlyCost;
    return {
      month: `M${month}`,
      demand,
      singleCap,
      dualCap,
      lostRevenue,
      singleProfit: Math.round(singleProfit),
      dualProfit: Math.round(dualProfit),
      lostOrders,
    };
  });

  const overflowMonth = data.findIndex(d => d.demand > d.singleCap);
  const totalLostRevenue = data.reduce((s, d) => s + d.lostRevenue, 0);
  const totalLostOrders = data.reduce((s, d) => s + d.lostOrders, 0);

  const cumulativeDualExtraProfit = data.reduce((acc, d, i) => {
    if (i === 0) return [0];
    const extra = d.dualProfit - d.singleProfit;
    acc.push((acc[acc.length - 1] || 0) + extra);
    return acc;
  }, [] as number[]);
  const roiMonth = cumulativeDualExtraProfit.findIndex(v => v >= printerPrice);

  return (
    <PageTransition className="space-y-6">
      <AnimatedSection>
        <h1 className="text-3xl font-bold tracking-tight">Kalkulator Skalowania</h1>
        <p className="text-muted-foreground mt-1">Kiedy kupic druga drukarke H2D? Symulator wzrostu, ROI i plan skalowania biznesu.</p>
      </AnimatedSection>

      <div className="grid lg:grid-cols-3 gap-6">
        <AnimatedSection>
          <Card className="border-border bg-card">
            <CardHeader><CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Parametry</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="monthly-orders">Zamowienia / miesiac</Label>
                <Input id="monthly-orders" type="number" value={monthlyOrders} onChange={e => setMonthlyOrders(e.target.value)} className="bg-background border-border mt-1" min="1" />
              </div>
              <div>
                <Label htmlFor="avg-order-value">Srednia wartosc zamowienia (PLN)</Label>
                <Input id="avg-order-value" type="number" value={avgOrderValue} onChange={e => setAvgOrderValue(e.target.value)} className="bg-background border-border mt-1" min="1" />
              </div>
              <div>
                <Label htmlFor="avg-print-time">Sredni czas druku / zamowienie (h)</Label>
                <Input id="avg-print-time" type="number" value={avgPrintTime} onChange={e => setAvgPrintTime(e.target.value)} className="bg-background border-border mt-1" min="0.5" step="0.5" />
              </div>
              <div>
                <Label htmlFor="growth-rate">Wzrost zamowien / miesiac (%)</Label>
                <Input id="growth-rate" type="number" value={growthRate} onChange={e => setGrowthRate(e.target.value)} className="bg-background border-border mt-1" min="0" />
              </div>
              <div>
                <Label htmlFor="printer-cost">Koszt 2. drukarki (PLN)</Label>
                <Input id="printer-cost" type="number" value={secondPrinterCost} onChange={e => setSecondPrinterCost(e.target.value)} className="bg-background border-border mt-1" min="0" />
              </div>
              <div>
                <Label htmlFor="extra-monthly">Dodatkowe koszty miesieczne (PLN)</Label>
                <Input id="extra-monthly" type="number" value={additionalMonthlyCost} onChange={e => setAdditionalMonthlyCost(e.target.value)} className="bg-background border-border mt-1" min="0" />
                <p className="text-xs text-muted-foreground mt-1">Prad, miejsce, konserwacja</p>
              </div>
              <div>
                <Label htmlFor="var-cost">Koszty zmienne (%)</Label>
                <Input id="var-cost" type="number" value={variableCostPct} onChange={e => setVariableCostPct(e.target.value)} className="bg-background border-border mt-1" min="0" max="100" />
              </div>

              <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">Zalozenia:</p>
                <p>H2D drukuje max ~{maxHoursPerDay}h/dzien ({daysPerMonth} dni/mies.)</p>
                <p>Pojemnosc 1 drukarki: <span className="text-primary font-medium">{Math.round(singleCapacityOrders)} zamowien/mies.</span></p>
                <p>Pojemnosc 2 drukarek: <span className="text-primary font-medium">{Math.round(dualCapacityOrders)} zamowien/mies.</span></p>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        <div className="lg:col-span-2 space-y-4">
          <AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Card className={`border-border bg-card ${overflowMonth >= 0 ? "border-red-800/50" : "border-green-800/50"}`}>
                <CardContent className="p-4 text-center">
                  <AlertTriangle className={`h-5 w-5 mx-auto mb-1 ${overflowMonth >= 0 ? "text-red-400" : "text-green-400"}`} aria-hidden="true" />
                  <div className="text-2xl font-bold">{overflowMonth >= 0 ? `Miesiac ${overflowMonth}` : "Brak"}</div>
                  <p className="text-xs text-muted-foreground">Przekroczenie pojemnosci</p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-5 w-5 mx-auto mb-1 text-red-400" aria-hidden="true" />
                  <div className="text-2xl font-bold text-red-400">{Math.round(totalLostRevenue).toLocaleString("pl-PL")} PLN</div>
                  <p className="text-xs text-muted-foreground">Utracony przychod (12 mies.)</p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="p-4 text-center">
                  <Clock className="h-5 w-5 mx-auto mb-1 text-primary" aria-hidden="true" />
                  <div className="text-2xl font-bold text-primary">{roiMonth >= 0 ? `${roiMonth} mies.` : ">12 mies."}</div>
                  <p className="text-xs text-muted-foreground">ROI 2. drukarki</p>
                </CardContent>
              </Card>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <Card className="border-border bg-card">
              <CardHeader><CardTitle className="text-sm">Popyt vs Pojemnosc (12 miesiecy)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip
                      contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", fontSize: "12px" }}
                      labelStyle={{ color: "#fbbf24" }}
                    />
                    <Area type="monotone" dataKey="demand" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.1} strokeWidth={2} name="Popyt" />
                    <Area type="monotone" dataKey="singleCap" stroke="#ef4444" fill="#ef4444" fillOpacity={0.05} strokeWidth={1} strokeDasharray="5 5" name="Pojemnosc 1x H2D" />
                    <Area type="monotone" dataKey="dualCap" stroke="#22c55e" fill="#22c55e" fillOpacity={0.05} strokeWidth={1} strokeDasharray="5 5" name="Pojemnosc 2x H2D" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection>
            <Card className="border-border bg-card">
              <CardHeader><CardTitle className="text-sm">Zysk miesiecny: 1 drukarka vs 2 drukarki</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip
                      contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", fontSize: "12px" }}
                      formatter={(value: number) => [`${value.toLocaleString("pl-PL")} PLN`]}
                    />
                    <Line type="monotone" dataKey="singleProfit" stroke="#ef4444" strokeWidth={2} name="1x H2D" dot={false} />
                    <Line type="monotone" dataKey="dualProfit" stroke="#22c55e" strokeWidth={2} name="2x H2D" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection>
            <Card className="border-amber-800/30 bg-amber-900/10">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="text-sm" role="status">
                    {overflowMonth >= 0 ? (
                      <>
                        <p className="font-medium">Przy obecnym wzroscie ({growthRate}%/mies.) przekroczysz pojemnosc jednej H2D w <span className="text-primary">miesiacu {overflowMonth}</span>.</p>
                        <p className="text-muted-foreground mt-1">W ciagu 12 miesiecy stracisz <span className="text-red-400 font-medium">{totalLostOrders} zamowien</span> o wartosci <span className="text-red-400 font-medium">{Math.round(totalLostRevenue).toLocaleString("pl-PL")} PLN</span>.</p>
                        {roiMonth >= 0 && <p className="text-muted-foreground mt-1">Druga drukarka zwroci sie w <span className="text-green-400 font-medium">{roiMonth} miesiecy</span>.</p>}
                      </>
                    ) : (
                      <p className="font-medium text-green-400">Jedna drukarka wystarcza na obecny poziom zamowien i prognozowany wzrost. Monitoruj sytuacje.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>

      <AnimatedSection>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-primary" />Kamienie milowe skalowania
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="text-left py-2">Zamowienia/mies.</th>
                    <th className="text-center py-2">Faza</th>
                    <th className="text-center py-2">Drukarki</th>
                    <th className="text-center py-2">Przychod</th>
                    <th className="text-left py-2 pl-3">Dzialania</th>
                  </tr>
                </thead>
                <tbody>
                  {SCALING_MILESTONES.map((m, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-2 text-xs font-medium">{m.orders}</td>
                      <td className="text-center py-2">
                        <Badge className={`text-xs border-0 ${m.phase === "Start" ? "bg-blue-900 text-blue-200" : m.phase === "Stabilizacja" ? "bg-green-900 text-green-200" : m.phase === "Wzrost" ? "bg-amber-900 text-amber-200" : m.phase === "Skalowanie" ? "bg-purple-900 text-purple-200" : "bg-primary/20 text-primary"}`}>{m.phase}</Badge>
                      </td>
                      <td className="text-center py-2 text-xs">{m.printers}</td>
                      <td className="text-center py-2 text-xs text-primary font-medium">{m.monthly}</td>
                      <td className="text-left py-2 pl-3 text-xs text-muted-foreground">{m.actions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      <AnimatedSection>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Wrench className="h-5 w-5 text-primary" />Automatyzacja procesow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {AUTOMATION_TIPS.map((a, i) => (
                <div key={i} className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{a.area}</span>
                    <Badge className="text-xs border-0 bg-green-900 text-green-200">{a.time}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{a.tip}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-5 w-5 text-primary" />Plan zatrudnienia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {HIRING_PLAN.map((h, i) => (
                <div key={i} className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                  <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                    <span className="text-sm font-medium">{h.role}</span>
                    <Badge className="text-xs border-0 bg-amber-900 text-amber-200">{h.when}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{h.tasks}</p>
                  <p className="text-xs text-primary font-medium mt-1">{h.cost}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-sm space-y-1">
                <p className="font-medium">Wskazowki skalowania:</p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Nie kupuj 2. drukarki zbyt wczesnie — lepiej osiagnac 80% pojemnosci obecnej drukarki.</li>
                  <li>Zatrudnij pomoc do pakowania/wysylki zanim do druku — to najbardziej czasochlonne zadanie.</li>
                  <li>Automatyzuj powtarzalne procesy (wyceny, oferty) zanim zatrudnisz dodatkowe osoby.</li>
                  <li>Rozważ rozna drukarke na 2. — np. SLA do figurek premium, FDM do duzych elementow.</li>
                  <li>Buduj bufor finansowy (3 miesiace kosztow stalych) przed kazdym krokiem skalowania.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    </PageTransition>
  );
}
