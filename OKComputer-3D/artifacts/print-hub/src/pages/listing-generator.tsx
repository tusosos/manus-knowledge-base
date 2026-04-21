import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, RefreshCw, FileText } from "lucide-react";

type Form = {
  productName: string;
  category: string;
  material: string;
  size: string;
  color: string;
  printTime: string;
  features: string;
  targetAudience: string;
  platform: string;
  price: string;
};

const defaultForm: Form = {
  productName: "Figurka Smoka Fantasy",
  category: "Figurki i modele",
  material: "PLA Premium",
  size: "15 cm",
  color: "Czarny",
  printTime: "8 godzin",
  features: "Szczegółowa tekstura łusek, poza bojowa, idealny na prezent",
  targetAudience: "Gracze RPG, kolekcjonerzy, fani fantasy",
  platform: "etsy",
  price: "89",
};

function generateListing(form: Form, platform: string): string {
  if (platform === "etsy") {
    return `🐉 ${form.productName} - Drukowany 3D Figurka Fantasy

Poszukujesz idealnego dodatku do swojej kolekcji lub stołu RPG? Ten ${form.productName} to wyjątkowy produkt wykonany techniką druku 3D z wysokiej jakości filamentu ${form.material}.

✨ SZCZEGÓŁY PRODUKTU:
• Materiał: ${form.material}
• Wymiary: ${form.size}
• Kolor: ${form.color}
• Czas druku: ${form.printTime}

🎯 CECHY:
${form.features.split(",").map(f => `• ${f.trim()}`).join("\n")}

👥 IDEALNE DLA:
${form.targetAudience.split(",").map(t => `• ${t.trim()}`).join("\n")}

🔧 PRODUKCJA I WYSYŁKA:
Każdy element drukowany na zamówienie, gwarantujemy świeżość i jakość. Wysyłka w ciągu 2-3 dni roboczych. Bezpieczne pakowanie w piankę.

💌 MASZ PYTANIA? Napisz do mnie!

Tagi: druk 3D, figurka, fantasy, ${form.productName.toLowerCase()}, ${form.material}, custom print`;
  }

  if (platform === "allegro") {
    return `${form.productName} | Druk 3D | ${form.material} | ${form.color}

OPIS PRODUKTU:
Oferuję ${form.productName.toLowerCase()} wykonany metodą druku 3D. Produkt wykonany z wysokiej jakości filamentu ${form.material}.

DANE TECHNICZNE:
- Materiał: ${form.material}
- Kolor: ${form.color}
- Wymiary: ${form.size}
- Czas druku: ${form.printTime}

PRZEZNACZENIE:
${form.features}

IDEALNE DLA:
${form.targetAudience}

DOSTAWA:
- Czas realizacji: 2-3 dni robocze
- Pakowanie: zabezpieczone pianką
- Możliwość odbioru osobistego

GWARANCJA JAKOŚCI:
Każdy element sprawdzany przed wysyłką. W razie problemów — pełny zwrot.

Cena: ${form.price} PLN / sztuka`;
  }

  return `${form.productName}

Opis: ${form.features}
Materiał: ${form.material} | Kolor: ${form.color} | Wymiary: ${form.size}
Dla: ${form.targetAudience}
Cena: ${form.price} PLN`;
}

export default function ListingGenerator() {
  const [form, setForm] = useState<Form>(defaultForm);
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    setGenerated(generateListing(form, form.platform));
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Generator Listingów</h1>
        <p className="text-muted-foreground mt-1">Generuj opisy produktów na Etsy i Allegro</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader><CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Dane produktu</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Nazwa produktu *</Label>
                <Input value={form.productName} onChange={e => setForm(f => ({ ...f, productName: e.target.value }))} className="bg-background border-border mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Kategoria</Label>
                  <Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="bg-background border-border mt-1" />
                </div>
                <div>
                  <Label>Platforma</Label>
                  <Select value={form.platform} onValueChange={v => setForm(f => ({ ...f, platform: v }))}>
                    <SelectTrigger className="bg-background border-border mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="etsy">Etsy</SelectItem>
                      <SelectItem value="allegro">Allegro</SelectItem>
                      <SelectItem value="generic">Ogólny</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Materiał</Label>
                  <Input value={form.material} onChange={e => setForm(f => ({ ...f, material: e.target.value }))} className="bg-background border-border mt-1" />
                </div>
                <div>
                  <Label>Kolor</Label>
                  <Input value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="bg-background border-border mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Wymiary</Label>
                  <Input value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} placeholder="np. 15 cm" className="bg-background border-border mt-1" />
                </div>
                <div>
                  <Label>Cena (PLN)</Label>
                  <Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="bg-background border-border mt-1" />
                </div>
              </div>
              <div>
                <Label>Cechy i zalety (oddzielone przecinkami)</Label>
                <Textarea value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} className="bg-background border-border mt-1" rows={3} />
              </div>
              <div>
                <Label>Grupy docelowe (oddzielone przecinkami)</Label>
                <Input value={form.targetAudience} onChange={e => setForm(f => ({ ...f, targetAudience: e.target.value }))} className="bg-background border-border mt-1" />
              </div>
              <Button onClick={generate} className="w-full bg-primary text-black hover:bg-primary/90 font-semibold">
                <FileText className="h-4 w-4 mr-2" />Generuj listing
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Wygenerowany tekst</CardTitle>
                {generated && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={generate} className="border-border text-xs">
                      <RefreshCw className="h-3 w-3 mr-1" />Odśwież
                    </Button>
                    <Button variant="outline" size="sm" onClick={copyToClipboard} className="border-border text-xs">
                      <Copy className="h-3 w-3 mr-1" />{copied ? "Skopiowano!" : "Kopiuj"}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {generated ? (
                <Textarea value={generated} onChange={e => setGenerated(e.target.value)} className="bg-background border-border font-mono text-xs" rows={20} />
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Wypełnij formularz i kliknij "Generuj listing"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
