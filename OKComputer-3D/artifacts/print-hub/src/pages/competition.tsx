import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Shield, Target, Zap, TrendingUp, Lightbulb, Users, ArrowRight } from "lucide-react";

const COMPETITORS = [
  {
    name: "Laboratorium Druku 3D",
    type: "Drukarnia uslugowa",
    location: "Gliwice",
    tech: ["FDM", "SLA", "SLS"],
    pricePerCm3: "1.30-4.00 PLN",
    pricePerHour: "50-80 PLN",
    turnaround: "2-5 dni",
    minOrder: "40 PLN netto",
    strengths: "Wiele technologii (FDM/SLA/SLS), doswiadczony zespol, prototypy przemyslowe",
    weaknesses: "Wyzsze ceny dla FDM, brak multicolor FDM, minimum zamowieniowe",
  },
  {
    name: "3D Innowacje",
    type: "Studio 3D",
    location: "Warszawa",
    tech: ["FDM", "SLA"],
    pricePerCm3: "1.30-3.00 PLN",
    pricePerHour: "40-70 PLN",
    turnaround: "2-5 dni",
    minOrder: "1 szt.",
    strengths: "Szybka wycena online, projektowanie CAD w ofercie, elastycznosc",
    weaknesses: "Brak SLS/MJF, brak multicolor, standardowa jakosc FDM",
  },
  {
    name: "P3DRC",
    type: "Drukarnia online",
    location: "Online (cala PL)",
    tech: ["FDM", "SLA"],
    pricePerCm3: "1.00-2.50 PLN",
    pricePerHour: "30-55 PLN",
    turnaround: "3-5 dni",
    minOrder: "1 szt.",
    strengths: "Atrakcyjne ceny, dostawa kurierem do calej PL, szybka realizacja",
    weaknesses: "Podstawowa paleta materialow, brak zaawansowanych technologii, brak multicolor",
  },
  {
    name: "Printio",
    type: "Drukarnia online",
    location: "Online (cala PL)",
    tech: ["FDM", "SLA", "MJF"],
    pricePerCm3: "1.50-5.00 PLN",
    pricePerHour: "45-100 PLN",
    turnaround: "3-7 dni",
    minOrder: "1 szt.",
    strengths: "Szeroka oferta technologii, MJF/PA12, kalkulator online",
    weaknesses: "Brak FDM multicolor, ceny za MJF/SLA sa wysokie, dlugi czas dla skomplikowanych",
  },
  {
    name: "GigaPrint",
    type: "Drukarnia uslugowa",
    location: "Online (cala PL)",
    tech: ["FDM", "SLA"],
    pricePerCm3: "1.30-3.50 PLN",
    pricePerHour: "35-60 PLN",
    turnaround: "2-5 dni",
    minOrder: "1 szt.",
    strengths: "Konkurencyjne ceny FDM, szybka realizacja, dostawa InPost/kurier",
    weaknesses: "Mniejsza skala, ograniczone materialy specjalistyczne, brak multicolor",
  },
  {
    name: "ElproDruk3D",
    type: "Studio 3D",
    location: "Lodz",
    tech: ["FDM", "SLA"],
    pricePerCm3: "1.50-4.00 PLN",
    pricePerHour: "40-70 PLN",
    turnaround: "3-7 dni",
    minOrder: "1 szt.",
    strengths: "Dobre relacje z klientami lokalnymi, kompleksowa usluga CAD+druk",
    weaknesses: "Brak multicolor FDM, regionalny zasieg, brak SLS/MJF",
  },
];

const YOUR_PROFILE = {
  name: "Twoja firma (H2D Combo)",
  type: "Indie / Prosumer",
  location: "Lokalna",
  tech: ["FDM", "Multicolor (16 kol.)", "Dual Nozzle", "Dual Material"],
  pricePerCm3: "0.40-0.80 PLN",
  pricePerHour: "20-40 PLN",
  turnaround: "1-3 dni",
  minOrder: "1 szt.",
  strengths: "Multicolor 16 kolorow, dual nozzle, szybki turnaround, personalizacja, niskie koszty",
  weaknesses: "1 drukarka (ograniczona skala), tylko FDM, brak certyfikatow przemyslowych",
};

