import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ShoppingBag, Sparkles, Palette, ExternalLink, BookOpen, AlertCircle, CheckCircle2, Download, Scale } from "lucide-react";

const PLATFORM_URLS: Record<string, (query: string) => string> = {
  makerworld: (q) => `https://makerworld.com/en/search/models?keyword=${encodeURIComponent(q)}`,
  printables: (q) => `https://www.printables.com/search/all?q=${encodeURIComponent(q)}`,
  cults3d: (q) => `https://cults3d.com/en/search?q=${encodeURIComponent(q)}`,
  thingiverse: (q) => `https://www.thingiverse.com/search?q=${encodeURIComponent(q)}`,
};

const BESTSELLERS = [
  { name: "Brelok z imieniem / logo (personalizowany)", category: "Akcesoria", margin: "550%", cost: 1.2, price: 8, platform: "Etsy + OLX + Allegro", links: { makerworld: true, printables: true }, multicolor: true },
  { name: "Bizuteria 3D (pierscionki, wisiorki, kolczyki)", category: "Akcesoria", margin: "600%", cost: 2, price: 14, platform: "Etsy", links: { cults3d: true, printables: true }, multicolor: false },
  { name: "Doniczka / wazon (Spiral Vase, geometryczne)", category: "Dekoracje", margin: "320%", cost: 6, price: 25, platform: "Etsy + Allegro + OLX", links: { printables: true, makerworld: true }, multicolor: true },
  { name: "Smok artykulowany (Flexi Dragon)", category: "Zabawki", margin: "380%", cost: 6, price: 29, platform: "Etsy + Allegro", links: { makerworld: true, printables: true }, multicolor: true },
  { name: "Kot / osos artykulowany (Flexi Cat / Axolotl)", category: "Zabawki", margin: "330%", cost: 5, price: 22, platform: "Etsy + Allegro + TikTok Shop", links: { makerworld: true, printables: true }, multicolor: true },
  { name: "Organizer kabli / klipsy (Cable Organizer)", category: "Organizacja", margin: "260%", cost: 2.5, price: 9, platform: "Allegro", links: { thingiverse: true, printables: true }, multicolor: false },
  { name: "Organizer na biurko (sorter, kubek na dlugopisy)", category: "Organizacja", margin: "200%", cost: 8, price: 24, platform: "Allegro + Etsy", links: { printables: true, makerworld: true }, multicolor: false },
  { name: "Litofania (personalizowane zdjecie 3D w LED)", category: "Dekoracje", margin: "450%", cost: 4, price: 22, platform: "Etsy + OLX", links: { thingiverse: true, printables: true }, multicolor: false },
  { name: "Lampka nocna LED (klosz / dyfuzor)", category: "Dekoracje", margin: "300%", cost: 9, price: 36, platform: "Etsy + Allegro", links: { printables: true, cults3d: true }, multicolor: false },
  { name: "Uchwyt scienny / haczyk (organizer lazienka)", category: "Organizacja", margin: "300%", cost: 3, price: 12, platform: "Allegro", links: { printables: true, makerworld: true }, multicolor: false },
  { name: "Stojak na sluchawki / kontroler", category: "Organizacja", margin: "240%", cost: 7, price: 24, platform: "Allegro + Etsy", links: { printables: true, makerworld: true }, multicolor: false },
  { name: "Obudowa Raspberry Pi 4 / 5 / Pi Zero", category: "Elektronika", margin: "290%", cost: 8, price: 31, platform: "Allegro", links: { printables: true, thingiverse: true }, multicolor: false },
  { name: "Miniatura RPG / figurka do gry (D&D, Warhammer)", category: "Hobby", margin: "480%", cost: 4, price: 23, platform: "Etsy + OLX", links: { cults3d: true, thingiverse: true }, multicolor: true },
  { name: "Elementy cosplay (maska, zbroja, rekwizyt)", category: "Hobby", margin: "300%", cost: 18, price: 72, platform: "Etsy + grupy FB", links: { cults3d: true, printables: true }, multicolor: true },
  { name: "Etui / podstawka na telefon", category: "Akcesoria", margin: "280%", cost: 5, price: 19, platform: "Allegro + Etsy", links: { printables: true, makerworld: true }, multicolor: true },
  { name: "Dekoracje swiateczne (ornament, szopka)", category: "Sezonowe", margin: "350%", cost: 4, price: 18, platform: "Allegro + OLX + Etsy", links: { thingiverse: true, printables: true, makerworld: true }, multicolor: true },
  { name: "Szachy / planszowki (komplet figur)", category: "Hobby", margin: "260%", cost: 22, price: 80, platform: "Etsy + OLX", links: { cults3d: true, thingiverse: true }, multicolor: true },
  { name: "Protezy / ortezy (na zamowienie)", category: "Medyczne", margin: "700%", cost: 22, price: 176, platform: "Zlecenia bezposrednie", links: {}, multicolor: false },
];

