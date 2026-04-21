import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import * as cheerio from "cheerio";
import { logger } from "./logger";

export type FilamentDeal = {
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

export type BestPerMaterial = {
  brand: string;
  material: string;
  pricePerKg: number;
  platform: string;
  platformUrl: string;
};

export type FilamentPricesPayload = {
  updatedAt: string;
  source: "live" | "fallback" | "cache";
  deals: FilamentDeal[];
  bestPerMaterial: BestPerMaterial[];
};

const CACHE_FILE = path.join(os.tmpdir(), "filament-prices-cache.json");
const HISTORY_FILE = path.join(os.tmpdir(), "filament-prices-history.json");
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8000;
const HISTORY_DAYS = 30;
const HISTORY_RETENTION_DAYS = 60;

const RAW_FALLBACK: Omit<FilamentDeal, "pricePerKg" | "weightKg">[] = [
  { brand: "Devil Design", material: "PLA SILK", color: "Zloty", colorHex: "#fbbf24", originalPrice: 89, salePrice: 69.9, discount: 21, platform: "Devil Design", platformUrl: "https://devildesign.com/sklep/", rating: 4.7, inStock: true, minQty: 1 },
  { brand: "Devil Design", material: "PLA standard", color: "Czarny", colorHex: "#1a1a1a", originalPrice: 95, salePrice: 76.5, discount: 19, platform: "Devil Design", platformUrl: "https://devildesign.com/sklep/", rating: 4.7, inStock: true, minQty: 1 },
  { brand: "Devil Design", material: "PLA standard", color: "Bialy", colorHex: "#f5f5f5", originalPrice: 95, salePrice: 82, discount: 14, platform: "Devil Design", platformUrl: "https://devildesign.com/", rating: 4.6, inStock: true, minQty: 1 },
  { brand: "Colorfil", material: "PLA", color: "Niebieski", colorHex: "#3b82f6", originalPrice: 89, salePrice: 65, discount: 27, platform: "Botland.pl", platformUrl: "https://botland.com.pl/szukaj?controller=search&s=colorfil+pla", rating: 4.5, inStock: true, minQty: 1 },
  { brand: "Bambu Lab", material: "PLA Basic", color: "Bialy", colorHex: "#f5f5f5", originalPrice: 89, salePrice: 55, discount: 38, platform: "Bambu Lab Store", platformUrl: "https://eu.store.bambulab.com/", rating: 4.8, inStock: true, minQty: 1 },
  { brand: "Bambu Lab", material: "PLA Matte", color: "Czarny", colorHex: "#1a1a1a", originalPrice: 99, salePrice: 70, discount: 29, platform: "Get3D.pl", platformUrl: "https://get3d.pl/Filamenty", rating: 4.8, inStock: true, minQty: 1 },
  { brand: "Creality", material: "Hyper PLA", color: "Szary", colorHex: "#9ca3af", originalPrice: 79, salePrice: 59, discount: 25, platform: "Creality Store", platformUrl: "https://store.creality.com/", rating: 4.6, inStock: true, minQty: 1 },
  { brand: "Spectrum Filaments", material: "PLA Premium", color: "Pomaranczowy", colorHex: "#f97316", originalPrice: 99, salePrice: 79, discount: 20, platform: "Fiber3D.pl", platformUrl: "https://fiber3d.pl/pl/c/W-promocji/162", rating: 4.7, inStock: true, minQty: 1 },
  { brand: "Fiberlogy", material: "Easy PETG", color: "Szary", colorHex: "#888888", originalPrice: 119, salePrice: 89, discount: 25, platform: "Fiber3D.pl", platformUrl: "https://fiber3d.pl/pl/c/W-promocji/162", rating: 4.9, inStock: true, minQty: 1 },
  { brand: "Rosa3D", material: "PLA Basic", color: "Czarny", colorHex: "#1a1a1a", originalPrice: 79, salePrice: 65, discount: 18, platform: "Rosa3D.pl", platformUrl: "https://rosa3d.pl/", rating: 4.7, inStock: true, minQty: 2 },
  { brand: "eSun", material: "ABS+", color: "Bialy", colorHex: "#f5f5f5", originalPrice: 85, salePrice: 62, discount: 27, platform: "Botland.pl", platformUrl: "https://botland.com.pl/138-filamenty", rating: 4.5, inStock: true, minQty: 1 },
  { brand: "Spectrum Filaments", material: "ASA 275", color: "Szary", colorHex: "#9ca3af", originalPrice: 149, salePrice: 115, discount: 23, platform: "3DJake.pl", platformUrl: "https://www.3djake.pl/filamenty", rating: 4.7, inStock: true, minQty: 1 },
  { brand: "Polymaker", material: "PolyFlex TPU95", color: "Czarny", colorHex: "#1a1a1a", originalPrice: 159, salePrice: 119, discount: 25, platform: "Get3D.pl", platformUrl: "https://get3d.pl/Filamenty", rating: 4.7, inStock: true, minQty: 1 },
  { brand: "Prusament", material: "PETG", color: "Bialy", colorHex: "#ffffff", originalPrice: 129, salePrice: 99, discount: 23, platform: "Prusament.com", platformUrl: "https://prusament.com/pl/", rating: 4.9, inStock: true, minQty: 1 },
  // additional fallback deals from new sources
  { brand: "Devil Design", material: "PLA standard", color: "Mix", colorHex: "#1a1a1a", originalPrice: 95, salePrice: 72, discount: 24, platform: "Szpulomat.pl", platformUrl: "https://szpulomat.pl/?s=devil+design+pla", rating: 4.6, inStock: true, minQty: 1 },
  { brand: "Spectrum Filaments", material: "PETG", color: "Mix", colorHex: "#22c55e", originalPrice: 109, salePrice: 84, discount: 23, platform: "Szpulomat.pl", platformUrl: "https://szpulomat.pl/?s=spectrum+petg", rating: 4.7, inStock: true, minQty: 1 },
  { brand: "Fiberlogy", material: "Easy PETG", color: "Mix", colorHex: "#888888", originalPrice: 119, salePrice: 92, discount: 23, platform: "Botland.pl", platformUrl: "https://botland.com.pl/szukaj?controller=search&s=fiberlogy+easy+petg", rating: 4.8, inStock: true, minQty: 1 },
];

const FALLBACK_DEALS: FilamentDeal[] = RAW_FALLBACK.map((d) => ({
  ...d,
  weightKg: 1,
  pricePerKg: Math.round(d.salePrice * 100) / 100,
}));

type ProductQuery = {
  brand: string;
  material: string;
  color: string;
  colorHex: string;
  query: string;
  referencePrice: number;
};

const PRODUCT_QUERIES: ProductQuery[] = [
  { brand: "Devil Design", material: "PLA standard", color: "Czarny", colorHex: "#1a1a1a", query: "devil design pla czarny 1kg", referencePrice: 95 },
  { brand: "Devil Design", material: "PLA SILK", color: "Mix", colorHex: "#fbbf24", query: "devil design pla silk 1kg", referencePrice: 95 },
  { brand: "Bambu Lab", material: "PLA Basic", color: "Mix", colorHex: "#f5f5f5", query: "bambu lab pla basic 1kg", referencePrice: 89 },
  { brand: "Bambu Lab", material: "PLA Matte", color: "Mix", colorHex: "#1a1a1a", query: "bambu lab pla matte 1kg", referencePrice: 99 },
  { brand: "Creality", material: "Hyper PLA", color: "Mix", colorHex: "#9ca3af", query: "creality hyper pla 1kg", referencePrice: 79 },
  { brand: "Spectrum Filaments", material: "PLA Premium", color: "Mix", colorHex: "#f97316", query: "spectrum pla premium 1kg", referencePrice: 99 },
  { brand: "Spectrum Filaments", material: "PETG", color: "Mix", colorHex: "#22c55e", query: "spectrum petg 1kg", referencePrice: 109 },
  { brand: "Fiberlogy", material: "Easy PETG", color: "Mix", colorHex: "#888888", query: "fiberlogy easy petg 1kg", referencePrice: 119 },
  { brand: "Rosa3D", material: "PLA Basic", color: "Mix", colorHex: "#1a1a1a", query: "rosa3d pla 1kg", referencePrice: 79 },
  { brand: "eSun", material: "ABS+", color: "Mix", colorHex: "#f5f5f5", query: "esun abs+ 1kg", referencePrice: 85 },
  { brand: "Polymaker", material: "PolyFlex TPU95", color: "Mix", colorHex: "#1a1a1a", query: "polymaker polyflex tpu95 1kg", referencePrice: 159 },
  { brand: "Prusament", material: "PETG", color: "Mix", colorHex: "#ffffff", query: "prusament petg 1kg", referencePrice: 129 },
];

type ShopAdapter = {
  platform: string;
  buildUrl: (query: string) => string;
  cardSelector: string;
  titleSelectors: string[];
  priceSelectors: string[];
};

const SHOP_ADAPTERS: ShopAdapter[] = [
  {
    platform: "Allegro.pl",
    buildUrl: (q) => `https://allegro.pl/listing?string=${encodeURIComponent(q)}&order=p`,
    cardSelector: 'article[data-role="offer"], article[data-analytics-view-custom-context="REGULAR"], article',
    titleSelectors: ['h2 a', 'h2', '[data-role="offer-title"]', 'a[href*="/oferta/"]'],
    priceSelectors: ['[aria-label*="zł"]', 'span[aria-hidden="true"]'],
  },
  {
    platform: "Szpulomat.pl",
    buildUrl: (q) => `https://szpulomat.pl/?s=${encodeURIComponent(q)}`,
    cardSelector: '.product-miniature, article.product-miniature, .js-product-miniature, .product, li.product',
    titleSelectors: ['.product-title a', '.product-title', 'h2.product-name', 'h3 a', 'a.product-name'],
    priceSelectors: ['.product-price-and-shipping .price', '.price', '.product-price'],
  },
  {
    platform: "Botland.pl",
    buildUrl: (q) => `https://botland.com.pl/szukaj?controller=search&s=${encodeURIComponent(q)}`,
    cardSelector: '.product-miniature, article.js-product-miniature, .js-product-miniature, .product',
    titleSelectors: ['.product-title a', '.product-title', 'h2.h3 a', 'h3 a'],
    priceSelectors: ['.product-price-and-shipping .price', '.product-price .price', '.price'],
  },
  {
    platform: "Fiber3D.pl",
    buildUrl: (q) => `https://fiber3d.pl/pl/szukaj?controller=search&s=${encodeURIComponent(q)}`,
    cardSelector: '.product-miniature, article.product-miniature, .js-product-miniature, .product, li.product',
    titleSelectors: ['.product-title a', '.product-title', 'h3 a', 'a.product-name'],
    priceSelectors: ['.product-price-and-shipping .price', '.price', '.product-price'],
  },
];

const MATERIAL_KEYWORDS: Array<{ key: string; aliases: string[] }> = [
  { key: "petg", aliases: ["petg", "pet-g", "pet g"] },
  { key: "tpu", aliases: ["tpu"] },
  { key: "asa", aliases: ["asa"] },
  { key: "abs", aliases: ["abs"] },
  { key: "pla", aliases: ["pla"] },
];

function brandTokens(brand: string): string[] {
  return brand
    .toLowerCase()
    .replace(/[+]/g, "")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);
}

