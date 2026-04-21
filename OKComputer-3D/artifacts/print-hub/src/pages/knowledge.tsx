import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, CheckCircle2, AlertTriangle, Thermometer, Layers, Wrench, Search, Briefcase, Printer, ExternalLink, Lightbulb, Clock, Shield } from "lucide-react";

const MATERIAL_PROFILES = [
  { type: "PLA", nozzle: "190-220°C", bed: "50-60°C", speed: "150-300 mm/s", retraction: "0.5-1.0 mm", cooling: "100%", h2dNotes: "Tryb Cooling Mode w H2D. 1. warstwa: +5°C wiecej, predkosc 25-50%. Plyta teksturowana PEI, brak kleju. AMS kompatybilny.", bestFor: "Figurki, dekoracje, prototypy, organizery", pricePerKg: "60-110 PLN", density: "1.24 g/cm3" },
  { type: "PLA Silk", nozzle: "215-230°C", bed: "50-60°C", speed: "100-200 mm/s", retraction: "0.5-1.0 mm", cooling: "100%", h2dNotes: "Drukuj wolniej niz PLA Basic — niezbedne do efektu silk. Tryb Cooling Mode. Swietny na figurki i prezenty.", bestFor: "Figurki premium, wazony, biżuteria, dekoracje", pricePerKg: "85-150 PLN", density: "1.24 g/cm3" },
  { type: "PETG", nozzle: "230-250°C", bed: "70-80°C", speed: "100-150 mm/s", retraction: "1.0-1.5 mm", cooling: "50-70%", h2dNotes: "Tryb Cooling Mode. Stosuj prawy hotend z AMS (oficjalne zalecenie Bambu). Uwaga na stringing — dostrajaj retrakcje.", bestFor: "Obudowy, czesci mechaniczne, elementy outdoor", pricePerKg: "80-140 PLN", density: "1.27 g/cm3" },
  { type: "ABS", nozzle: "240-260°C", bed: "90-110°C", speed: "100-150 mm/s", retraction: "0.5-1.0 mm", cooling: "0-20%", h2dNotes: "Tryb Heating Mode — komora grzana, wentylatory wylaczone. Idealny dla H2D z aktywna komora. Uzyj kleju na stol.", bestFor: "Czesci mechaniczne, obudowy, elementy odporne na temp.", pricePerKg: "60-120 PLN", density: "1.04 g/cm3" },
  { type: "ASA", nozzle: "240-260°C", bed: "90-110°C", speed: "100-150 mm/s", retraction: "0.5-1.0 mm", cooling: "0-20%", h2dNotes: "Tryb Heating Mode. Jak ABS lecz odporny na UV — idealny do czesci outdoor (obudowy kamer, stojaki zewnetrzne).", bestFor: "Elementy outdoor, czesci samochodowe, znaki", pricePerKg: "100-170 PLN", density: "1.07 g/cm3" },
  { type: "TPU 95A", nozzle: "220-230°C", bed: "35-45°C", speed: "30-60 mm/s", retraction: "0-0.5 mm", cooling: "80-100%", h2dNotes: "H2D ma direct drive — obsluguje TPU swietnie. Drukuj bardzo wolno. Minimalna retrakcja (0-0.2 mm) aby unikac zablokowan.", bestFor: "Etui na telefon, uszczelki, amortyzatory, opaski", pricePerKg: "90-170 PLN", density: "1.21 g/cm3" },
  { type: "PA (Nylon)", nozzle: "260-280°C", bed: "80-100°C", speed: "100-200 mm/s", retraction: "1.0-1.5 mm", cooling: "0-30%", h2dNotes: "Tryb Heating Mode. H2D obsługuje do 350°C. Koniecznie suszyc filament 70-80°C przez 4-8h przed drukiem!", bestFor: "Czesci mechaniczne, zawiasy, koła zebate", pricePerKg: "120-250 PLN", density: "1.14 g/cm3" },
  { type: "PC", nozzle: "270-300°C", bed: "100-120°C", speed: "60-150 mm/s", retraction: "0.5-1.0 mm", cooling: "0-10%", h2dNotes: "Tryb Heating Mode. H2D z max 350°C radzi sobie z PC. Aktywna komora kluczowa. Wymagane suszenie filamentu.", bestFor: "Czesci transparentne, wytrzymale protezy, optyka", pricePerKg: "130-280 PLN", density: "1.20 g/cm3" },
];