const PLATFORMS = [
  { name: "Etsy", desc: "Miedzynarodowy marketplace handmade. Prowizja 6.5%. Idealny na figurki, bizuterie, dekoracje.", color: "bg-orange-900 text-orange-200", url: "https://www.etsy.com" },
  { name: "Allegro", desc: "Najwieksza platforma w PL. Prowizja 8-12%. Najlepszy na organizery, etui, elektronike.", color: "bg-blue-900 text-blue-200", url: "https://allegro.pl" },
  { name: "OLX", desc: "Ogloszenia lokalne. 0% prowizji. Dobry na dekoracje, sezonowe, custom.", color: "bg-green-900 text-green-200", url: "https://www.olx.pl" },
  { name: "Amazon Handmade", desc: "Globalny zasieg. Prowizja 15%. Premium segment.", color: "bg-amber-900 text-amber-200", url: "https://www.amazon.com/handmade" },
];

const TRENDS_2026 = [
  "Wydruki multicolor — premium segment, brak konkurencji",
  "Articulated toys (przegubowe zabawki) — viral na TikTok",
  "Personalizacja — imiona, daty, dedykacje",
  "Eco-friendly PLA — trend green w e-commerce",
  "Smart home accessories — uchwyty, obudowy, organizery",
  "Cosplay i prop repliki — rosnocy rynek",
];

const MODEL_PLATFORMS: Record<string, string> = {
  makerworld: "MakerWorld",
  printables: "Printables",
  cults3d: "Cults3D",
  thingiverse: "Thingiverse",
};

const PLATFORM_COLORS: Record<string, string> = {
  makerworld: "bg-emerald-900 text-emerald-200 hover:bg-emerald-800",
  printables: "bg-orange-900 text-orange-200 hover:bg-orange-800",
  cults3d: "bg-violet-900 text-violet-200 hover:bg-violet-800",
  thingiverse: "bg-blue-900 text-blue-200 hover:bg-blue-800",
};

const CAT_COLORS: Record<string, string> = {
  Zabawki: "bg-purple-900 text-purple-200",
  Akcesoria: "bg-pink-900 text-pink-200",
  Dekoracje: "bg-amber-900 text-amber-200",
  Organizacja: "bg-blue-900 text-blue-200",
  Hobby: "bg-green-900 text-green-200",
  Elektronika: "bg-cyan-900 text-cyan-200",
  Sezonowe: "bg-red-900 text-red-200",
  Medyczne: "bg-rose-900 text-rose-200",
};