const PRICING_COMPARISON = [
  { item: "Mala figurka (50g PLA)", fibometry: "40-60 PLN", send3d: "30-50 PLN", innowacje: "35-55 PLN", craft3d: "45-75 PLN", p3drc: "25-40 PLN", you: "15-25 PLN" },
  { item: "Obudowa IoT (100g PETG)", fibometry: "80-120 PLN", send3d: "60-100 PLN", innowacje: "70-110 PLN", craft3d: "90-150 PLN", p3drc: "50-80 PLN", you: "30-50 PLN" },
  { item: "Figurka multicolor (80g, 4 kol.)", fibometry: "N/D", send3d: "N/D", innowacje: "N/D", craft3d: "N/D", p3drc: "N/D", you: "25-45 PLN" },
  { item: "Prototyp techniczny (200g)", fibometry: "200-350 PLN", send3d: "160-280 PLN", innowacje: "180-300 PLN", craft3d: "250-400 PLN", p3drc: "120-200 PLN", you: "60-120 PLN" },
  { item: "Seria 10 elementow", fibometry: "600-1000 PLN", send3d: "500-800 PLN", innowacje: "550-900 PLN", craft3d: "800-1200 PLN", p3drc: "400-650 PLN", you: "250-450 PLN" },
];

const YOUR_ADVANTAGES = [
  { icon: <Zap className="h-4 w-4 text-primary" />, title: "Multicolor bez malowania", desc: "16 kolorow AMS — gotowy produkt prosto z drukarki, zero post-processingu" },
  { icon: <Target className="h-4 w-4 text-blue-400" />, title: "Dual Nozzle", desc: "Dwa niezalezne materialy — support rozpuszczalny, dual material prints" },
  { icon: <Shield className="h-4 w-4 text-green-400" />, title: "Duzy build volume", desc: "300x300x400mm — wieksze wydruki niz konkurencja (typowo 256³)" },
  { icon: <TrendingUp className="h-4 w-4 text-amber-400" />, title: "Szybki turnaround", desc: "1-3 dni vs 5-14 dni u konkurencji. 500mm/s predkosc druku." },
];

const COMPETITIVE_STRATEGIES = [
  {
    strategy: "Specjalizacja w multicolor",
    desc: "Skup sie na produktach wymagajacych wielu kolorow — figurki, zabawki, cosplay. Konkurencja tego nie oferuje.",
    action: "Buduj portfolio multicolor, podkreslaj w ofertach 'gotowe bez malowania'",
    priority: "Wysoki",
  },
  {
    strategy: "Szybkosc realizacji",
    desc: "Oferuj ekspresowa realizacje 24-48h. Dla klientow potrzebujacych szybko to kluczowa wartosc.",
    action: "Promuj 'ekspres 24h' jako usluge premium (+50% do ceny)",
    priority: "Wysoki",
  },
  {
    strategy: "Personalizacja masowa",
    desc: "Oferuj personalizacje (imiona, daty, loga) ktora jest trudna do zautomatyzowania przez duze firmy.",
    action: "Dodaj opcje personalizacji do kazdej oferty na Etsy/Allegro",
    priority: "Sredni",
  },
  {
    strategy: "Nisza lokalna",
    desc: "Obsluguj klientow lokalnych z odbiorem osobistym, bez kosztow wysylki. Buduj relacje.",
    action: "Reklama lokalna, grupy na Facebooku, wspolpraca z firmami lokalnymi",
    priority: "Sredni",
  },
  {
    strategy: "Budowanie marki osobistej",
    desc: "Social media (TikTok, Instagram) — pokaz proces druku, behind-the-scenes, timelapse H2D.",
    action: "Min. 3 posty tygodniowo, buduj spolecznosc wokol druku 3D",
    priority: "Wysoki",
  },
];

const MARKET_SEGMENTS = [
  { segment: "Hobbyisci (figurki RPG, cosplay)", marketSize: "Duzy, rosnacy", competition: "Niska (multicolor)", yourFit: "Idealny", recommendation: "Glowny fokus — najwyzsza marza, lojalnosc" },
  { segment: "Prototypowanie dla firm", marketSize: "Sredni, stabilny", competition: "Wysoka", yourFit: "Dobry", recommendation: "Drugi priorytet — wyzsze zamowienia, stali klienci" },
  { segment: "Dekoracje / prezenty", marketSize: "Duzy, sezonowy", competition: "Srednia", yourFit: "Dobry", recommendation: "Sezonowo — Boze Narodzenie, Walentynki, Halloween" },
  { segment: "Elektronika / IoT", marketSize: "Sredni, rosnacy", competition: "Niska", yourFit: "Dobry", recommendation: "Niszowy ale stabilny — obudowy Raspberry Pi, ESP32" },
  { segment: "Edukacja / szkolnictwo", marketSize: "Maly, rosnacy", competition: "Niska", yourFit: "Sredni", recommendation: "Dlugoterminowo — modele anatomiczne, naukowe" },
];

