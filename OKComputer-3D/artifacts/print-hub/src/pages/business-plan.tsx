import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Target, DollarSign, BarChart3, Shield, AlertTriangle, Lightbulb, Megaphone, Settings, Tag, Rocket, FileText, Users, Calendar, CheckCircle2, ArrowRight } from "lucide-react";

export default function BusinessPlan() {
  const [monthlyOrders, setMonthlyOrders] = useState("30");
  const [avgOrderValue, setAvgOrderValue] = useState("150");
  const [fixedCosts, setFixedCosts] = useState("800");
  const [variableCostPct, setVariableCostPct] = useState("40");
  const [printerCost, setPrinterCost] = useState("15000");
  const [amortizationMonths, setAmortizationMonths] = useState("24");
  const [insuranceCost, setInsuranceCost] = useState("100");
  const [softwareCost, setSoftwareCost] = useState("50");
  const [marketingCost, setMarketingCost] = useState("200");

  const [swotStrengths, setSwotStrengths] = useState("Bambu Lab H2D Combo — 16 kolorow multicolor\nDual nozzle — dwa materialy jednoczesnie\nDuzy build volume 300x300x400mm\nNiskie koszty wejscia\nSzybki czas realizacji 1-3 dni");
  const [swotWeaknesses, setSwotWeaknesses] = useState("Ograniczona skala — 1 drukarka\nBrak doswiadczenia biznesowego\nBrak rozpoznawalnosci marki\nZaleznosc od jednej technologii (FDM)");
  const [swotOpportunities, setSwotOpportunities] = useState("Rynek druku 3D rosnie 5.6% rocznie (AMPOWER 2026)\nPopyt na personalizacje i small batch\nMulticolor premium — brak konkurencji lokalnie\nE-commerce: Etsy, Allegro, Amazon Handmade");
  const [swotThreats, setSwotThreats] = useState("Konkurencja cenowa z Chin\nSpadek cen drukarek — wieksza dostepnosc\nZmiany regulacyjne (VAT, ZUS)\nReklamacje i zwroty");

  const [activeSection, setActiveSection] = useState<string>("summary");

  const totalFixed = parseFloat(fixedCosts) + parseFloat(insuranceCost) + parseFloat(softwareCost) + parseFloat(marketingCost);
  const monthlyRevenue = parseFloat(monthlyOrders) * parseFloat(avgOrderValue) || 0;
  const variableCosts = monthlyRevenue * (parseFloat(variableCostPct) / 100) || 0;
  const amortMonths = parseFloat(amortizationMonths) || 1;
  const printerAmortization = amortMonths > 0 ? (parseFloat(printerCost) || 0) / amortMonths : 0;
  const totalFixedCosts = totalFixed + printerAmortization;
  const totalCosts = variableCosts + totalFixedCosts;
  const monthlyProfit = monthlyRevenue - totalCosts;
  const avgOrd = parseFloat(avgOrderValue) || 0;
  const varPct = parseFloat(variableCostPct) || 0;
  const contributionPerOrder = avgOrd * (1 - varPct / 100);
  const breakEvenOrders = contributionPerOrder > 0 ? Math.ceil(totalFixedCosts / contributionPerOrder) : 0;

  const projections = [3, 6, 12].map(months => ({
    months,
    revenue: monthlyRevenue * months,
    costs: totalCosts * months,
    profit: monthlyProfit * months,
    growth: months === 3 ? 1.0 : months === 6 ? 1.15 : 1.3,
  }));

  const sections = [
    { key: "summary", label: "Executive Summary", icon: <FileText className="h-3.5 w-3.5" /> },
    { key: "finance", label: "Finanse", icon: <DollarSign className="h-3.5 w-3.5" /> },
    { key: "marketing", label: "Marketing", icon: <Megaphone className="h-3.5 w-3.5" /> },
    { key: "operations", label: "Plan operacyjny", icon: <Settings className="h-3.5 w-3.5" /> },
    { key: "pricing", label: "Strategie cenowe", icon: <Tag className="h-3.5 w-3.5" /> },
    { key: "risk", label: "Analiza ryzyka", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
    { key: "growth", label: "Plan wzrostu", icon: <Rocket className="h-3.5 w-3.5" /> },
    { key: "swot", label: "SWOT", icon: <Shield className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Biznes Plan</h1>
        <p className="text-muted-foreground mt-1">Kompleksowa analiza biznesowa druku 3D z H2D Combo</p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <span className="text-sm font-medium">Rynek druku 3D 2026</span>
              <span className="text-xs text-muted-foreground ml-2">Wzrost 5.6% r/r (zrodlo: AMPOWER). Segment consumer/prosumer najszybciej rosnacy. Popyt na personalizacje i small batch.</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-1.5 flex-wrap">
        {sections.map(s => (
          <button key={s.key} onClick={() => setActiveSection(s.key)} className={`px-3 py-1.5 text-xs rounded-md flex items-center gap-1.5 font-medium transition-colors ${activeSection === s.key ? "bg-primary text-black" : "bg-card text-muted-foreground border border-border hover:border-primary/30"}`}>
            {s.icon}{s.label}
          </button>
        ))}
      </div>

      {activeSection === "summary" && (
        <div className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5 text-primary" />Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 space-y-3">
                <h3 className="font-medium text-sm">Opis przedsiewziecia</h3>
                <p className="text-sm text-muted-foreground">
                  Jednoosobowa dzialalnosc gospodarcza specjalizujaca sie w druku 3D z wykorzystaniem drukarki Bambu Lab H2D Combo — pierwszej drukarki FDM z 16-kolorowym drukiem multicolor i podwojnymi dyszami. Oferta obejmuje druk na zamowienie (custom/print-on-demand), sprzedaz gotowych produktow przez platformy e-commerce (Etsy, Allegro) oraz uslugi prototypowania dla firm.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                  <div className="text-xs text-muted-foreground mb-1">Inwestycja poczatkowa</div>
                  <div className="text-lg font-bold text-primary">~20 000 PLN</div>
                  <div className="text-xs text-muted-foreground mt-1">Drukarka H2D (15k) + filament (2k) + narzedzia i opakowania (3k)</div>
                </div>
                <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                  <div className="text-xs text-muted-foreground mb-1">Prognozowany zysk miesieczny</div>
                  <div className={`text-lg font-bold ${monthlyProfit >= 0 ? "text-green-400" : "text-red-400"}`}>{monthlyProfit.toFixed(0)} PLN</div>
                  <div className="text-xs text-muted-foreground mt-1">Przy {monthlyOrders} zamowieniach/mies.</div>
                </div>
                <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                  <div className="text-xs text-muted-foreground mb-1">Zwrot inwestycji (ROI)</div>
                  <div className="text-lg font-bold text-primary">{monthlyProfit > 0 ? `${Math.ceil(20000 / monthlyProfit)} mies.` : "N/D"}</div>
                  <div className="text-xs text-muted-foreground mt-1">Szacowany czas zwrotu</div>
                </div>
              </div>

              <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 space-y-3">
                <h3 className="font-medium text-sm">Kluczowe przewagi konkurencyjne</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {[
                    "Multicolor 16 kolorow — jedyny na rynku lokalnym",
                    "Dual nozzle — dwa materialy jednoczesnie",
                    "Szybki turnaround 1-3 dni vs 5-14 u konkurencji",
                    "Niskie koszty operacyjne — praca z domu",
                    "Build volume 300x300x400mm — wieksze wydruki",
                    "Predkosc druku 500mm/s — wydajnosc",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 space-y-3">
                <h3 className="font-medium text-sm">Grupa docelowa</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { segment: "Hobbyisci i gracze RPG", desc: "Figurki, miniatury, elementy cosplay. Wysoka marza, lojalnosc klienta.", share: "30%" },
                    { segment: "E-commerce / dekoracje", desc: "Doniczki, wazony, lampki, litofany. Staly popyt, sezonowosc.", share: "25%" },
                    { segment: "Firmy / prototypowanie", desc: "Obudowy IoT, prototypy mechaniczne, male serie. Najwyzsze zamowienia.", share: "25%" },
                    { segment: "Personalizacja / gifty", desc: "Breloki, bizuteria, prezenty personalizowane. Wysoka marza.", share: "20%" },
                  ].map((seg, i) => (
                    <div key={i} className="p-2.5 bg-zinc-800 rounded border border-zinc-700">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{seg.segment}</span>
                        <Badge className="text-xs border-0 bg-primary/20 text-primary">{seg.share}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{seg.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeSection === "finance" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card className="border-border bg-card">
              <CardHeader><CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Przychody</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Zamowienia miesiecznie</Label>
                  <Input type="number" value={monthlyOrders} onChange={e => setMonthlyOrders(e.target.value)} className="bg-background border-border mt-1" />
                </div>
                <div>
                  <Label>Srednia wartosc zamowienia (PLN)</Label>
                  <Input type="number" value={avgOrderValue} onChange={e => setAvgOrderValue(e.target.value)} className="bg-background border-border mt-1" />
                </div>
                <div className="text-xs text-muted-foreground p-2 bg-zinc-900 rounded border border-zinc-800">
                  Modele przychodu: Print-on-demand, custom zlecenia, small batch (serie 10-100 szt.)
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader><CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Koszty stale</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Wynajem / biuro (PLN)</Label>
                    <Input type="number" value={fixedCosts} onChange={e => setFixedCosts(e.target.value)} className="bg-background border-border mt-1 h-8 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs">Ubezpieczenie (PLN)</Label>
                    <Input type="number" value={insuranceCost} onChange={e => setInsuranceCost(e.target.value)} className="bg-background border-border mt-1 h-8 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs">Oprogramowanie (PLN)</Label>
                    <Input type="number" value={softwareCost} onChange={e => setSoftwareCost(e.target.value)} className="bg-background border-border mt-1 h-8 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs">Marketing (PLN)</Label>
                    <Input type="number" value={marketingCost} onChange={e => setMarketingCost(e.target.value)} className="bg-background border-border mt-1 h-8 text-sm" />
                  </div>
                </div>
                <Separator className="bg-border" />
                <div>
                  <Label className="text-xs">Koszty zmienne (% przychodu)</Label>
                  <p className="text-xs text-muted-foreground mb-1">Materialy, energia, praca</p>
                  <Input type="number" value={variableCostPct} onChange={e => setVariableCostPct(e.target.value)} className="bg-background border-border" min="0" max="100" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Koszt drukarki (PLN)</Label>
                    <Input type="number" value={printerCost} onChange={e => setPrinterCost(e.target.value)} className="bg-background border-border mt-1 h-8 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs">Amortyzacja (mies.)</Label>
                    <Input type="number" value={amortizationMonths} onChange={e => setAmortizationMonths(e.target.value)} className="bg-background border-border mt-1 h-8 text-sm" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className={`border-border bg-card ${monthlyProfit >= 0 ? "border-green-800/50" : "border-red-800/50"}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <DollarSign className="h-5 w-5 text-primary" />Wyniki miesieczne
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Przychod</span>
                  <span className="font-medium">{monthlyRevenue.toFixed(0)} PLN</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Koszty zmienne ({variableCostPct}%)</span>
                  <span className="text-red-400">-{variableCosts.toFixed(0)} PLN</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Koszty stale</span>
                  <span className="text-red-400">-{totalFixed.toFixed(0)} PLN</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amortyzacja H2D</span>
                  <span className="text-red-400">-{printerAmortization.toFixed(0)} PLN</span>
                </div>
                <Separator className="bg-border" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Zysk netto</span>
                  <span className={monthlyProfit >= 0 ? "text-green-400" : "text-red-400"}>{monthlyProfit.toFixed(0)} PLN</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Marza netto</span>
                  <span>{monthlyRevenue > 0 ? ((monthlyProfit / monthlyRevenue) * 100).toFixed(1) : 0}%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-5 w-5 text-primary" />Prognoza przychodu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {projections.map(p => (
                    <div key={p.months} className={`p-3 rounded-lg border ${p.profit * p.growth >= 0 ? "border-green-800/50 bg-green-900/10" : "border-red-800/50 bg-red-900/10"}`}>
                      <div className="text-xs text-muted-foreground">{p.months} mies.</div>
                      <div className="text-sm font-bold mt-1">{(p.revenue * p.growth).toFixed(0)} PLN</div>
                      <div className={`text-xs mt-0.5 ${(p.profit * p.growth) >= 0 ? "text-green-400" : "text-red-400"}`}>
                        Zysk: {(p.profit * p.growth).toFixed(0)} PLN
                      </div>
                      {p.growth > 1 && (
                        <div className="text-xs text-muted-foreground mt-0.5">+{((p.growth - 1) * 100).toFixed(0)}% wzrost</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={`border-border bg-card ${breakEvenOrders <= parseFloat(monthlyOrders) ? "border-green-800/50 bg-green-900/10" : "border-amber-800/50 bg-amber-900/10"}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-5 w-5 text-primary" />Prog rentownosci
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="text-2xl font-bold">{breakEvenOrders} zamowien/mies.</div>
                <p className="text-muted-foreground text-xs">
                  {parseFloat(monthlyOrders) >= breakEvenOrders
                    ? `Osiagasz prog! Masz ${parseFloat(monthlyOrders) - breakEvenOrders} zamowien ponad progiem.`
                    : `Potrzebujesz jeszcze ${breakEvenOrders - parseFloat(monthlyOrders)} zamowien do progu rentownosci.`}
                </p>
                <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full ${parseFloat(monthlyOrders) >= breakEvenOrders ? "bg-green-500" : "bg-amber-500"}`}
                    style={{ width: `${Math.min((parseFloat(monthlyOrders) / breakEvenOrders) * 100, 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeSection === "marketing" && (
        <div className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Megaphone className="h-5 w-5 text-primary" />Strategia marketingowa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                <h3 className="font-medium text-sm mb-3">Kanaly sprzedazy online</h3>
                <div className="space-y-2">
                  {[
                    { channel: "Etsy", priority: "Glowny", budget: "100 PLN/mies.", desc: "Promoted listings, SEO tytulow. Target: klienci miedzynarodowi, figurki, dekoracje.", timeline: "Od startu" },
                    { channel: "Allegro", priority: "Glowny", budget: "150 PLN/mies.", desc: "Allegro Ads, pozycjonowanie ofert. Target: rynek PL, organizery, etui, obudowy.", timeline: "Od startu" },
                    { channel: "OLX", priority: "Wspomagajacy", budget: "0 PLN", desc: "Darmowe ogloszenia, lokalna sprzedaz, custom zlecenia.", timeline: "Od startu" },
                    { channel: "Instagram/TikTok", priority: "Budowanie marki", budget: "50-100 PLN/mies.", desc: "Timelapse wydruków, behind-the-scenes, shows multicolor. Organiczny wzrost.", timeline: "Miesiac 1-2" },
                    { channel: "Wlasna strona WWW", priority: "Dlugoterminowy", budget: "50 PLN/mies.", desc: "Portfolio, formularz zamowien custom, blog o druku 3D. SEO lokalne.", timeline: "Miesiac 3-6" },
                  ].map((ch, i) => (
                    <div key={i} className="flex items-start gap-3 p-2.5 bg-zinc-800 rounded border border-zinc-700">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">{ch.channel}</span>
                          <Badge className={`text-xs border-0 ${ch.priority === "Glowny" ? "bg-primary/20 text-primary" : ch.priority === "Budowanie marki" ? "bg-blue-900 text-blue-200" : "bg-zinc-700 text-zinc-300"}`}>{ch.priority}</Badge>
                          <Badge className="text-xs border-0 bg-green-900 text-green-200">{ch.budget}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{ch.desc}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Start: {ch.timeline}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                <h3 className="font-medium text-sm mb-3">Kanaly offline</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {[
                    { channel: "Targi i eventy", desc: "Udzial w targach modelarskich, maker faire, konwentach RPG. Wizytowki + probki." },
                    { channel: "Wspolpraca z firmami", desc: "Lokalne firmy IT, startupy — prototypy, obudowy. Networking na meetupach." },
                    { channel: "Grupy hobbystyczne", desc: "Kluby RPG, cosplay, modelarskie. Pokazy mozliwosci druku multicolor." },
                    { channel: "Poczta pantoflowa", desc: "Najlepsza reklama — zadowoleni klienci polecaja dalej. Karteczka z rabatem za polecenie." },
                  ].map((ch, i) => (
                    <div key={i} className="p-2.5 bg-zinc-800 rounded border border-zinc-700">
                      <span className="text-sm font-medium">{ch.channel}</span>
                      <p className="text-xs text-muted-foreground mt-1">{ch.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                <h3 className="font-medium text-sm mb-2">Budzet marketingowy miesieczny</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { item: "Allegro Ads", cost: "150 PLN" },
                    { item: "Etsy Promoted", cost: "100 PLN" },
                    { item: "Social media", cost: "50-100 PLN" },
                    { item: "Laczny budzet", cost: "300-350 PLN" },
                  ].map((b, i) => (
                    <div key={i} className={`p-2.5 rounded border ${i === 3 ? "bg-primary/10 border-primary/30" : "bg-zinc-800 border-zinc-700"}`}>
                      <div className="text-xs text-muted-foreground">{b.item}</div>
                      <div className={`text-sm font-bold mt-1 ${i === 3 ? "text-primary" : ""}`}>{b.cost}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                <h3 className="font-medium text-sm mb-2">Content marketing — harmonogram</h3>
                <div className="space-y-2 text-xs">
                  {[
                    { day: "Poniedzialek", content: "Post produktowy na Instagramie — zdjecie gotowego wydruku" },
                    { day: "Sroda", content: "TikTok timelapse — proces druku multicolor" },
                    { day: "Piatek", content: "Story z behind-the-scenes — pakowanie zamowien, nowe projekty" },
                    { day: "Niedziela", content: "Blog post / poradnik — 'Jak wybrac figurke 3D', 'Druk multicolor — co to jest?'" },
                  ].map((d, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 bg-zinc-800 rounded">
                      <Badge className="text-xs border-0 bg-zinc-700 text-zinc-300 w-24 justify-center">{d.day}</Badge>
                      <span className="text-muted-foreground">{d.content}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeSection === "operations" && (
        <div className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings className="h-5 w-5 text-primary" />Plan operacyjny
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                <h3 className="font-medium text-sm mb-3">Proces realizacji zamowienia</h3>
                <div className="space-y-2">
                  {[
                    { step: "1", title: "Przyjecie zamowienia", time: "5-15 min", desc: "Weryfikacja specyfikacji, potwierdzenie dostepnosci materialu, wycena (kalkulator)" },
                    { step: "2", title: "Przygotowanie modelu", time: "15-60 min", desc: "Slicing w Bambu Studio, optymalizacja supportow, ustawienia multicolor" },
                    { step: "3", title: "Druk 3D", time: "1-12h", desc: "Druk na H2D Combo, monitoring Lidar AI, kontrola pierwszych warstw" },
                    { step: "4", title: "Kontrola jakosci", time: "10-20 min", desc: "Inspekcja wizualna, pomiary, test wytrzymalosci (jesli wymagany)" },
                    { step: "5", title: "Post-processing", time: "10-30 min", desc: "Usuwanie supportow, szlifowanie, opcjonalnie malowanie/lakierowanie" },
                    { step: "6", title: "Pakowanie i wysylka", time: "10-15 min", desc: "Folia babelkowa, karton, etykieta kurierska, karteczka z podziekowaniem" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-start gap-3 p-2.5 bg-zinc-800 rounded border border-zinc-700">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">{s.step}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{s.title}</span>
                          <Badge className="text-xs border-0 bg-zinc-700 text-zinc-300">{s.time}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                <h3 className="font-medium text-sm mb-3">Kontrola jakosci — checklist</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {[
                    "Brak stringingu i artefaktow",
                    "Kolory zgodne z zamowieniem",
                    "Wymiary w tolerancji ±0.2mm",
                    "Brak warpingu i delaminacji",
                    "Powierzchnia gladka (zgodna ze spec.)",
                    "Supporty usunięte czysto",
                    "Ruchome elementy dzialaja poprawnie",
                    "Zdjecie gotowego produktu (archiwum)",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs p-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                  <h3 className="font-medium text-sm mb-3">Harmonogram dzienny</h3>
                  <div className="space-y-1.5 text-xs">
                    {[
                      { time: "08:00-09:00", task: "Sprawdzenie zamowien, odpowiedzi klientom" },
                      { time: "09:00-10:00", task: "Slicing i przygotowanie plikow" },
                      { time: "10:00-18:00", task: "Druk (2-3 zlecenia rownolegle z przerwami)" },
                      { time: "18:00-19:00", task: "QC, post-processing, pakowanie" },
                      { time: "19:00-20:00", task: "Wysylka (kurier/paczkomat), aktualizacja statusow" },
                      { time: "20:00-21:00", task: "Content marketing, nowe oferty, projektowanie" },
                    ].map((t, i) => (
                      <div key={i} className="flex gap-3 p-1.5 bg-zinc-800 rounded">
                        <span className="text-primary font-mono w-24 flex-shrink-0">{t.time}</span>
                        <span className="text-muted-foreground">{t.task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                  <h3 className="font-medium text-sm mb-3">Dostawcy i logistyka</h3>
                  <div className="space-y-2 text-xs">
                    {[
                      { item: "Filament PLA/PETG", supplier: "Bambu Lab Store, Devil Design, Spectrum", lead: "2-5 dni" },
                      { item: "Filament specjalny (PA, PC)", supplier: "Polymaker, Bambu Lab", lead: "5-10 dni" },
                      { item: "Opakowania", supplier: "Allegro/Hurtownia kartonow", lead: "2-3 dni" },
                      { item: "Kurier", supplier: "InPost, DPD, DHL — umowa biznesowa", lead: "1 dzien" },
                      { item: "Czesci zamienne H2D", supplier: "Bambu Lab oficjalny sklep", lead: "7-14 dni" },
                    ].map((s, i) => (
                      <div key={i} className="p-2 bg-zinc-800 rounded border border-zinc-700">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{s.item}</span>
                          <Badge className="text-xs border-0 bg-zinc-700 text-zinc-300">{s.lead}</Badge>
                        </div>
                        <p className="text-muted-foreground mt-0.5">{s.supplier}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeSection === "pricing" && (
        <div className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Tag className="h-5 w-5 text-primary" />Strategie cenowe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Standard (koszt + marza)",
                    desc: "Podstawowa strategia: oblicz koszt (material + energia + praca + amortyzacja), dodaj marze 100-200%. Proste, przewidywalne.",
                    example: "Figurka: koszt 8 PLN + marza 200% = 24 PLN",
                    color: "border-blue-800/30",
                  },
                  {
                    title: "Premium Multicolor",
                    desc: "Produkty multicolor wyceniaj 2-3x wyzej. Brak konkurencji na rynku — mozesz dyktowac ceny. Podkreslaj unikatowsc.",
                    example: "Smok multicolor: koszt 5 PLN, cena 25-35 PLN (marza 400-600%)",
                    color: "border-purple-800/30",
                  },
                  {
                    title: "Pakiety / Bundle",
                    desc: "Sprzedawaj zestawy w obnizzonej cenie za sztuke. Zwieksza srednia wartosc zamowienia i lojalnosc.",
                    example: "3 figurki osobno: 60 PLN, zestaw: 45 PLN (oszczednosc 25%)",
                    color: "border-green-800/30",
                  },
                  {
                    title: "Personalizacja premium",
                    desc: "Doliczaj 30-50% za personalizacje (imiona, daty, dedykacje). Klienci chetnie placa za unikat.",
                    example: "Brelok standard: 6 PLN, z imieniem: 9 PLN (+50%)",
                    color: "border-amber-800/30",
                  },
                ].map((s, i) => (
                  <div key={i} className={`p-4 bg-zinc-900 rounded-lg border ${s.color}`}>
                    <h4 className="text-sm font-medium">{s.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
                    <div className="text-xs text-primary mt-2 p-2 bg-zinc-800 rounded">{s.example}</div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                <h3 className="font-medium text-sm mb-3">Rabaty ilosciowe — przykladowa tabela</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs text-muted-foreground">
                        <th className="text-left py-2">Ilosc</th>
                        <th className="text-center py-2">Rabat</th>
                        <th className="text-center py-2">Przyklad (figurka 20 PLN)</th>
                        <th className="text-center py-2">Laczna wartosc</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { qty: "1 szt.", disc: "0%", unit: "20 PLN", total: "20 PLN" },
                        { qty: "5-9 szt.", disc: "10%", unit: "18 PLN", total: "90-162 PLN" },
                        { qty: "10-24 szt.", disc: "15%", unit: "17 PLN", total: "170-408 PLN" },
                        { qty: "25-49 szt.", disc: "20%", unit: "16 PLN", total: "400-784 PLN" },
                        { qty: "50+ szt.", disc: "25%", unit: "15 PLN", total: "750+ PLN" },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="py-2 text-xs font-medium">{row.qty}</td>
                          <td className="text-center py-2 text-xs text-green-400">{row.disc}</td>
                          <td className="text-center py-2 text-xs">{row.unit}</td>
                          <td className="text-center py-2 text-xs text-primary font-medium">{row.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                <h3 className="font-medium text-sm mb-3">Dodatkowe uslugi platne</h3>
                <div className="grid md:grid-cols-3 gap-2">
                  {[
                    { service: "Ekspres 24h", price: "+50%", desc: "Priorytetowa realizacja" },
                    { service: "Projektowanie 3D", price: "50-200 PLN/h", desc: "Modelowanie custom na zamowienie" },
                    { service: "Lakierowanie", price: "+30%", desc: "Wygladzanie i lakier UV" },
                    { service: "Malowanie reczne", price: "+50-100%", desc: "Figurki RPG, cosplay" },
                    { service: "Pakowanie prezentowe", price: "+10 PLN", desc: "Pudelko, wstazka, kartka" },
                    { service: "Prototyp + iteracja", price: "wg wyceny", desc: "Korekty modelu po protorypie" },
                  ].map((s, i) => (
                    <div key={i} className="p-2.5 bg-zinc-800 rounded border border-zinc-700">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">{s.service}</span>
                        <span className="text-xs text-primary font-medium">{s.price}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeSection === "risk" && (
        <div className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-5 w-5 text-primary" />Analiza ryzyka z mitygacja
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  risk: "Awaria drukarki H2D",
                  probability: "Srednie",
                  impact: "Wysoki",
                  mitigation: "Gwarancja Bambu Lab (12 mies.), zapas czesci zamiennych (dysza, hotend), znajomosc serwisu. W kryzysie: outsourcing do innego drukarza na czas naprawy.",
                  color: "border-red-800/30",
                },
                {
                  risk: "Konkurencja cenowa z Chin",
                  probability: "Wysokie",
                  impact: "Sredni",
                  mitigation: "Skupienie na personalizacji i multicolor (Chiny tego nie oferuja). Szybki turnaround (1-3 dni vs 2-4 tygodnie). Budowanie marki i relacji z klientami.",
                  color: "border-amber-800/30",
                },
                {
                  risk: "Brak zamowien / sezonowosc",
                  probability: "Srednie",
                  impact: "Sredni",
                  mitigation: "Dywersyfikacja kanalow (Etsy + Allegro + OLX). Produkty sezonowe (Boze Narodzenie, Halloween). Wspolpraca z firmami (prototypy — staly przychod).",
                  color: "border-amber-800/30",
                },
                {
                  risk: "Reklamacje i zwroty",
                  probability: "Niskie",
                  impact: "Niski",
                  mitigation: "Kontrola jakosci przed wyslka, zdjecia kazdego produktu. Jasna polityka zwrotow. Karteczka z instrukcja uzytkowania.",
                  color: "border-green-800/30",
                },
                {
                  risk: "Wzrost cen materialu / energii",
                  probability: "Srednie",
                  impact: "Sredni",
                  mitigation: "Zakupy hurtowe filamentu (10kg+), monitoring cen, elastyczne ceny produktow. Rozliczanie kosztow energii w kalkulatorze.",
                  color: "border-amber-800/30",
                },
                {
                  risk: "Zmiany prawne (VAT, ZUS, RODO)",
                  probability: "Niskie",
                  impact: "Sredni",
                  mitigation: "Konsultacje z ksiegowa, monitoring zmian legislacyjnych. Forma JDG z ryczaltem 8.5% — elastycznosc.",
                  color: "border-green-800/30",
                },
                {
                  risk: "Spadek cen drukarek 3D",
                  probability: "Wysokie",
                  impact: "Niski",
                  mitigation: "Wiecej konkurentow = wiekszy rynek. Skupienie na jakosc i serwis, nie sam sprzet. Early mover advantage w multicolor.",
                  color: "border-amber-800/30",
                },
                {
                  risk: "Wypalenie / brak work-life balance",
                  probability: "Srednie",
                  impact: "Wysoki",
                  mitigation: "Ustalony harmonogram pracy (max 10h/dzien). Automatyzacja (szablony ofert, auto-wycena). Plan zatrudnienia pomocy od miesiaca 6.",
                  color: "border-red-800/30",
                },
              ].map((r, i) => (
                <div key={i} className={`p-4 bg-zinc-900 rounded-lg border ${r.color}`}>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <span className="text-sm font-medium">{r.risk}</span>
                    <Badge className={`text-xs border-0 ${r.probability === "Wysokie" ? "bg-red-900 text-red-200" : r.probability === "Srednie" ? "bg-amber-900 text-amber-200" : "bg-green-900 text-green-200"}`}>P: {r.probability}</Badge>
                    <Badge className={`text-xs border-0 ${r.impact === "Wysoki" ? "bg-red-900 text-red-200" : r.impact === "Sredni" ? "bg-amber-900 text-amber-200" : "bg-green-900 text-green-200"}`}>I: {r.impact}</Badge>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <Shield className="h-3.5 w-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{r.mitigation}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {activeSection === "growth" && (
        <div className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Rocket className="h-5 w-5 text-primary" />Plan wzrostu — 3 lata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  year: "Rok 1 — Start i stabilizacja",
                  icon: "🚀",
                  goals: [
                    { goal: "Drukarki", detail: "1x H2D Combo" },
                    { goal: "Zamowienia", detail: "20-50/miesiac" },
                    { goal: "Przychod", detail: "3 000-7 500 PLN/mies." },
                    { goal: "Kanaly", detail: "Etsy + Allegro + OLX" },
                    { goal: "Zespol", detail: "Solo (wlasciciel)" },
                    { goal: "Cel", detail: "Osiqgnac prog rentownosci, zbudowac portfolio, zebrac opinie" },
                  ],
                  milestones: ["Pierwsze 100 zamowien", "50+ opinii na Etsy", "Stali klienci (5+)", "Optymalizacja procesow"],
                  color: "border-blue-800/30",
                },
                {
                  year: "Rok 2 — Wzrost i skalowanie",
                  icon: "📈",
                  goals: [
                    { goal: "Drukarki", detail: "2x H2D Combo (lub H2D + inna)" },
                    { goal: "Zamowienia", detail: "80-150/miesiac" },
                    { goal: "Przychod", detail: "12 000-22 500 PLN/mies." },
                    { goal: "Kanaly", detail: "+ Amazon Handmade + wlasna strona WWW" },
                    { goal: "Zespol", detail: "Wlasciciel + 1 pracownik (na pol etatu)" },
                    { goal: "Cel", detail: "Podwojenie mocy produkcyjnej, wejscie na rynki miedzynarodowe" },
                  ],
                  milestones: ["500+ zamowien lacznie", "Wlasna marka/logo", "Automatyzacja wycen", "Pierwsza wspolpraca B2B"],
                  color: "border-green-800/30",
                },
                {
                  year: "Rok 3 — Profesjonalizacja",
                  icon: "🏢",
                  goals: [
                    { goal: "Drukarki", detail: "3-4 drukarki (mix FDM/SLA)" },
                    { goal: "Zamowienia", detail: "200-400/miesiac" },
                    { goal: "Przychod", detail: "30 000-60 000 PLN/mies." },
                    { goal: "Kanaly", detail: "+ hurt/B2B, marketplace wlasny" },
                    { goal: "Zespol", detail: "Wlasciciel + 2-3 pracownikow" },
                    { goal: "Cel", detail: "Studio 3D z pelna oferta: FDM, SLA, post-processing, projektowanie" },
                  ],
                  milestones: ["Wynajem biura/warsztatu", "Technologia SLA w ofercie", "Stali klienci B2B (10+)", "Przychod >200k PLN/rok"],
                  color: "border-purple-800/30",
                },
              ].map((y, i) => (
                <div key={i} className={`p-4 bg-zinc-900 rounded-lg border ${y.color}`}>
                  <h3 className="text-sm font-bold mb-3">{y.icon} {y.year}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      {y.goals.map((g, j) => (
                        <div key={j} className="flex gap-2 text-xs">
                          <span className="text-muted-foreground w-24 flex-shrink-0">{g.goal}:</span>
                          <span className="font-medium">{g.detail}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs font-medium mb-1.5">Kamienie milowe:</div>
                      {y.milestones.map((m, j) => (
                        <div key={j} className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0" />
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                <h3 className="font-medium text-sm mb-3">Nowe uslugi do rozwazenia</h3>
                <div className="grid md:grid-cols-3 gap-2">
                  {[
                    { service: "Druk SLA / zywiczny", timeline: "Rok 2", investment: "3-5k PLN" },
                    { service: "Skanowanie 3D", timeline: "Rok 2", investment: "2-4k PLN" },
                    { service: "Projektowanie CAD", timeline: "Rok 1-2", investment: "Czas (nauka)" },
                    { service: "Malowanie figurek", timeline: "Rok 1", investment: "500 PLN" },
                    { service: "Kursy / warsztaty druku 3D", timeline: "Rok 2-3", investment: "Czas" },
                    { service: "White-label dla firm", timeline: "Rok 3", investment: "Marketing" },
                  ].map((s, i) => (
                    <div key={i} className="p-2.5 bg-zinc-800 rounded border border-zinc-700">
                      <div className="text-xs font-medium">{s.service}</div>
                      <div className="flex items-center justify-between mt-1">
                        <Badge className="text-xs border-0 bg-zinc-700 text-zinc-300">{s.timeline}</Badge>
                        <span className="text-xs text-muted-foreground">{s.investment}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeSection === "swot" && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />Analiza SWOT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-sm bg-green-500" />
                    <Label className="text-xs font-bold uppercase tracking-wider">Mocne strony (Strengths)</Label>
                  </div>
                  <textarea
                    value={swotStrengths}
                    onChange={e => setSwotStrengths(e.target.value)}
                    className="w-full bg-green-950/30 border border-green-800/30 rounded-lg p-3 text-xs text-zinc-300 resize-y"
                    rows={5}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-sm bg-blue-500" />
                    <Label className="text-xs font-bold uppercase tracking-wider">Szanse (Opportunities)</Label>
                  </div>
                  <textarea
                    value={swotOpportunities}
                    onChange={e => setSwotOpportunities(e.target.value)}
                    className="w-full bg-blue-950/30 border border-blue-800/30 rounded-lg p-3 text-xs text-zinc-300 resize-y"
                    rows={5}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-sm bg-amber-500" />
                    <Label className="text-xs font-bold uppercase tracking-wider">Slabe strony (Weaknesses)</Label>
                  </div>
                  <textarea
                    value={swotWeaknesses}
                    onChange={e => setSwotWeaknesses(e.target.value)}
                    className="w-full bg-amber-950/30 border border-amber-800/30 rounded-lg p-3 text-xs text-zinc-300 resize-y"
                    rows={5}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-sm bg-red-500" />
                    <Label className="text-xs font-bold uppercase tracking-wider">Zagrozenia (Threats)</Label>
                  </div>
                  <textarea
                    value={swotThreats}
                    onChange={e => setSwotThreats(e.target.value)}
                    className="w-full bg-red-950/30 border border-red-800/30 rounded-lg p-3 text-xs text-zinc-300 resize-y"
                    rows={5}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