const STL_SOURCES = [
  {
    name: "Printables",
    desc: "Platforma Prusa Research — duza spolecznosc, jakosciowe modele, jasne licencje CC. Filtr 'Allowed: Remix & Sell' szybko pokaze modele do uzytku komercyjnego.",
    count: "300 000+ modeli",
    url: "https://www.printables.com/search/models?ordering=-likes&commercialUse=true",
    color: "bg-orange-900 text-orange-200",
  },
  {
    name: "MakerWorld",
    desc: "Platforma Bambu Lab — modele zoptymalizowane pod AMS i druk multicolor (3MF z gotowymi profilami). Filtr 'Standard Commercial' lub 'CC0'.",
    count: "200 000+ modeli",
    url: "https://makerworld.com/en/3d-models?license=4",
    color: "bg-emerald-900 text-emerald-200",
  },
  {
    name: "Thingiverse",
    desc: "Najstarsza biblioteka MakerBot — gigantyczna baza, ale licencje sa rozproszone. Sprawdzaj kazdy model: 'CC-BY' i 'CC0' = ok do sprzedazy.",
    count: "2 000 000+ modeli",
    url: "https://www.thingiverse.com/search?q=&type=things&sort=popular&license=cc",
    color: "bg-blue-900 text-blue-200",
  },
  {
    name: "Cults3D",
    desc: "Mix darmowych i platnych modeli. Sekcja 'Free' z filtrem 'Commercial use allowed' — figurki RPG, biżuteria, gadzety. Wysoka jakosc artystyczna.",
    count: "500 000+ modeli",
    url: "https://cults3d.com/en/search?q=&filters%5Bprice%5D=free&filters%5Blicense%5D=Commercial+use+allowed",
    color: "bg-violet-900 text-violet-200",
  },
  {
    name: "CGTrader",
    desc: "Marketplace 3D modeli — link prowadzi do darmowych modeli z licencja Royalty Free Editorial/Royalty Free, czyli dozwolonych do uzytku komercyjnego (sprawdzaj zakladke 'License' na karcie modelu).",
    count: "1 500 000+ modeli (free + paid)",
    url: "https://www.cgtrader.com/3d-print-models?file_types[]=109&file_types[]=132&price_max=0&royalty_free=1",
    color: "bg-indigo-900 text-indigo-200",
  },
];

const CC_LICENSES = [
  { code: "CC0", name: "Public Domain", commercial: true, attribution: false, derivatives: true, note: "Pelna swoboda — nawet bez podawania autora. Najlepsza opcja." },
  { code: "CC-BY", name: "Attribution", commercial: true, attribution: true, derivatives: true, note: "Mozesz sprzedawac, ale podaj autora w opisie oferty." },
  { code: "CC-BY-SA", name: "Attribution-ShareAlike", commercial: true, attribution: true, derivatives: true, note: "Mozna sprzedawac, ale wlasne modyfikacje musisz udostepnic na tej samej licencji." },
  { code: "CC-BY-ND", name: "Attribution-NoDerivatives", commercial: true, attribution: true, derivatives: false, note: "Mozesz sprzedawac wydruki, ale tylko z niezmienionego modelu — zakaz remixow, modyfikacji geometrii i pochodnych. Skalowanie i zmiana koloru sa OK. Wymagana atrybucja autora." },
  { code: "CC-BY-NC", name: "NonCommercial", commercial: false, attribution: true, derivatives: true, note: "ZAKAZ sprzedazy. Tylko do uzytku osobistego/edukacyjnego." },
  { code: "CC-BY-NC-SA", name: "NC-ShareAlike", commercial: false, attribution: true, derivatives: true, note: "ZAKAZ sprzedazy. Modyfikacje tez non-commercial." },
  { code: "CC-BY-NC-ND", name: "NC-NoDerivatives", commercial: false, attribution: true, derivatives: false, note: "ZAKAZ sprzedazy. Najbardziej restrykcyjna licencja CC." },
];

const LICENSE_TIPS = [
  "Zawsze sprawdzaj licencje PRZED wydrukiem — niektorzy autorzy zmieniaja licencje po fakcie.",
  "Zrob screenshot strony modelu z licencja w dniu pobierania (dowod w razie sporu).",
  "Modele z 'Standard Digital File License' na MakerWorld/Printables = zwykle CC-BY (mozna sprzedawac).",
  "Postacie i loga znanych marek (Disney, Marvel, Pokemon, Star Wars) — NIE wolno sprzedawac, nawet jesli STL ma CC0! To narusza prawo autorskie marki.",
  "Bezpiecznie sprzedawalne nisze: wlasne projekty, generic figurki RPG, organizery, doniczki, biżuteria abstrakcyjna, cosplay (oryginalne).",
];