const TROUBLESHOOTING_H2D = [
  { problem: "Stringing multicolor (AMS)", cause: "Zbyt mala retrakcja przy zmianie kolorow AMS lub za wysoka temperatura", fix: "Zwieksz Wipe Tower Volume w Bambu Studio, zwieksz retrakcje o 0.2 mm lub obniz temperature o 5°C. Przy PETG zacznij od max retrakcji 1.5 mm.", severity: "sredni" },
  { problem: "Purge waste — za duzo odpadu", cause: "Duza liczba zmian kolorow na warstwe lub za maly Wipe Tower", fix: "Optymalizuj model — lacz warstwy jednokolorowe (color-by-layer zamiast color-by-region). Zwieksz Wipe Tower Width w Bambu Studio aby skrocic czas zmiany koloru.", severity: "niski" },
  { problem: "AMS nie podaje filamentu", cause: "Brudne kolo zebate AMS, zagiety koniec filamentu lub za dlugi czas lezkowania szpuli", fix: "Wyczysc kolo zebate AMS szczoteczka, przetnij koniec filamentu prostopadle (5 cm), sprawdz kapilary PTFE pod katem skrecenia. Reloaduj AMS.", severity: "sredni" },
  { problem: "Dual nozzle — blad offsetu XY", cause: "Nieprawidlowa kalibracja XY obu glowic lub rozbieznosc termiczna", fix: "Uruchom: Calibration > XY Offset Calibration w ustawieniach H2D. Wykonaj kalibracje w normalnej temperaturze druku. Sprawdz wynik na dedykowanym modelu testowym.", severity: "wysoki" },
  { problem: "Warping / odklejanie naroznikow", cause: "Zbyt szybkie chlodzenie podstawy lub brudna plyta", fix: "Dla ABS/ASA/PA wlacz Heating Mode komory. Wyczysc plyta PEI alkoholem IPA. Uzyj kleju na plyte (PETG, PA). Dodaj Brim 5-10 mm w slicerze.", severity: "sredni" },
  { problem: "Brak adhezji 1. warstwy", cause: "Zanieczyszczona plyta PEI lub nieprawidlowy Z-offset", fix: "Wyczysc plyte IPA 99%. Uruchom Auto Bed Leveling. Dostrajaj Z-offset w kroku 0.02 mm az 1. warstwa bedzie dobrze przylegac (lekko sprasowana).", severity: "wysoki" },
  { problem: "Rozwarstwianie warstw (layer splitting)", cause: "Zbyt niska temperatura dyszy lub za duza predkosc dla danego materialu", fix: "Zwieksz temperature dyszy o 5-10°C. Zmniejsz predkosc walls o 20%. Przy ABS/PC upewnij sie ze komora jest dobrze nagrzana (Heating Mode aktywny).", severity: "sredni" },
  { problem: "Niedoekstruzja / puste warstwy", cause: "Zatkana dysza (cold plug), slizgajace sie kolo zebate lub wilgotny filament", fix: "Wykonaj Cold Pull: podgrzej do 200°C, oczyszcz ruchem w dol, ostudz do 90°C i wyciagnij. Sprawdz docisk kola zebatego. Wysusz filament jesli problem wraca.", severity: "wysoki" },
  { problem: "Pecherze i trzeszczenie przy druku", cause: "Wilgotny filament (szczegolnie PA, PC, PETG)", fix: "Wysusz filament: PLA 45°C/4h, PETG 60°C/6h, PA/Nylon 70-80°C/8h, PC 80°C/8h. Uzyj suszarki Bambu AMS lub zewnetrznej. Przechowuj szpule w szczelnych pojemnikach z silikaelem.", severity: "sredni" },
  { problem: "Lidar / AI Camera — falszywy alarm", cause: "Lidar wykrywa anomalie ktore moga byc tylko artefaktem pierwszych warstw lub zmiana koloru", fix: "Sprawdz faktyczny stan wydruku przez kamere. Mozna wylaczyc AI w ustawieniach zlecenia druku (niezalecane dla dlugich wydrukow). Upewnij sie ze platforma druku jest czysta i bez zabrudzen.", severity: "niski" },
  { problem: "Clogging / zatkanie dyszy (H2D dual)", cause: "Wypalony filament w dyszy lub drukowanie materialow CF/GF przez standardowa dysze", fix: "Wymien dysze hardened steel dla materialow wzmocnionych (CF, GF). Wykonaj Cold Pull lub wymien dysze (H2D uzywa standardowego zlaczy hotend — wymiana szybka). Oczysc przez czyszczacy filament.", severity: "wysoki" },
  { problem: "Blad kalibracji przed wydrukiem", cause: "Nieczysty sensor lub problem z plyta magnetetyczna", fix: "Wyczysc sensor Lidaru delikatna chusteczka bezwlokiennikowa. Sprawdz czy plyta PEI jest pewnie osadzona na magnetach. Zrestartuj drukarke i ponow kalibracje.", severity: "sredni" },
];