function materialAliases(material: string): string[] {
  const m = material.toLowerCase();
  for (const entry of MATERIAL_KEYWORDS) {
    if (entry.aliases.some((a) => m.includes(a))) return entry.aliases;
  }
  const first = m.split(/\s+/)[0];
  return [first];
}

function titleMatchesProduct(title: string, q: ProductQuery): boolean {
  const t = title.toLowerCase();
  if (!t) return false;
  const brandOk = brandTokens(q.brand).every((tok) => t.includes(tok));
  if (!brandOk) return false;
  const aliases = materialAliases(q.material);
  const matOk = aliases.some((a) => t.includes(a));
  return matOk;
}

function parsePolishPrices(text: string): number[] {
  if (!text) return [];
  const out: number[] = [];
  const re = /(\d{1,3}(?:[ \u00a0.]\d{3})*,\d{2})/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const raw = m[1].replace(/[ \u00a0.]/g, "").replace(",", ".");
    const v = Number.parseFloat(raw);
    if (Number.isFinite(v)) out.push(v);
  }
  return out;
}

function isPlausiblePrice(p: number, ref: number): boolean {
  if (!Number.isFinite(p)) return false;
  if (p < 20 || p > 800) return false;
  return p >= ref * 0.4 && p <= ref * 2.0;
}

