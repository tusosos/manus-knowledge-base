import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Settings, CheckCircle2, Wrench, Plus, Cpu, Thermometer, Box, Layers, Zap, Gauge } from "lucide-react";

const PRINTER_SPECS = {
  name: "Bambu Lab H2D Combo",
  type: "FDM + Dual AMS (16 kolorow)",
  buildVolume: "300 x 300 x 400 mm",
  nozzleLeft: "0.4mm (utwardzona stal)",
  nozzleRight: "0.4mm (utwardzona stal)",
  maxNozzleTemp: "350°C",
  maxBedTemp: "120°C",
  maxSpeed: "500 mm/s",
  acceleration: "20 000 mm/s²",
  resolution: "0.05mm - 0.35mm",
  filaments: "PLA, PETG, ABS, ASA, TPU, PA, PC, PVA, CF/GF",
  connectivity: "WiFi, USB, LAN, Bambu Cloud",
  amsSlots: "2x AMS = 16 slotow",
  dualNozzle: "Tak — dual independent toolhead",
  chamber: "Aktywne grzanie komory",
  lidar: "Lidar + AI do monitoringu",
  price: "~15 000 PLN",
};

const MATERIAL_PROFILES = [
  { material: "PLA", nozzle: "200-220°C", bed: "55-65°C", speed: "300-500 mm/s", fan: "100%", notes: "Najlatwiejszy, idealny na figurki i prototypy" },
  { material: "PLA Silk", nozzle: "210-225°C", bed: "55-65°C", speed: "200-350 mm/s", fan: "100%", notes: "Wolniej niz PLA, polysklwy efekt premium" },
  { material: "PETG", nozzle: "230-250°C", bed: "70-85°C", speed: "200-400 mm/s", fan: "50-70%", notes: "Wytrzymaly, odporny na UV i chemikalia" },
  { material: "ABS", nozzle: "240-260°C", bed: "95-110°C", speed: "200-400 mm/s", fan: "0-30%", notes: "Wymaga komory, mocny, obrobka acetonem" },
  { material: "ASA", nozzle: "240-260°C", bed: "95-110°C", speed: "200-350 mm/s", fan: "0-30%", notes: "Jak ABS ale odporny na UV, outdoor" },
  { material: "TPU", nozzle: "220-240°C", bed: "50-60°C", speed: "50-150 mm/s", fan: "50-100%", notes: "Elastyczny, direct drive wymagany" },
  { material: "PA (Nylon)", nozzle: "260-290°C", bed: "80-100°C", speed: "150-300 mm/s", fan: "0-30%", notes: "Bardzo wytrzymaly, wchcania wilgoc" },
  { material: "PC", nozzle: "270-310°C", bed: "100-120°C", speed: "100-250 mm/s", fan: "0-20%", notes: "Przezroczysty, odporny termicznie, trudny" },
];

const MAINTENANCE_LOG = [
  { date: "2025-03-15", type: "Kalibracja", notes: "Pelna kalibracja obu glowic po wymianie dysz", status: "OK" },
  { date: "2025-03-01", type: "Czyszczenie AMS", notes: "Wyczyszczono oba AMS, sprawdzono podawanie", status: "OK" },
  { date: "2025-02-28", type: "Wymiana dyszy", notes: "Wymieniono dysze 0.4mm na obu glowicach", status: "OK" },
  { date: "2025-02-10", type: "Czyszczenie", notes: "Wyczyszczono prowadnice XY i stozek drukowy", status: "OK" },
  { date: "2025-01-20", type: "Serwis", notes: "Wymiana paska Y axis, naprezenie 2.5kg", status: "OK" },
  { date: "2025-01-05", type: "Firmware", notes: "Aktualizacja firmware v1.8.2", status: "OK" },
];

type LogEntry = { date: string; type: string; notes: string; status: string };