const SELLING_TIPS = [
  { tip: "Zdjecia produktowe", detail: "Rób zdjecia na bialym tle, min. 5 zdjec na produkt. Pokaż skale (np. przy dloni). Dodaj lifestyle shots." },
  { tip: "Tytuly ofert", detail: "Używaj slow kluczowych: '3D printed', 'handmade', 'custom'. Na Etsy dodawaj tagi w jezyku angielskim." },
  { tip: "Sezonowosc", detail: "Przygotuj dekoracje swiateczne min. 2 miesiace przed sezonem. Halloween, Boze Narodzenie, Walentynki — peak sprzedazy." },
  { tip: "Pakowanie premium", detail: "Kartonowe pudelko z logo, folia babelkowa, karteczka z podziekowaniem. Klient wraca po wiecej!" },
  { tip: "Social media", detail: "Nagrywaj timelapse wydruków na TikTok/Instagram. Filmy z procesu drukarki H2D zbieraja duzo wyswietlen." },
  { tip: "Opinie klientow", detail: "Prosź o recenzje po kazdym zamowieniu. Na Etsy opinie to klucz do pozycji w wyszukiwaniu." },
];

const PRICING_STRATEGIES = [
  { strategy: "Penetracja rynku", desc: "Zacznij od nizsych cen niz konkurencja, zbuduj baze klientow i opinie, potem podnieś ceny o 10-20%.", when: "Start — pierwsze 3 miesiace" },
  { strategy: "Premium multicolor", desc: "Produkty multicolor wyceniaj 2-3x wyzej niz jednokolorowe. Brak konkurencji = mozesz dyktowac ceny.", when: "Od poczatku" },
  { strategy: "Pakiety / bundle", desc: "Sprzedawaj zestawy (np. 3 figurki w cenie 2.5). Zwieksza srednia wartosc zamowienia.", when: "Gdy masz 5+ produktow" },
  { strategy: "Custom / personalizacja", desc: "Doliczaj 30-50% za personalizacje (imiona, daty). Klienci chetnie placa za unikat.", when: "Od poczatku" },
];