const BROWSER_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "pl-PL,pl;q=0.9,en;q=0.8",
};

async function fetchWithTimeout(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { headers: BROWSER_HEADERS, signal: controller.signal });
    if (!res.ok) {
      logger.warn({ url, status: res.status }, "filament-prices: upstream non-OK");
      return null;
    }
    return await res.text();
  } catch (err) {
    logger.warn({ url, err: (err as Error).message }, "filament-prices: fetch failed");
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function extractCardTitle($card: cheerio.Cheerio<any>, $: cheerio.CheerioAPI, selectors: string[]): string {
  for (const sel of selectors) {
    const found = $card.find(sel).first();
    if (found.length > 0) {
      const text = found.text().trim();
      if (text) return text;
      const titleAttr = found.attr("title")?.trim();
      if (titleAttr) return titleAttr;
    }
  }
  // Fallback: look for any link with title attribute
  const linkTitle = $card.find("a[title]").first().attr("title")?.trim();
  if (linkTitle) return linkTitle;
  return $card.find("h1,h2,h3,h4").first().text().trim();
}

function extractCardPrices(
  $card: cheerio.Cheerio<any>,
  $: cheerio.CheerioAPI,
  selectors: string[],
): number[] {
  const out: number[] = [];
  const texts: string[] = [];
  for (const sel of selectors) {
    $card.find(sel).each((_, el) => {
      const $el = $(el);
      const text = $el.text().trim();
      if (text) texts.push(text);
      const aria = $el.attr("aria-label");
      if (aria) texts.push(aria);
    });
  }
  for (const t of texts) {
    for (const p of parsePolishPrices(t)) out.push(p);
  }
  if (out.length === 0) {
    for (const p of parsePolishPrices($card.text())) out.push(p);
  }
  return out;
}

function extractShopMinPrice(html: string, adapter: ShopAdapter, q: ProductQuery): number | null {
  let $: cheerio.CheerioAPI;
  try {
    $ = cheerio.load(html);
  } catch (err) {
    logger.warn({ err: (err as Error).message, platform: adapter.platform }, "filament-prices: cheerio parse failed");
    return null;
  }
  const candidates: number[] = [];
  let cardsSeen = 0;
  $(adapter.cardSelector).each((_, el) => {
    cardsSeen += 1;
    if (cardsSeen > 80) return false;
    const $card = $(el);
    const title = extractCardTitle($card, $, adapter.titleSelectors);
    if (!titleMatchesProduct(title, q)) return;
    const prices = extractCardPrices($card, $, adapter.priceSelectors);
    for (const p of prices) {
      if (isPlausiblePrice(p, q.referencePrice)) {
        candidates.push(p);
      }
    }
    return;
  });
  if (candidates.length === 0) {
    logger.debug(
      { platform: adapter.platform, brand: q.brand, material: q.material, cardsSeen },
      "filament-prices: no matching product card found",
    );
    return null;
  }
  candidates.sort((a, b) => a - b);
  return candidates[0];
}

async function scrapeShop(adapter: ShopAdapter, q: ProductQuery): Promise<FilamentDeal | null> {
  const url = adapter.buildUrl(q.query);
  const html = await fetchWithTimeout(url);
  if (!html) return null;
  const price = extractShopMinPrice(html, adapter, q);
  if (price == null) return null;
  const discount =
    price < q.referencePrice
      ? Math.round(((q.referencePrice - price) / q.referencePrice) * 100)
      : null;
  const salePrice = Math.round(price * 100) / 100;
  return {
    brand: q.brand,
    material: q.material,
    color: q.color,
    colorHex: q.colorHex,
    salePrice,
    originalPrice: q.referencePrice,
    discount,
    pricePerKg: salePrice,
    weightKg: 1,
    platform: adapter.platform,
    platformUrl: url,
    rating: null,
    inStock: true,
    minQty: 1,
  };
}

async function scrapeAll(): Promise<FilamentDeal[]> {
  const tasks: Promise<FilamentDeal | null>[] = [];
  for (const q of PRODUCT_QUERIES) {
    for (const adapter of SHOP_ADAPTERS) {
      tasks.push(scrapeShop(adapter, q));
    }
  }
  const results = await Promise.all(tasks);
  return results.filter((d): d is FilamentDeal => d != null);
}

function computeBestPerMaterial(deals: FilamentDeal[]): BestPerMaterial[] {
  const map = new Map<string, BestPerMaterial>();
  for (const d of deals) {
    const key = `${d.brand}::${d.material}`;
    const current = map.get(key);
    if (!current || d.pricePerKg < current.pricePerKg) {
      map.set(key, {
        brand: d.brand,
        material: d.material,
        pricePerKg: d.pricePerKg,
        platform: d.platform,
        platformUrl: d.platformUrl,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => a.pricePerKg - b.pricePerKg);
}

function sortDeals(deals: FilamentDeal[]): FilamentDeal[] {
  return [...deals].sort((a, b) => a.pricePerKg - b.pricePerKg);
}

type CacheFile = {
  updatedAt: string;
  source: "live" | "fallback";
  deals: FilamentDeal[];
  bestPerMaterial: BestPerMaterial[];
};

async function readCache(): Promise<CacheFile | null> {
  try {
    const text = await fs.readFile(CACHE_FILE, "utf8");
    const parsed = JSON.parse(text) as Partial<CacheFile>;
    if (!parsed.updatedAt || !Array.isArray(parsed.deals)) return null;
    const deals = parsed.deals.map((d) => ({
      ...d,
      weightKg: typeof d.weightKg === "number" ? d.weightKg : 1,
      pricePerKg: typeof d.pricePerKg === "number" ? d.pricePerKg : d.salePrice,
    })) as FilamentDeal[];
    return {
      updatedAt: parsed.updatedAt,
      source: parsed.source === "fallback" ? "fallback" : "live",
      deals,
      bestPerMaterial: Array.isArray(parsed.bestPerMaterial)
        ? (parsed.bestPerMaterial as BestPerMaterial[])
        : computeBestPerMaterial(deals),
    };
  } catch {
    return null;
  }
}

async function writeCache(payload: CacheFile): Promise<void> {
  try {
    await fs.writeFile(CACHE_FILE, JSON.stringify(payload), "utf8");
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "filament-prices: failed to persist cache");
  }
}

export type HistoryPoint = { date: string; pricePerKg: number };
export type HistorySeries = {
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
export type HistoryPayload = {
  generatedAt: string;
  days: number;
  series: HistorySeries[];
};

type HistorySnapshotEntry = {
  brand: string;
  material: string;
  platform: string;
  pricePerKg: number;
};
type HistorySnapshot = {
  date: string;
  takenAt: string;
  source: "live" | "fallback";
  entries: HistorySnapshotEntry[];
};
type HistoryFile = { snapshots: HistorySnapshot[] };

function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function readHistoryFile(): Promise<HistoryFile> {
  try {
    const text = await fs.readFile(HISTORY_FILE, "utf8");
    const parsed = JSON.parse(text) as Partial<HistoryFile>;
    if (!parsed || !Array.isArray(parsed.snapshots)) return { snapshots: [] };
    return { snapshots: parsed.snapshots as HistorySnapshot[] };
  } catch {
    return { snapshots: [] };
  }
}

async function writeHistoryFile(file: HistoryFile): Promise<void> {
  try {
    await fs.writeFile(HISTORY_FILE, JSON.stringify(file), "utf8");
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "filament-prices: failed to persist history");
  }
}

async function appendSnapshot(payload: CacheFile): Promise<void> {
  const file = await readHistoryFile();
  const date = todayKey(new Date(payload.updatedAt));
  const entries: HistorySnapshotEntry[] = payload.deals.map((d) => ({
    brand: d.brand,
    material: d.material,
    platform: d.platform,
    pricePerKg: d.pricePerKg,
  }));
  const snapshot: HistorySnapshot = {
    date,
    takenAt: payload.updatedAt,
    source: payload.source,
    entries,
  };
  const filtered = file.snapshots.filter((s) => s.date !== date);
  filtered.push(snapshot);
  filtered.sort((a, b) => (a.date < b.date ? -1 : 1));
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - HISTORY_RETENTION_DAYS);
  const cutoffKey = todayKey(cutoff);
  const trimmed = filtered.filter((s) => s.date >= cutoffKey);
  await writeHistoryFile({ snapshots: trimmed });
}

export async function getFilamentPriceHistory(days: number = HISTORY_DAYS): Promise<HistoryPayload> {
  const file = await readHistoryFile();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - (days - 1));
  const cutoffKey = todayKey(cutoff);
  const recent = file.snapshots.filter((s) => s.date >= cutoffKey);
  const seriesMap = new Map<string, HistorySeries>();
  for (const snap of recent) {
    for (const e of snap.entries) {
      const key = `${e.brand}::${e.material}::${e.platform}`;
      let s = seriesMap.get(key);
      if (!s) {
        s = {
          brand: e.brand,
          material: e.material,
          platform: e.platform,
          points: [],
          min: e.pricePerKg,
          max: e.pricePerKg,
          avg: 0,
          latest: e.pricePerKg,
          isHistoricalMin: false,
          trendPct: null,
        };
        seriesMap.set(key, s);
      }
      s.points.push({ date: snap.date, pricePerKg: e.pricePerKg });
    }
  }
  const series: HistorySeries[] = [];
  for (const s of seriesMap.values()) {
    s.points.sort((a, b) => (a.date < b.date ? -1 : 1));
    const prices = s.points.map((p) => p.pricePerKg);
    s.min = Math.min(...prices);
    s.max = Math.max(...prices);
    s.avg = Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 100) / 100;
    s.latest = prices[prices.length - 1];
    s.isHistoricalMin = s.points.length >= 2 && s.latest <= s.min + 1e-6;
    if (s.points.length >= 2) {
      const first = s.points[0].pricePerKg;
      if (first > 0) {
        s.trendPct = Math.round(((s.latest - first) / first) * 1000) / 10;
      }
    }
    series.push(s);
  }
  series.sort((a, b) => a.brand.localeCompare(b.brand) || a.material.localeCompare(b.material));
  return {
    generatedAt: new Date().toISOString(),
    days,
    series,
  };
}