const STARTUP_CHECKLIST_PRINT = [
  "Sprawdz poziom stolu (auto-level H2D)",
  "Wyczysc stol alkoholem izopropylowym",
  "Sprawdz stan filamentu — czy jest suchy?",
  "Sprawdz obie dysze — czy nie sa zatkane?",
  "Wykonaj test ekstruzji przed wlasciwym wydrukiem",
  "Sprawdz profil Bambu Studio — temperatura, predkosc, supports",
  "Zweryfikuj G-code (simulation w slicerze)",
  "Monitoruj pierwsze 2-3 warstwy (Lidar tez monitoruje)",
];

const STARTUP_CHECKLIST_BUSINESS = [
  "Zaloz dzialalnosc gospodarcza (JDG lub spolka)",
  "Rejestracja VAT (obowiazek od 200k PLN rocznie)",
  "Zaloz konto firmowe w banku",
  "Kup ubezpieczenie OC dzialalnosci",
  "Zarejestruj sie w ZUS (preferencyjna skladka 6 mies.)",
  "Wybierz forme opodatkowania (liniowy 19% lub ryczalt 8.5%)",
  "Zaloz konta na platformach: Allegro, Etsy, OLX",
  "Przygotuj portfolio — 5-10 przykladowych wydrukow",
  "Ustaw cennik — uzyj kalkulatora w aplikacji",
  "Zamow pierwszy zapas filamentow (min. 5kg PLA, 2kg PETG)",
  "Przygotuj opakowania — kartony, folia babelkowa, wypelniacz",
  "Podpisz umowe z kurierem (InPost, DPD, DHL)",
];

const H2D_MAINTENANCE = [
  { task: "Czyszczenie stolu (IPA)", frequency: "Przed kazdym drukiem", time: "2 min", difficulty: "Latwe" },
  { task: "Smarowanie osi Z (olej maszynowy)", frequency: "Co 2 tygodnie", time: "5 min", difficulty: "Latwe" },
  { task: "Czyszczenie dysz (cold pull)", frequency: "Co 50h druku", time: "10 min", difficulty: "Srednie" },
  { task: "Kalibracja XY dual nozzle", frequency: "Co 100h druku", time: "15 min", difficulty: "Srednie" },
  { task: "Wymiana dyszy", frequency: "Co 500-1000h druku", time: "20 min", difficulty: "Srednie" },
  { task: "Czyszczenie AMS (kolo zebate)", frequency: "Co miesiąc", time: "15 min", difficulty: "Latwe" },
  { task: "Sprawdzenie paskow GT2", frequency: "Co 3 miesiace", time: "10 min", difficulty: "Latwe" },
  { task: "Wymiana hotend", frequency: "Co 2000h druku", time: "30 min", difficulty: "Zaawansowane" },
  { task: "Smarowanie lozysk liniowych", frequency: "Co 6 miesiecy", time: "20 min", difficulty: "Srednie" },
  { task: "Wymiana prowadnic PTFE AMS", frequency: "Co rok", time: "15 min", difficulty: "Latwe" },
];

const BAMBU_STUDIO_TIPS = [
  { tip: "Profile predkosci", detail: "Uzywaj profilu '0.20mm Standard' do wiekszosci wydruków. '0.08mm Extra Fine' tylko do figurek premium — 3x dluzej." },
  { tip: "Wipe tower optymalizacja", detail: "Zmniejsz wipe tower do minimum (150mm2) dla 2-3 kolorow. Dla 8+ kolorow zwieksz do 300mm2." },
  { tip: "Supports — Paint-on", detail: "Zamiast auto-supports uzyj Paint-on support — precyzyjnie dodajesz supporty tam gdzie potrzebne. Mniej odpadow." },
  { tip: "Adaptive layer height", detail: "Wlacz adaptive layers — cienkie warstwy na krzywiznach, grube na plaskich powierzchniach. Oszczedza 20-30% czasu." },
  { tip: "Ironing (wygladzanie)", detail: "Wlacz ironing na gornych powierzchniach plaskich — dysza przesuwa sie po powierzchni wygladzajac ja. Swietne na litofany." },
  { tip: "Seam position", detail: "Ustaw seam na 'Nearest' lub 'Aligned' — ukrywa szew w jednym miejscu zamiast rozrzucac go losowo." },
  { tip: "Tree supports", detail: "Uzywaj tree supports zamiast normalnych — latwiejsze do usunięcia, mniej odpadow, szybsze drukowanie." },
  { tip: "Multi-plate printing", detail: "Bambu Studio wspiera druk na wielu plytach — przygotuj kilka modeli naraz i drukuj automatycznie." },
];