export default function Printer() {
  const [log, setLog] = useState<LogEntry[]>(MAINTENANCE_LOG);
  const [newEntry, setNewEntry] = useState<LogEntry>({ date: new Date().toISOString().substring(0, 10), type: "", notes: "", status: "OK" });
  const [showForm, setShowForm] = useState(false);
  const [calibNotes, setCalibNotes] = useState("Lewa glowica: Z-offset -0.02mm\nPrawa glowica: Z-offset +0.01mm\nOstatnia kalibracja XY: 1.03.2025\nBed mesh: 5x5, max odchylenie 0.03mm");

  function addEntry() {
    if (!newEntry.type) return;
    setLog(prev => [{ ...newEntry }, ...prev]);
    setNewEntry({ date: new Date().toISOString().substring(0, 10), type: "", notes: "", status: "OK" });
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profil Drukarki H2D</h1>
          <p className="text-muted-foreground mt-1">Bambu Lab H2D Combo — specyfikacja, profile materialow, konserwacja</p>
        </div>
        <Badge className="bg-green-900 text-green-200 border-0 text-sm px-3 py-1">
          <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />Sprawna
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-primary/20 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              {PRINTER_SPECS.name}
            </CardTitle>
            <Badge className="w-fit text-xs border-0 bg-amber-900 text-amber-200">{PRINTER_SPECS.type}</Badge>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[
              ["Pole robocze", PRINTER_SPECS.buildVolume],
              ["Dysza lewa", PRINTER_SPECS.nozzleLeft],
              ["Dysza prawa", PRINTER_SPECS.nozzleRight],
              ["Maks. temp. dyszy", PRINTER_SPECS.maxNozzleTemp],
              ["Maks. temp. stolu", PRINTER_SPECS.maxBedTemp],
              ["Maks. predkosc", PRINTER_SPECS.maxSpeed],
              ["Przyspieszenie", PRINTER_SPECS.acceleration],
              ["Rozdzielczosc", PRINTER_SPECS.resolution],
              ["Dual Nozzle", PRINTER_SPECS.dualNozzle],
              ["Sloty AMS", PRINTER_SPECS.amsSlots],
              ["Komora grzewcza", PRINTER_SPECS.chamber],
              ["Monitoring", PRINTER_SPECS.lidar],
              ["Lacznosc", PRINTER_SPECS.connectivity],
              ["Cena rynkowa", PRINTER_SPECS.price],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium text-right">{v}</span>
              </div>
            ))}
            <Separator className="bg-border my-2" />
            <div>
              <span className="text-muted-foreground text-xs">Obslugiwane materialy:</span>
              <div className="flex gap-1 flex-wrap mt-1">
                {PRINTER_SPECS.filaments.split(", ").map(f => (
                  <Badge key={f} className="text-xs border-0 bg-zinc-800 text-zinc-300">{f}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Cpu className="h-4 w-4 text-primary" />Kluczowe cechy H2D
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: <Thermometer className="h-4 w-4 text-red-400" />, label: "350°C", desc: "Max temp dyszy" },
                  { icon: <Box className="h-4 w-4 text-blue-400" />, label: "36L", desc: "Objetosc robocza" },
                  { icon: <Layers className="h-4 w-4 text-green-400" />, label: "16 kol.", desc: "Dual AMS" },
                  { icon: <Gauge className="h-4 w-4 text-primary" />, label: "500mm/s", desc: "Max predkosc" },
                  { icon: <Zap className="h-4 w-4 text-amber-400" />, label: "~200W", desc: "Pobor mocy" },
                  { icon: <Settings className="h-4 w-4 text-purple-400" />, label: "2 dysze", desc: "Niezalezne" },
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-zinc-900 rounded-lg border border-zinc-800">
                    {feat.icon}
                    <div>
                      <div className="text-xs font-bold">{feat.label}</div>
                      <div className="text-xs text-muted-foreground">{feat.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Notatki kalibracyjne</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={calibNotes}
                onChange={e => setCalibNotes(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-xs font-mono text-zinc-300 resize-y min-h-[100px]"
                rows={5}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-primary" />Profile materialow — domyslne parametry H2D
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="text-left py-2 pr-3">Material</th>
                  <th className="text-center py-2 px-3">Dysza</th>
                  <th className="text-center py-2 px-3">Stol</th>
                  <th className="text-center py-2 px-3">Predkosc</th>
                  <th className="text-center py-2 px-3">Wentylator</th>
                  <th className="text-left py-2 pl-3">Uwagi</th>
                </tr>
              </thead>
              <tbody>
                {MATERIAL_PROFILES.map((p, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-zinc-900/50">
                    <td className="py-2 pr-3">
                      <Badge className="text-xs border-0 bg-zinc-800 text-zinc-200">{p.material}</Badge>
                    </td>
                    <td className="text-center py-2 px-3 text-xs font-mono">{p.nozzle}</td>
                    <td className="text-center py-2 px-3 text-xs font-mono">{p.bed}</td>
                    <td className="text-center py-2 px-3 text-xs font-mono">{p.speed}</td>
                    <td className="text-center py-2 px-3 text-xs font-mono">{p.fan}</td>
                    <td className="text-left py-2 pl-3 text-xs text-muted-foreground">{p.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Wrench className="h-5 w-5 text-primary" />Dziennik Konserwacji
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)} className="border-border text-xs">
              <Plus className="h-3 w-3 mr-1" />Dodaj wpis
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {showForm && (
            <div className="p-3 bg-background rounded-lg border border-border space-y-2 mb-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Data</Label>
                  <Input type="date" value={newEntry.date} onChange={e => setNewEntry(prev => ({ ...prev, date: e.target.value }))} className="bg-card border-border text-xs h-8 mt-0.5" />
                </div>
                <div>
                  <Label className="text-xs">Typ</Label>
                  <Input value={newEntry.type} onChange={e => setNewEntry(prev => ({ ...prev, type: e.target.value }))} placeholder="np. Kalibracja" className="bg-card border-border text-xs h-8 mt-0.5" />
                </div>
              </div>
              <div>
                <Label className="text-xs">Notatki</Label>
                <Input value={newEntry.notes} onChange={e => setNewEntry(prev => ({ ...prev, notes: e.target.value }))} className="bg-card border-border text-xs h-8 mt-0.5" />
              </div>
              <Button size="sm" onClick={addEntry} className="bg-primary text-black hover:bg-primary/90 text-xs">Zapisz</Button>
            </div>
          )}
          {log.map((entry, i) => (
            <div key={i} className="flex items-start gap-3 border-b border-border/50 pb-3 last:border-0 last:pb-0">
              <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{entry.type}</span>
                  <span className="text-xs text-muted-foreground">{entry.date}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{entry.notes}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