let inFlight: Promise<FilamentPricesPayload> | null = null;

async function refresh(): Promise<FilamentPricesPayload> {
  const liveDeals = await scrapeAll();
  if (liveDeals.length >= 3) {
    const sorted = sortDeals(liveDeals);
    const payload: CacheFile = {
      updatedAt: new Date().toISOString(),
      source: "live",
      deals: sorted,
      bestPerMaterial: computeBestPerMaterial(sorted),
    };
    await writeCache(payload);
    await appendSnapshot(payload);
    return payload;
  }
  logger.warn({ liveCount: liveDeals.length }, "filament-prices: scrape returned insufficient data, using fallback");
  const sortedFallback = sortDeals(FALLBACK_DEALS);
  const payload: CacheFile = {
    updatedAt: new Date().toISOString(),
    source: "fallback",
    deals: sortedFallback,
    bestPerMaterial: computeBestPerMaterial(sortedFallback),
  };
  await writeCache(payload);
  await appendSnapshot(payload);
  return payload;
}

export async function getFilamentPrices(opts: { force?: boolean } = {}): Promise<FilamentPricesPayload> {
  if (!opts.force) {
    const cached = await readCache();
    if (cached) {
      const age = Date.now() - new Date(cached.updatedAt).getTime();
      if (Number.isFinite(age) && age < CACHE_TTL_MS) {
        return { ...cached, source: cached.source === "live" ? "cache" : cached.source };
      }
    }
  }
  if (!inFlight) {
    inFlight = refresh().finally(() => {
      inFlight = null;
    });
  }
  try {
    return await inFlight;
  } catch (err) {
    logger.error({ err: (err as Error).message }, "filament-prices: refresh failed, returning fallback");
    const sortedFallback = sortDeals(FALLBACK_DEALS);
    return {
      updatedAt: new Date().toISOString(),
      source: "fallback",
      deals: sortedFallback,
      bestPerMaterial: computeBestPerMaterial(sortedFallback),
    };
  }
}