export default function Bestsellers() {
  const [filter, setFilter] = useState("all");
  const categories = [...new Set(BESTSELLERS.map(b => b.category))];
  const filtered = filter === "all" ? BESTSELLERS : filter === "multicolor" ? BESTSELLERS.filter(b => b.multicolor) : BESTSELLERS.filter(b => b.category === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bestsellery — Co drukowac na sprzedaz</h1>
        <p className="text-muted-foreground mt-1">TOP produktow z marzami, linkami do modeli i trendami 2026. Klikaj w platformy, by szukac modeli.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === "all" ? "bg-primary text-black" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}>Wszystkie ({BESTSELLERS.length})</button>
        <button onClick={() => setFilter("multicolor")} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === "multicolor" ? "bg-primary text-black" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}>
          Multicolor Premium
        </button>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === cat ? "bg-primary text-black" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}>{cat}</button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((item, i) => (
          <Card key={i} className="border-border bg-card hover:border-primary/30 transition-colors">
            <CardContent className="flex items-center gap-4 py-3 px-4">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{item.name}</span>
                  <Badge className={`text-xs border-0 ${CAT_COLORS[item.category] ?? "bg-zinc-700 text-zinc-200"}`}>{item.category}</Badge>
                  {item.multicolor && <Badge className="text-xs border-0 bg-gradient-to-r from-purple-800 to-pink-800 text-white">Multicolor</Badge>}
                </div>
                <div className="flex gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                  <span>Koszt: {item.cost} PLN</span>
                  <span>Cena: {item.price} PLN</span>
                  <span className="text-green-400 font-medium">Marza: {item.margin}</span>
                  <span>{item.platform}</span>
                </div>
                <div className="flex gap-1.5 mt-1.5">
                  {Object.entries(item.links).filter(([, v]) => v).map(([key]) => {
                    const url = PLATFORM_URLS[key]?.(item.name);
                    return (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium transition-colors ${PLATFORM_COLORS[key] ?? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
                      >
                        {MODEL_PLATFORMS[key]}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    );
                  })}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-bold text-lg text-green-400">{item.margin}</div>
                <div className="text-xs text-muted-foreground">marzy</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />Trendy 2026
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {TRENDS_2026.map((trend, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <TrendingUp className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                <span>{trend}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-primary" />Platformy sprzedazy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {PLATFORMS.map((p, i) => (
              <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="block p-2.5 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs border-0 ${p.color}`}>{p.name}</Badge>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">{p.desc}</p>
              </a>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />Sekcja Multicolor Premium — tylko H2D + Dual AMS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">Te produkty wymagaja multicolor i sa Twoja przewaga konkurencyjna. Wiekszosci nie da sie wydrukowac na zwyklych drukarkach.</p>
          <div className="grid md:grid-cols-3 gap-3">
            {BESTSELLERS.filter(b => b.multicolor).slice(0, 6).map((item, i) => (
              <div key={i} className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                <div className="text-sm font-medium">{item.name}</div>
                <div className="flex justify-between mt-2 text-xs">
                  <span className="text-muted-foreground">Koszt: {item.cost} PLN</span>
                  <span className="text-green-400 font-bold">{item.margin}</span>
                </div>
                <div className="flex gap-1 mt-2">
                  {Object.entries(item.links).filter(([, v]) => v).map(([key]) => {
                    const url = PLATFORM_URLS[key]?.(item.name);
                    return (
                      <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-0.5">
                        {MODEL_PLATFORMS[key]} <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Download className="h-4 w-4 text-primary" />Darmowe modele STL z licencja komercyjna
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Skad pobierac STL ktore mozna legalnie sprzedawac jako wydruk. Klikaj w karty — linki maja juz wbudowane filtry licencji komercyjnej.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {STL_SOURCES.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="block p-3 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge className={`text-xs border-0 ${s.color}`}>{s.name}</Badge>
                  <span className="text-xs text-muted-foreground">{s.count}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto" />
                </div>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </a>
            ))}
          </div>

          <div className="pt-2">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Sciaga z licencji Creative Commons</span>
            </div>
            <div className="overflow-x-auto rounded-lg border border-zinc-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-900 text-xs text-muted-foreground">
                    <th className="text-left py-2 px-3">Licencja</th>
                    <th className="text-center py-2 px-3">Sprzedaz</th>
                    <th className="text-center py-2 px-3">Atrybucja</th>
                    <th className="text-center py-2 px-3">Modyfikacje</th>
                    <th className="text-left py-2 px-3">Co to oznacza w praktyce</th>
                  </tr>
                </thead>
                <tbody>
                  {CC_LICENSES.map((l, i) => (
                    <tr key={i} className={`border-t border-zinc-800 ${l.commercial ? "bg-green-950/20" : "bg-red-950/20"}`}>
                      <td className="py-2 px-3"><Badge className={`text-xs border-0 ${l.commercial ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"}`}>{l.code}</Badge></td>
                      <td className="text-center py-2 px-3">
                        {l.commercial ? <CheckCircle2 className="h-4 w-4 text-green-400 inline" /> : <AlertCircle className="h-4 w-4 text-red-400 inline" />}
                      </td>
                      <td className="text-center py-2 px-3 text-xs text-muted-foreground">{l.attribution ? "wymagana" : "brak"}</td>
                      <td className="text-center py-2 px-3 text-xs text-muted-foreground">{l.derivatives ? "tak" : "nie"}</td>
                      <td className="py-2 px-3 text-xs text-muted-foreground">{l.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 p-3 bg-amber-950/20 border border-amber-900/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs font-medium text-amber-300">Praktyczne zasady</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                {LICENSE_TIPS.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />Porady sprzedazowe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {SELLING_TIPS.map((t, i) => (
              <div key={i} className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                  <span className="text-sm font-medium">{t.tip}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-5.5">{t.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary" />Strategie cenowe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {PRICING_STRATEGIES.map((s, i) => (
              <div key={i} className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{s.strategy}</span>
                  <Badge className="text-xs border-0 bg-zinc-700 text-zinc-300">{s.when}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