const USEFUL_RESOURCES = [
  { name: "Bambu Lab Wiki", url: "https://wiki.bambulab.com", desc: "Oficjalna dokumentacja i poradniki Bambu Lab" },
  { name: "Printables.com", url: "https://www.printables.com", desc: "Darmowe modele 3D, konkursy, spolecznosc Prusa" },
  { name: "MakerWorld", url: "https://makerworld.com", desc: "Platforma modeli od Bambu Lab — zoptymalizowane dla AMS" },
  { name: "r/BambuLab (Reddit)", url: "https://www.reddit.com/r/BambuLab", desc: "Spolecznosc uzytkownikow Bambu Lab — porady i rozwiazania" },
  { name: "Teaching Tech (YouTube)", url: "https://www.youtube.com/@TeachingTech", desc: "Kanał z poradnikami kalibracji i optymalizacji druku 3D" },
  { name: "Bambu Studio GitHub", url: "https://github.com/bambulab/BambuStudio", desc: "Najnowsze wersje slicera i changelog" },
];

export default function Knowledge() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"materials" | "troubleshooting" | "checklist-print" | "checklist-business" | "maintenance" | "slicer" | "resources">("materials");

  const filteredMaterials = MATERIAL_PROFILES.filter(m =>
    m.type.toLowerCase().includes(search.toLowerCase()) || m.h2dNotes.toLowerCase().includes(search.toLowerCase()) || m.bestFor.toLowerCase().includes(search.toLowerCase())
  );
  const filteredTroubleshooting = TROUBLESHOOTING_H2D.filter(t =>
    t.problem.toLowerCase().includes(search.toLowerCase()) || t.fix.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Baza Wiedzy H2D</h1>
        <p className="text-muted-foreground mt-1">Profile materialow, rozwiazywanie problemow, konserwacja i poradniki dla Bambu Lab H2D Combo</p>
      </div>

      <div className="flex gap-4 items-center flex-wrap">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Szukaj..." className="pl-9 bg-card border-border" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {[
            { key: "materials", label: "Materialy", icon: <Thermometer className="h-3.5 w-3.5" /> },
            { key: "troubleshooting", label: "Problemy H2D", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
            { key: "maintenance", label: "Konserwacja", icon: <Wrench className="h-3.5 w-3.5" /> },
            { key: "slicer", label: "Bambu Studio", icon: <Lightbulb className="h-3.5 w-3.5" /> },
            { key: "checklist-print", label: "Checklist druku", icon: <Printer className="h-3.5 w-3.5" /> },
            { key: "checklist-business", label: "Start biznesu", icon: <Briefcase className="h-3.5 w-3.5" /> },
            { key: "resources", label: "Zasoby", icon: <BookOpen className="h-3.5 w-3.5" /> },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)} className={`px-3 py-1.5 text-xs rounded-md flex items-center gap-1.5 font-medium transition-colors ${activeTab === tab.key ? "bg-primary text-black" : "bg-card text-muted-foreground border border-border hover:border-primary/30"}`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "materials" && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredMaterials.map(m => (
              <Card key={m.type} className="border-border bg-card hover:border-primary/30 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary text-black border-0 font-bold">{m.type}</Badge>
                    <span className="text-xs text-muted-foreground">{m.pricePerKg}/kg</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1.5 text-xs">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="flex gap-1 items-center"><Thermometer className="h-3 w-3 text-red-400" /><span>Dysza: {m.nozzle}</span></div>
                    <div className="flex gap-1 items-center"><Thermometer className="h-3 w-3 text-amber-400" /><span>Stol: {m.bed}</span></div>
                    <div className="flex gap-1 items-center"><Layers className="h-3 w-3 text-blue-400" /><span>Predkosc: {m.speed}</span></div>
                    <div className="flex gap-1 items-center"><Wrench className="h-3 w-3 text-zinc-400" /><span>Retrakcja: {m.retraction}</span></div>
                  </div>
                  <div className="flex gap-1 items-center"><span>Wentylator: {m.cooling}</span></div>
                  <div className="text-xs text-muted-foreground">Gestosc: {m.density}</div>
                  <div className="mt-2 pt-2 border-t border-border p-2 bg-zinc-900 rounded text-muted-foreground">
                    <span className="text-primary font-medium">H2D: </span>{m.h2dNotes}
                  </div>
                  <div className="p-2 bg-zinc-900 rounded text-muted-foreground">
                    <span className="text-blue-400 font-medium">Najlepszy do: </span>{m.bestFor}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm space-y-1">
                  <p className="font-medium">Wskazowki dotyczace materialow na H2D Combo:</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Zawsze susz filament przed drukiem — szczegolnie PA, PC, PETG. Suszarka 50-70°C przez 4-8h.</li>
                    <li>AMS dziala najlepiej z PLA i PLA Silk. PETG moze powodowac problemy z retrakcja w AMS.</li>
                    <li>Dual nozzle pozwala na 2 rozne materialy — np. PLA + support rozpuszczalny (PVA).</li>
                    <li>Przy multicolor zacznij od 2-3 kolorow, potem zwieksz do 8-16 gdy opanujesz ustawienia.</li>
                    <li>Kupuj filament w partiach 5-10kg — nizsze ceny hurtowe i zapas na duze zamowienia.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "troubleshooting" && (
        <div className="space-y-2">
          {filteredTroubleshooting.map((t, i) => (
            <Card key={i} className="border-border bg-card hover:border-amber-700/40 transition-colors">
              <CardContent className="py-3 px-4 flex gap-4">
                <AlertTriangle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${t.severity === "wysoki" ? "text-red-400" : t.severity === "sredni" ? "text-amber-400" : "text-yellow-400"}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{t.problem}</span>
                    <Badge className={`text-xs border-0 ${t.severity === "wysoki" ? "bg-red-900 text-red-200" : t.severity === "sredni" ? "bg-amber-900 text-amber-200" : "bg-yellow-900 text-yellow-200"}`}>{t.severity}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">Przyczyna: {t.cause}</div>
                  <div className="text-xs text-green-400 mt-1 flex gap-1.5 items-start">
                    <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                    <span>{t.fix}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm space-y-1">
                  <p className="font-medium">Zapobieganie problemom — dobre praktyki:</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Wykonuj cold pull co 50h druku — zapobiega zatkaniu dyszy</li>
                    <li>Czysc stol alkoholem IPA przed kazdym drukiem</li>
                    <li>Monitoruj pierwsze 3 warstwy — wiekszosc problemow pojawia sie na poczatku</li>
                    <li>Aktualizuj firmware H2D regularnie — Bambu Lab poprawia bledy i dodaje funkcje</li>
                    <li>Trzymaj zapas dysz i prowadnic PTFE — wymiana trwa 15 min</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "maintenance" && (
        <div className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Wrench className="h-5 w-5 text-primary" />
                Harmonogram konserwacji H2D Combo
              </CardTitle>
              <p className="text-xs text-muted-foreground">Regularna konserwacja wydluza zywotnosc drukarki i zapewnia stala jakosc wydrukow</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {H2D_MAINTENANCE.map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-primary/20 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">{m.task}</span>
                      <Badge className={`text-xs border-0 ${m.difficulty === "Latwe" ? "bg-green-900 text-green-200" : m.difficulty === "Srednie" ? "bg-amber-900 text-amber-200" : "bg-red-900 text-red-200"}`}>{m.difficulty}</Badge>
                    </div>
                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{m.time}</span>
                      <span>Co: {m.frequency}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm space-y-1">
                  <p className="font-medium">Czesci zamienne — co trzymac w zapasie:</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Dysze 0.4mm (2-3 szt.) — wymiana co 500-1000h, koszt ~30 PLN/szt.</li>
                    <li>Prowadnice PTFE do AMS (2 szt.) — zuzycie zalezy od ilosci zmian kolorow</li>
                    <li>Pasek GT2 (1 szt.) — na wypadek pekniecia, koszt ~20 PLN</li>
                    <li>PEI plate zapasowa — uszkodzenie stolu zdarza sie, koszt ~80-120 PLN</li>
                    <li>Hotend assembly — do szybkiej wymiany w razie awarii, koszt ~150-200 PLN</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "slicer" && (
        <div className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="h-5 w-5 text-primary" />
                Porady Bambu Studio
              </CardTitle>
              <p className="text-xs text-muted-foreground">Praktyczne wskazowki do slicera dedykowanego drukarka H2D Combo</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {BAMBU_STUDIO_TIPS.map((t, i) => (
                <div key={i} className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">{t.tip}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 ml-6">{t.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Layers className="h-5 w-5 text-primary" />
                Optymalne ustawienia warstw
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground">
                      <th className="text-left py-2">Zastosowanie</th>
                      <th className="text-center py-2">Warstwa</th>
                      <th className="text-center py-2">Predkosc</th>
                      <th className="text-center py-2">Czas (figurka 50g)</th>
                      <th className="text-center py-2">Jakosc</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { use: "Prototyp / test", layer: "0.28mm", speed: "500 mm/s", time: "~45 min", quality: "Niska" },
                      { use: "Standard", layer: "0.20mm", speed: "300 mm/s", time: "~1.5h", quality: "Dobra" },
                      { use: "Detale / figurki", layer: "0.12mm", speed: "200 mm/s", time: "~3h", quality: "Wysoka" },
                      { use: "Premium / miniaturki", layer: "0.08mm", speed: "150 mm/s", time: "~5h", quality: "Najwyzsza" },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-2 text-xs font-medium">{row.use}</td>
                        <td className="text-center py-2 text-xs">{row.layer}</td>
                        <td className="text-center py-2 text-xs">{row.speed}</td>
                        <td className="text-center py-2 text-xs">{row.time}</td>
                        <td className="text-center py-2 text-xs">
                          <Badge className={`text-xs border-0 ${row.quality === "Najwyzsza" ? "bg-purple-900 text-purple-200" : row.quality === "Wysoka" ? "bg-green-900 text-green-200" : row.quality === "Dobra" ? "bg-blue-900 text-blue-200" : "bg-zinc-700 text-zinc-300"}`}>{row.quality}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "checklist-print" && (
        <Card className="border-border bg-card max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Printer className="h-5 w-5 text-primary" />
              Lista kontrolna przed drukiem H2D
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {STARTUP_CHECKLIST_PRINT.map((item, i) => (
              <ChecklistItem key={i} label={item} />
            ))}
          </CardContent>
        </Card>
      )}

      {activeTab === "checklist-business" && (
        <Card className="border-border bg-card max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Briefcase className="h-5 w-5 text-primary" />
              Jak zaczac biznes druku 3D — checklist
            </CardTitle>
            <p className="text-xs text-muted-foreground">Kompletna lista krokow do uruchomienia dzialalnosci w druku 3D w Polsce</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {STARTUP_CHECKLIST_BUSINESS.map((item, i) => (
              <ChecklistItem key={i} label={item} />
            ))}
          </CardContent>
        </Card>
      )}

      {activeTab === "resources" && (
        <div className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-5 w-5 text-primary" />
                Przydatne zasoby
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {USEFUL_RESOURCES.map((r, i) => (
                <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-primary/30 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{r.name}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                  </div>
                </a>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="h-5 w-5 text-primary" />
                Polecane kanaly YouTube
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { name: "Made with Layers", desc: "Recenzje drukarek, testy filamentow, porownania", url: "https://www.youtube.com/@MadeWithLayers" },
                { name: "3D Printing Nerd", desc: "Projekty, timelapse, inspiracje druku 3D", url: "https://www.youtube.com/@3DPrintingNerd" },
                { name: "CNC Kitchen", desc: "Testy wytrzymalosci materialow, analiza naukowa", url: "https://www.youtube.com/@CNCKitchen" },
                { name: "Bambu Lab Official", desc: "Oficjalne poradniki i aktualizacje firmware", url: "https://www.youtube.com/@BambuLab" },
              ].map((ch, i) => (
                <a key={i} href={ch.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-primary/30 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{ch.name}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{ch.desc}</p>
                  </div>
                </a>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function ChecklistItem({ label }: { label: string }) {
  const [checked, setChecked] = useState(false);
  return (
    <div
      onClick={() => setChecked(!checked)}
      className={`flex items-start gap-3 p-2 rounded-md transition-colors cursor-pointer group ${checked ? "bg-green-900/20" : "hover:bg-zinc-800/50"}`}
    >
      <div className={`w-5 h-5 rounded border flex-shrink-0 mt-0.5 transition-colors flex items-center justify-center ${checked ? "bg-green-600 border-green-600" : "border-border group-hover:border-primary/50"}`}>
        {checked && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
      </div>
      <span className={`text-sm ${checked ? "line-through text-muted-foreground" : ""}`}>{label}</span>
    </div>
  );
}