export default function Competition() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analiza Konkurencji</h1>
        <p className="text-muted-foreground mt-1">Polskie firmy uslugowe druku 3D vs Twoja oferta z H2D Combo</p>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />Twoje przewagi konkurencyjne
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {YOUR_ADVANTAGES.map((adv, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-zinc-900 rounded-lg border border-primary/20">
                {adv.icon}
                <div>
                  <div className="text-sm font-medium">{adv.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{adv.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-primary/40 bg-primary/5">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{YOUR_PROFILE.name}</CardTitle>
              <Badge className="bg-primary text-black text-xs border-0 font-bold">TY</Badge>
            </div>
            <div className="flex gap-1 flex-wrap">
              <Badge className="text-xs border-0 bg-zinc-700 text-zinc-200">{YOUR_PROFILE.type}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div><span className="text-muted-foreground">PLN/cm3: </span><span className="text-primary font-medium">{YOUR_PROFILE.pricePerCm3}</span></div>
              <div><span className="text-muted-foreground">PLN/h: </span><span className="text-primary font-medium">{YOUR_PROFILE.pricePerHour}</span></div>
              <div><span className="text-muted-foreground">Realizacja: </span><span className="text-primary font-medium">{YOUR_PROFILE.turnaround}</span></div>
              <div><span className="text-muted-foreground">Min: </span>{YOUR_PROFILE.minOrder}</div>
            </div>
            <div className="flex gap-1 flex-wrap">
              {YOUR_PROFILE.tech.map(s => <Badge key={s} className="text-xs border-0 bg-primary/20 text-primary">{s}</Badge>)}
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-400 flex-shrink-0 mt-0.5" /><span>{YOUR_PROFILE.strengths}</span></div>
              <div className="flex gap-2"><XCircle className="h-3.5 w-3.5 text-red-400 flex-shrink-0 mt-0.5" /><span>{YOUR_PROFILE.weaknesses}</span></div>
            </div>
          </CardContent>
        </Card>

        {COMPETITORS.map((comp, i) => (
          <Card key={i} className="border-border bg-card hover:border-primary/20 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{comp.name}</CardTitle>
              </div>
              <div className="flex gap-1 flex-wrap">
                <Badge className="text-xs border-0 bg-zinc-700 text-zinc-200">{comp.type}</Badge>
                <Badge className="text-xs border-0 bg-zinc-800 text-zinc-400">{comp.location}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div><span className="text-muted-foreground">PLN/cm3: </span>{comp.pricePerCm3}</div>
                <div><span className="text-muted-foreground">PLN/h: </span>{comp.pricePerHour}</div>
                <div><span className="text-muted-foreground">Realizacja: </span>{comp.turnaround}</div>
                <div><span className="text-muted-foreground">Min: </span>{comp.minOrder}</div>
              </div>
              <div className="flex gap-1 flex-wrap">
                {comp.tech.map(s => <Badge key={s} className="text-xs border-0 bg-zinc-800 text-zinc-300">{s}</Badge>)}
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-400 flex-shrink-0 mt-0.5" /><span>{comp.strengths}</span></div>
                <div className="flex gap-2"><XCircle className="h-3.5 w-3.5 text-red-400 flex-shrink-0 mt-0.5" /><span>{comp.weaknesses}</span></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border bg-card">
        <CardHeader><CardTitle className="text-base">Porownanie cen — przykladowe zamowienia</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="text-left py-2 pr-3">Produkt</th>
                  {COMPETITORS.map(c => <th key={c.name} className="text-center py-2 px-2">{c.name}</th>)}
                  <th className="text-center py-2 px-2 text-primary">TY</th>
                </tr>
              </thead>
              <tbody>
                {PRICING_COMPARISON.map((row, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-2 pr-3 text-xs font-medium">{row.item}</td>
                    <td className="text-center py-2 px-2 text-xs text-muted-foreground">{row.fibometry}</td>
                    <td className="text-center py-2 px-2 text-xs text-muted-foreground">{row.send3d}</td>
                    <td className="text-center py-2 px-2 text-xs text-muted-foreground">{row.innowacje}</td>
                    <td className="text-center py-2 px-2 text-xs text-muted-foreground">{row.craft3d}</td>
                    <td className="text-center py-2 px-2 text-xs text-muted-foreground">{row.p3drc}</td>
                    <td className="text-center py-2 px-2 text-xs font-bold text-primary">{row.you}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">* Figurka multicolor — dostepna TYLKO u Ciebie. Konkurencja nie oferuje wydruków multicolor FDM.</p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />Strategie konkurencyjne
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {COMPETITIVE_STRATEGIES.map((s, i) => (
            <div key={i} className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{s.strategy}</span>
                <Badge className={`text-xs border-0 ${s.priority === "Wysoki" ? "bg-primary/20 text-primary" : "bg-zinc-700 text-zinc-300"}`}>{s.priority}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
              <div className="flex items-start gap-2 mt-2 text-xs">
                <ArrowRight className="h-3.5 w-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-green-400">{s.action}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />Analiza segmentow rynku
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="text-left py-2 pr-3">Segment</th>
                  <th className="text-center py-2 px-2">Rozmiar rynku</th>
                  <th className="text-center py-2 px-2">Konkurencja</th>
                  <th className="text-center py-2 px-2">Dopasowanie</th>
                  <th className="text-left py-2 px-2">Rekomendacja</th>
                </tr>
              </thead>
              <tbody>
                {MARKET_SEGMENTS.map((seg, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-2 pr-3 text-xs font-medium">{seg.segment}</td>
                    <td className="text-center py-2 px-2 text-xs">{seg.marketSize}</td>
                    <td className="text-center py-2 px-2 text-xs">
                      <Badge className={`text-xs border-0 ${seg.competition === "Niska" ? "bg-green-900 text-green-200" : seg.competition === "Srednia" ? "bg-amber-900 text-amber-200" : "bg-red-900 text-red-200"}`}>{seg.competition}</Badge>
                    </td>
                    <td className="text-center py-2 px-2 text-xs">
                      <Badge className={`text-xs border-0 ${seg.yourFit === "Idealny" ? "bg-primary/20 text-primary" : seg.yourFit === "Dobry" ? "bg-green-900 text-green-200" : "bg-zinc-700 text-zinc-300"}`}>{seg.yourFit}</Badge>
                    </td>
                    <td className="text-left py-2 px-2 text-xs text-muted-foreground">{seg.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader><CardTitle className="text-base">Mapa pozycjonowania</CardTitle></CardHeader>
        <CardContent>
          <div className="relative bg-zinc-900 rounded-xl p-6 border border-zinc-700" style={{ height: 300 }}>
            <div className="absolute left-6 top-6 text-xs text-muted-foreground">Wysoka jakosc</div>
            <div className="absolute left-6 bottom-6 text-xs text-muted-foreground">Niska jakosc</div>
            <div className="absolute right-6 bottom-6 text-xs text-muted-foreground">Drogo</div>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-6 text-xs text-muted-foreground">Cena</div>

            <div className="absolute border-t border-zinc-700 w-full left-0" style={{ top: "50%" }} />
            <div className="absolute border-l border-zinc-700 h-full top-0" style={{ left: "50%" }} />

            <div className="absolute flex items-center gap-1" style={{ left: "25%", top: "25%" }}>
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs font-bold text-primary">TY</span>
            </div>
            <div className="absolute flex items-center gap-1" style={{ left: "65%", top: "20%" }}>
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-500" />
              <span className="text-xs text-zinc-400">Fibometry</span>
            </div>
            <div className="absolute flex items-center gap-1" style={{ left: "50%", top: "35%" }}>
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-500" />
              <span className="text-xs text-zinc-400">Send3D</span>
            </div>
            <div className="absolute flex items-center gap-1" style={{ left: "45%", top: "40%" }}>
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-500" />
              <span className="text-xs text-zinc-400">3D-innowacje</span>
            </div>
            <div className="absolute flex items-center gap-1" style={{ left: "70%", top: "30%" }}>
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-500" />
              <span className="text-xs text-zinc-400">Craft3D</span>
            </div>
            <div className="absolute flex items-center gap-1" style={{ left: "30%", top: "55%" }}>
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-500" />
              <span className="text-xs text-zinc-400">P3DRC</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">Twoja pozycja: wysoka jakosc + niska cena = najlepsza wartosc na rynku</p>
        </CardContent>
      </Card>
    </div>
  );
}
