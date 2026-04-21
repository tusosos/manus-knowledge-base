import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TrendingDown, TrendingUp, ExternalLink, AlertTriangle, ShoppingCart, RefreshCw, Loader2, Trophy, LineChart as LineChartIcon } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";

type RemoteDeal = {
  brand: string;
  material: string;
  color: string;
  colorHex: string;
  salePrice: number;
  originalPrice: number | null;
  discount: number | null;
  pricePerKg: number;
  weightKg: number;
  platform: string;
  platformUrl: string;
  rating: number | null;
  inStock: boolean;
  minQty: number;
};

type BestPerMaterial = {
  brand: string;
  material: string;
  pricePerKg: number;
  platform: string;
  platformUrl: string;
};

type FilamentPricesPayload = {
  updatedAt: string;
  source: "live" | "fallback" | "cache";
  deals: RemoteDeal[];
  bestPerMaterial?: BestPerMaterial[];
};

async function fetchFilamentPrices(force: boolean): Promise<FilamentPricesPayload> {
  const res = await fetch(`/api/filament-prices${force ? "?force=1" : ""}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as FilamentPricesPayload;
}

type HistoryPoint = { date: string; pricePerKg: number };
type HistorySeries = {
  brand: string;
  material: string;
  platform: string;
  points: HistoryPoint[];
  min: number;
  max: number;
  avg: number;
  latest: number;
  isHistoricalMin: boolean;
  trendPct: number | null;
};
type HistoryPayload = { generatedAt: string; days: number; series: HistorySeries[] };

async function fetchFilamentPriceHistory(): Promise<HistoryPayload> {
  const res = await fetch(`/api/filament-prices/history?days=30`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as HistoryPayload;
}

function Sparkline({ points, min, max, onClick }: { points: HistoryPoint[]; min: number; max: number; onClick?: (e: React.MouseEvent) => void }) {
  if (points.length < 2) {
    return <div className="text-[10px] text-muted-foreground italic">Brak historii (zbieramy dane)</div>;
  }
  const w = 100;
  const h = 24;
  const pad = 2;
  const range = Math.max(max - min, 0.01);
  const step = (w - pad * 2) / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = pad + i * step;
    const y = pad + (h - pad * 2) * (1 - (p.pricePerKg - min) / range);
    return [x, y] as const;
  });
  const path = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const last = coords[coords.length - 1];
  const first = points[0].pricePerKg;
  const latest = points[points.length - 1].pricePerKg;
  const trendDown = latest <= first;
  const stroke = trendDown ? "#34d399" : "#f87171";
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={`w-full h-6 ${onClick ? "cursor-pointer hover:opacity-80" : ""}`}
      preserveAspectRatio="none"
      onClick={onClick}
    >
      <path d={path} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="1.6" fill={stroke} />
    </svg>
  );
}

const SERIES_COLORS = ["#34d399", "#60a5fa", "#fbbf24", "#f87171", "#a78bfa", "#f472b6", "#fb923c", "#22d3ee"];

function formatDateShort(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}.${m}`;
}

type HistoryModalProps = {
  open: boolean;
  onClose: () => void;
  brand: string;
  material: string;
  series: HistorySeries[];
};

function HistoryModal({ open, onClose, brand, material, series }: HistoryModalProps) {
  const { chartData, lines, globalMin, globalMax, globalMinDate, globalMaxDate } = React.useMemo(() => {
    const dateSet = new Set<string>();
    for (const s of series) for (const p of s.points) dateSet.add(p.date);
    const dates = Array.from(dateSet).sort();
    const chartData = dates.map((date) => {
      const row: Record<string, string | number | null> = { date };
      for (const s of series) {
        const found = s.points.find((p) => p.date === date);
        row[s.platform] = found ? found.pricePerKg : null;
      }
      return row;
    });
    const lines = series
      .filter((s) => s.points.length > 0)
      .map((s, i) => ({ platform: s.platform, color: SERIES_COLORS[i % SERIES_COLORS.length] }));
    let globalMin = Infinity;
    let globalMax = -Infinity;
    let globalMinDate = "";
    let globalMaxDate = "";
    for (const s of series) {
      for (const p of s.points) {
        if (p.pricePerKg < globalMin) {
          globalMin = p.pricePerKg;
          globalMinDate = p.date;
        }
        if (p.pricePerKg > globalMax) {
          globalMax = p.pricePerKg;
          globalMaxDate = p.date;
        }
      }
    }
    if (!Number.isFinite(globalMin)) {
      globalMin = 0;
      globalMax = 0;
    }
    return { chartData, lines, globalMin, globalMax, globalMinDate, globalMaxDate };
  }, [series]);

  const hasData = chartData.length > 0 && lines.length > 0;
  const yPad = Math.max((globalMax - globalMin) * 0.1, 1);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl bg-zinc-950 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LineChartIcon className="h-4 w-4 text-primary" />
            {brand} <span className="text-muted-foreground">·</span> {material}
          </DialogTitle>
          <DialogDescription>
            Historia cen z ostatnich 30 dni — porownanie sklepow (PLN/kg). Najedz na linie aby zobaczyc dokladna cene.
          </DialogDescription>
        </DialogHeader>

        {!hasData ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Brak danych historycznych dla tego filamentu (zbieramy dane).
          </div>
        ) : (
          <>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
                  <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDateShort}
                    stroke="#71717a"
                    fontSize={11}
                    minTickGap={20}
                  />
                  <YAxis
                    stroke="#71717a"
                    fontSize={11}
                    domain={[Math.max(0, globalMin - yPad), globalMax + yPad]}
                    tickFormatter={(v) => `${Number(v).toFixed(0)}`}
                    width={48}
                    label={{ value: "PLN/kg", angle: -90, position: "insideLeft", fill: "#71717a", fontSize: 11 }}
                  />
                  <RTooltip
                    contentStyle={{ background: "#0a0a0a", border: "1px solid #3f3f46", borderRadius: 6, fontSize: 12 }}
                    labelFormatter={(label) => `Dzien: ${formatDateShort(String(label))}`}
                    formatter={(value: number | string, name: string) => [
                      value == null ? "—" : `${Number(value).toFixed(2)} PLN/kg`,
                      name,
                    ]}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <ReferenceLine
                    y={globalMin}
                    stroke="#34d399"
                    strokeDasharray="4 4"
                    label={{ value: `min ${globalMin.toFixed(2)} (${formatDateShort(globalMinDate)})`, position: "insideBottomRight", fill: "#34d399", fontSize: 10 }}
                  />
                  <ReferenceLine
                    y={globalMax}
                    stroke="#f87171"
                    strokeDasharray="4 4"
                    label={{ value: `max ${globalMax.toFixed(2)} (${formatDateShort(globalMaxDate)})`, position: "insideTopRight", fill: "#f87171", fontSize: 10 }}
                  />
                  {lines.map((l) => (
                    <Line
                      key={l.platform}
                      type="monotone"
                      dataKey={l.platform}
                      stroke={l.color}
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      activeDot={{ r: 4 }}
                      connectNulls
                      isAnimationActive={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              {series.map((s, i) => (
                <div key={s.platform} className="p-2 rounded-md bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: SERIES_COLORS[i % SERIES_COLORS.length] }} />
                    {s.platform}
                  </div>
                  <div className="text-muted-foreground mt-1 leading-tight">
                    aktualna: <span className="text-zinc-200">{s.latest.toFixed(2)}</span> PLN/kg<br />
                    min/max: {s.min.toFixed(2)} / {s.max.toFixed(2)}<br />
                    srednia: {s.avg.toFixed(2)}
                    {s.trendPct != null && (
                      <> • trend: <span className={s.trendPct <= 0 ? "text-emerald-400" : "text-red-400"}>{s.trendPct > 0 ? "+" : ""}{s.trendPct.toFixed(1)}%</span></>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function formatUpdatedAt(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("pl-PL", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return iso;
  }
}

const REFERENCE_PRICES: { material: string; minPrice: number; avgPrice: number; maxPrice: number; unit: string }[] = [
  { material: "PLA", minPrice: 60, avgPrice: 75, maxPrice: 110, unit: "PLN/kg" },
  { material: "PLA Silk", minPrice: 85, avgPrice: 105, maxPrice: 150, unit: "PLN/kg" },
  { material: "PETG", minPrice: 80, avgPrice: 100, maxPrice: 140, unit: "PLN/kg" },
  { material: "ABS", minPrice: 60, avgPrice: 80, maxPrice: 120, unit: "PLN/kg" },
  { material: "ASA", minPrice: 100, avgPrice: 130, maxPrice: 170, unit: "PLN/kg" },
  { material: "TPU", minPrice: 90, avgPrice: 130, maxPrice: 170, unit: "PLN/kg" },
  { material: "PA (Nylon)", minPrice: 120, avgPrice: 170, maxPrice: 250, unit: "PLN/kg" },
  { material: "PC", minPrice: 130, avgPrice: 180, maxPrice: 280, unit: "PLN/kg" },
  { material: "PVA (support)", minPrice: 180, avgPrice: 250, maxPrice: 380, unit: "PLN/kg" },
];

const SHOPS_PL = [
  { name: "Allegro.pl", url: "https://allegro.pl/kategoria/filamenty-do-drukarek-3d-257290", desc: "Najwieksza platforma marketplace w Polsce — setki ofert PLA/PETG/ABS, ceny od ok. 55 PLN/kg, czeste promocje Devil Design, Bambu, Creality", type: "Marketplace" },
  { name: "Szpulomat.pl", url: "https://szpulomat.pl/", desc: "Polska porownywarka cen filamentow — agreguje oferty z 20+ sklepow, sortuje po cenie/kg, najszybszy sposob na znalezienie najtanszej szpuli", type: "Porownywarka" },
  { name: "Fiber3D.pl (w-promocji)", url: "https://fiber3d.pl/pl/c/W-promocji/162", desc: "Polski sklep z dedykowana sekcja promocji — co tydzien nowe okazje, czesto Spectrum, Devil Design, Fiberlogy konczowki serii", type: "Sklep online" },
  { name: "Botland.pl", url: "https://botland.com.pl/138-filamenty", desc: "Sklep z elektronika i akcesoriami do druku 3D; dobry wybor eSun, Gembird, Bambu Lab; szybka dostawa", type: "Sklep online" },
  { name: "Get3D.pl", url: "https://get3d.pl/Filamenty", desc: "Specjalistyczny sklep — premium marki: Bambu Lab, Polymaker, Prusament; filamenty techniczne i inzynieryjne", type: "Specjalistyczny" },
  { name: "Drukmistrz.pl", url: "https://drukmistrz.pl/235-filamenty-do-drukarek-3d", desc: "Polski sklep z szerokim wyborem PLA, PETG, ABS, TPU, ASA — wlasne marki i importowane", type: "Sklep online" },
  { name: "Rosa3D.pl", url: "https://rosa3d.pl/", desc: "Polski producent — PLA Basic, PETG, TPU; ceny od ok. 65 PLN/kg; dobre opinie wsrod drukujacych", type: "Producent PL" },
  { name: "Fiberlogy.com", url: "https://fiberlogy.com/pl/sklep/", desc: "Polski producent premium — PETG HD, Easy PLA, PA; precyzja +/- 0.02 mm; polecany profesjonalistom", type: "Producent PL" },
  { name: "Devil Design", url: "https://devildesign.com/", desc: "Polski producent budzetowy — szeroka paleta kolorow PLA/PETG/SILK, PLA od ok. 65 PLN, SILK od 69,90 PLN", type: "Producent PL" },
  { name: "Spectrum Filaments", url: "https://spectrumfilaments.com/pl/", desc: "Polski producent — PLA/PETG/ASA/ABS, szeroka paleta, wysoka powtarzalnosc wymiarow, eksport do EU", type: "Producent PL" },
  { name: "Prusament.com", url: "https://prusament.com/pl/", desc: "Czeski producent premium (Prusa Research) — PLA, PETG, ASA; tolerancja +/- 0.02 mm; dostepny w PL", type: "Producent EU" },
];

const SHOPS_INTL = [
  { name: "3DJake.pl", url: "https://www.3djake.pl/filamenty", desc: "Europejski specjalistyczny sklep z filamentami — duzy wybor marek EU i swiatowych, wysylka z Niemiec", type: "EU" },
  { name: "Amazon.de", url: "https://www.amazon.de/s?k=3d+printer+filament", desc: "Szybka dostawa do PL (1-3 dni), duzy wybor Polymaker, Bambu Lab, eSun; ceny porownywalne z PL", type: "EU" },
  { name: "AliExpress", url: "https://pl.aliexpress.com/category/200002282/3d-printer-filament.html", desc: "Najtansze filamenty (eSun, Kingroon, Sunlu) — PLA od ok. 45 PLN/kg; dostawa 2-4 tyg., ryzyko cla", type: "Chiny" },
  { name: "Bambu Lab Store", url: "https://eu.store.bambulab.com/collections/bambu-lab-3d-printer-filament", desc: "Oficjalny sklep Bambu Lab — PLA Basic ok. 89 PLN, PLA Silk ~99 PLN, PETG ~119 PLN, TPU 95A ~169 PLN/kg", type: "Producent" },
];

const PRICE_ALERTS = [
  { material: "PLA standard", threshold: 70, unit: "PLN/kg", tip: "Kup gdy PLA standard (Devil Design, Spectrum, Rosa3D) < 70 PLN/kg — typowo 76-82 PLN" },
  { material: "PLA Silk", threshold: 75, unit: "PLN/kg", tip: "Kup gdy PLA Silk < 75 PLN/kg — Devil Design SILK obecnie 69,90 PLN to obecne minimum rynkowe" },
  { material: "Bambu PLA Basic", threshold: 60, unit: "PLN/kg", tip: "Kup gdy Bambu/Creality PLA < 60 PLN/kg na Allegro — okresowo do 55 PLN, swietna jakosc + AMS-ready" },
  { material: "PETG", threshold: 85, unit: "PLN/kg", tip: "Kup gdy PETG < 85 PLN/kg — ponizej typowej ceny rynkowej (ok. 100 PLN)" },
  { material: "ABS", threshold: 65, unit: "PLN/kg", tip: "Kup gdy ABS < 65 PLN/kg — rzadko w tej cenie, typowo 75-90 PLN" },
  { material: "TPU", threshold: 100, unit: "PLN/kg", tip: "Kup gdy TPU < 100 PLN/kg — normalnie 120-170 PLN/kg" },
  { material: "ASA", threshold: 110, unit: "PLN/kg", tip: "Kup gdy ASA < 110 PLN/kg — typowo 130-150 PLN, idealny na outdoor" },
];

export default function FilamentDeals() {
  const [tab, setTab] = useState<"deals" | "prices" | "shops">("deals");
  const queryClient = useQueryClient();
  const pricesQuery = useQuery({
    queryKey: ["filament-prices"],
    queryFn: () => fetchFilamentPrices(false),
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const historyQuery = useQuery({
    queryKey: ["filament-prices-history"],
    queryFn: fetchFilamentPriceHistory,
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const historyMap = React.useMemo(() => {
    const m = new Map<string, HistorySeries>();
    for (const s of historyQuery.data?.series ?? []) {
      m.set(`${s.brand}::${s.material}::${s.platform}`, s);
    }
    return m;
  }, [historyQuery.data]);
  const historyByPair = React.useMemo(() => {
    const m = new Map<string, HistorySeries[]>();
    for (const s of historyQuery.data?.series ?? []) {
      const key = `${s.brand}::${s.material}`;
      const arr = m.get(key) ?? [];
      arr.push(s);
      m.set(key, arr);
    }
    return m;
  }, [historyQuery.data]);
  const [historyModal, setHistoryModal] = useState<{ brand: string; material: string } | null>(null);
  const openHistory = (brand: string, material: string) => (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setHistoryModal({ brand, material });
  };
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await fetchFilamentPrices(true);
      queryClient.setQueryData(["filament-prices"], data);
      await historyQuery.refetch();
    } catch {
      await pricesQuery.refetch();
    } finally {
      setRefreshing(false);
    }
  };
  const deals = pricesQuery.data?.deals ?? [];
  const updatedAt = pricesQuery.data?.updatedAt;
  const source = pricesQuery.data?.source;
  const bestPerMaterial = pricesQuery.data?.bestPerMaterial ?? [];
  const platforms = Array.from(new Set(deals.map((d) => d.platform)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Okazje Filamentow</h1>
          <p className="text-muted-foreground mt-1">Promocje, ceny referencyjne i sklepy z filamentami</p>
        </div>
        <div className="flex gap-1">
          {[{ key: "deals", label: "Promocje" }, { key: "prices", label: "Ceny referencyjne" }, { key: "shops", label: "Sklepy" }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as typeof tab)} className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${tab === t.key ? "bg-primary text-black" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}>{t.label}</button>
          ))}
        </div>
      </div>

      {tab === "deals" && (
        <>
          <Card className="border-amber-800/50 bg-amber-900/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-amber-400">
                <AlertTriangle className="h-4 w-4" />Alerty cenowe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
                {PRICE_ALERTS.map((a, i) => (
                  <div key={i} className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 text-xs">
                    <div className="font-medium text-amber-400">{a.material} &lt; {a.threshold} {a.unit}</div>
                    <div className="text-muted-foreground mt-0.5">{a.tip}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {bestPerMaterial.length > 0 && (
            <Card className="border-emerald-800/50 bg-emerald-900/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-emerald-400">
                  <TrendingDown className="h-4 w-4" />Najlepsza cena per material
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Najtansza oferta dla kazdego materialu wsrod sledzonych sklepow (cena za 1 kg).
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {bestPerMaterial.map((b, i) => (
                    <a
                      key={`${b.brand}-${b.material}-${i}`}
                      href={b.platformUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-emerald-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{b.brand}</span>
                        <span className="text-sm font-bold text-emerald-400">{b.pricePerKg.toFixed(2)} PLN/kg</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{b.material}</span>
                        <span className="flex items-center gap-1">{b.platform} <ExternalLink className="h-3 w-3" /></span>
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-green-400" />Aktualne promocje (PL)
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ceny za szpule 1 kg agregowane z {platforms.length > 0 ? platforms.join(", ") : "Allegro, Szpulomat, Botland, Fiber3D"}. Sortowane od najtanszej za kg.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {updatedAt && (
                    <span className="text-xs text-muted-foreground">
                      Zaktualizowano: {formatUpdatedAt(updatedAt)}
                    </span>
                  )}
                  {source && (
                    <Badge
                      className={`text-xs border-0 ${
                        source === "live"
                          ? "bg-green-900 text-green-200"
                          : source === "cache"
                            ? "bg-blue-900 text-blue-200"
                            : "bg-amber-900 text-amber-200"
                      }`}
                    >
                      {source === "live" ? "live" : source === "cache" ? "cache" : "fallback"}
                    </Badge>
                  )}
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing || pricesQuery.isFetching}
                    className="px-2 py-1 text-xs rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 disabled:opacity-50 flex items-center gap-1"
                  >
                    {refreshing || pricesQuery.isFetching ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3 w-3" />
                    )}
                    Odswiez
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {pricesQuery.isLoading ? (
                <div className="text-sm text-muted-foreground py-8 text-center">Ladowanie cen...</div>
              ) : pricesQuery.isError ? (
                <div className="text-sm text-red-400 py-8 text-center">Nie udalo sie pobrac cen. Sprobuj odswiezyc.</div>
              ) : deals.length === 0 ? (
                <div className="text-sm text-muted-foreground py-8 text-center">Brak aktualnych promocji.</div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {deals.map((d, i) => {
                    const series = historyMap.get(`${d.brand}::${d.material}::${d.platform}`);
                    return (
                    <a key={`${d.brand}-${d.material}-${i}`} href={d.platformUrl} target="_blank" rel="noopener noreferrer" className="block p-3 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-primary/40 transition-colors">
                      <div className="flex items-center justify-between mb-1.5 gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-3 h-3 rounded-full border border-zinc-600 flex-shrink-0" style={{ backgroundColor: d.colorHex }} />
                          <span className="text-sm font-medium truncate">{d.brand}</span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {series?.isHistoricalMin && (
                            <Badge className="text-[10px] border-0 bg-amber-900 text-amber-200 flex items-center gap-1 px-1.5 py-0">
                              <Trophy className="h-3 w-3" />min 30d
                            </Badge>
                          )}
                          {d.discount != null && d.discount > 0 && (
                            <Badge className="text-xs border-0 bg-green-900 text-green-200">-{d.discount}%</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">{d.material} • {d.color}</div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-lg font-bold text-primary">{d.salePrice.toFixed(2)} PLN</span>
                        {d.originalPrice != null && d.originalPrice > d.salePrice && (
                          <span className="text-xs text-muted-foreground line-through">{d.originalPrice} PLN</span>
                        )}
                        <span className="text-[10px] text-emerald-400 ml-auto">{(d.pricePerKg ?? d.salePrice).toFixed(2)} PLN/kg</span>
                      </div>
                      <div className="mt-2 mb-1">
                        {series ? (
                          <div className="space-y-0.5">
                            <Sparkline points={series.points} min={series.min} max={series.max} onClick={openHistory(d.brand, d.material)} />
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                              <span>30d: {series.min.toFixed(2)}–{series.max.toFixed(2)} PLN/kg</span>
                              {series.trendPct != null && (
                                <span className={`flex items-center gap-0.5 ${series.trendPct <= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                  {series.trendPct <= 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                                  {series.trendPct > 0 ? "+" : ""}{series.trendPct.toFixed(1)}%
                                </span>
                              )}
                            </div>
                            <button
                              onClick={openHistory(d.brand, d.material)}
                              className="mt-1 text-[10px] flex items-center gap-1 text-zinc-400 hover:text-primary transition-colors"
                            >
                              <LineChartIcon className="h-3 w-3" />
                              Historia 30d {(historyByPair.get(`${d.brand}::${d.material}`)?.length ?? 0) > 1 && (
                                <span className="text-zinc-500">({historyByPair.get(`${d.brand}::${d.material}`)!.length} sklepow)</span>
                              )}
                            </button>
                          </div>
                        ) : (
                          <div className="text-[10px] text-muted-foreground italic">Brak historii (zbieramy dane)</div>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">{d.platform} <ExternalLink className="h-3 w-3" /></span>
                        {d.minQty > 1 && <span>min. {d.minQty} szt.</span>}
                      </div>
                    </a>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {tab === "prices" && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base">Ceny referencyjne filamentow w Polsce (PLN/kg)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="text-left py-2 pr-3">Material</th>
                    <th className="text-center py-2 px-3">Min</th>
                    <th className="text-center py-2 px-3">Srednia</th>
                    <th className="text-center py-2 px-3">Max</th>
                    <th className="text-center py-2 px-3">Zakres</th>
                  </tr>
                </thead>
                <tbody>
                  {REFERENCE_PRICES.map((p, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-2 pr-3"><Badge className="text-xs border-0 bg-zinc-800 text-zinc-200">{p.material}</Badge></td>
                      <td className="text-center py-2 px-3 text-xs text-green-400 font-medium">{p.minPrice} PLN</td>
                      <td className="text-center py-2 px-3 text-xs font-medium">{p.avgPrice} PLN</td>
                      <td className="text-center py-2 px-3 text-xs text-red-400">{p.maxPrice} PLN</td>
                      <td className="text-center py-2 px-3">
                        <div className="w-full bg-zinc-800 rounded-full h-2 relative">
                          <div className="absolute h-2 bg-gradient-to-r from-green-500 via-amber-500 to-red-500 rounded-full" style={{ left: "0%", width: "100%" }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "shops" && (
        <div className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader><CardTitle className="text-base">Polskie sklepy i producenci</CardTitle></CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {SHOPS_PL.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="block p-3 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <ShoppingCart className="h-3.5 w-3.5 text-primary" />
                      <span className="text-sm font-medium">{s.name}</span>
                      <Badge className="text-xs border-0 bg-blue-900 text-blue-200">{s.type}</Badge>
                      <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto" />
                    </div>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader><CardTitle className="text-base">Sklepy miedzynarodowe</CardTitle></CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {SHOPS_INTL.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="block p-3 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm font-medium">{s.name}</span>
                      <Badge className="text-xs border-0 bg-zinc-700 text-zinc-300">{s.type}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <HistoryModal
        open={historyModal != null}
        onClose={() => setHistoryModal(null)}
        brand={historyModal?.brand ?? ""}
        material={historyModal?.material ?? ""}
        series={historyModal ? historyByPair.get(`${historyModal.brand}::${historyModal.material}`) ?? [] : []}
      />
    </div>
  );
}
