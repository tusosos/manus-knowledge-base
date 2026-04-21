import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Shield, Truck, Palette, Recycle, MessageSquare, User } from "lucide-react";
import { PageTransition, AnimatedSection } from "@/components/page-transition";

const VALUE_ITEMS = [
  { label: "Personalizacja", you: true, ali: false, icon: Palette, desc: "Dokladny kolor, napis, rozmiar na zamowienie" },
  { label: "Multicolor z AMS (16 kol.)", you: true, ali: false, icon: Palette, desc: "Gotowy produkt prosto z drukarki, bez malowania" },
  { label: "Gwarancja i wsparcie", you: true, ali: false, icon: Shield, desc: "Mozliwosc reklamacji w Polsce, kontakt z producentem" },
  { label: "Reklamacja w PL", you: true, ali: false, icon: MessageSquare, desc: "Prawo konsumenta, zwrot 14 dni, polski jezyk" },
  { label: "Ekologia — lokalny producent", you: true, ali: false, icon: Recycle, desc: "Brak transportu miedzynarodowego, mniejszy slad weglowy" },
  { label: "Kontrola jakosci", you: true, ali: false, icon: CheckCircle2, desc: "Kazdy wydruk sprawdzony osobiscie" },
  { label: "Szybka komunikacja", you: true, ali: false, icon: User, desc: "Odpowiedz w ciagu godzin, nie dni" },
];

export default function ValueCompare() {
  const [productName, setProductName] = useState("Figurka smok artykulowany");
  const [yourPrice, setYourPrice] = useState("35");
  const [aliPrice, setAliPrice] = useState("18");
  const [yourDelivery, setYourDelivery] = useState("2");
  const [aliDelivery, setAliDelivery] = useState("21");
  const [contactInfo, setContactInfo] = useState("Instagram: @moja_drukarnia3d");

  const priceDiff = (parseFloat(yourPrice) || 0) - (parseFloat(aliPrice) || 0);
  const deliveryDiff = (parseFloat(aliDelivery) || 0) - (parseFloat(yourDelivery) || 0);
  const yourScore = VALUE_ITEMS.filter(v => v.you).length + 2;
  const aliScore = VALUE_ITEMS.filter(v => v.ali).length + 1;

  return (
    <PageTransition className="space-y-6">
      <AnimatedSection>
        <h1 className="text-3xl font-bold tracking-tight">Porownywarka: Ty vs AliExpress</h1>
        <p className="text-muted-foreground mt-1">Narzedzie argumentacyjne — pokaz klientowi dlaczego warto kupic u Ciebie</p>
      </AnimatedSection>

      <div className="grid lg:grid-cols-5 gap-6">
        <AnimatedSection className="lg:col-span-2 space-y-4">
          <Card className="border-border bg-card">
            <CardHeader><CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Dane produktu</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="product-name">Nazwa produktu</Label>
                <Input id="product-name" value={productName} onChange={e => setProductName(e.target.value)} className="bg-background border-border mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="your-price">Twoja cena (PLN)</Label>
                  <Input id="your-price" type="number" value={yourPrice} onChange={e => setYourPrice(e.target.value)} className="bg-background border-border mt-1" min="0" />
                </div>
                <div>
                  <Label htmlFor="ali-price">Cena AliExpress (PLN)</Label>
                  <Input id="ali-price" type="number" value={aliPrice} onChange={e => setAliPrice(e.target.value)} className="bg-background border-border mt-1" min="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="your-delivery">Twoja dostawa (dni)</Label>
                  <Input id="your-delivery" type="number" value={yourDelivery} onChange={e => setYourDelivery(e.target.value)} className="bg-background border-border mt-1" min="1" />
                </div>
                <div>
                  <Label htmlFor="ali-delivery">Dostawa Ali (dni)</Label>
                  <Input id="ali-delivery" type="number" value={aliDelivery} onChange={e => setAliDelivery(e.target.value)} className="bg-background border-border mt-1" min="1" />
                </div>
              </div>
              <div>
                <Label htmlFor="contact-info">Twoje dane kontaktowe</Label>
                <Input id="contact-info" value={contactInfo} onChange={e => setContactInfo(e.target.value)} className="bg-background border-border mt-1" />
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection className="lg:col-span-3 space-y-4">
          <Card className="border-primary/30 bg-card" id="compare-card">
            <CardContent className="p-4 sm:p-6 space-y-5">
              <div className="text-center">
                <h2 className="text-xl font-bold">{productName}</h2>
                <p className="text-xs text-muted-foreground mt-1">Porownanie: lokalny producent vs import z Chin</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-primary/30 bg-primary/5 text-center">
                  <Badge className="bg-primary text-black border-0 mb-2">Twoj wydruk</Badge>
                  <div className="text-3xl font-bold text-primary">{yourPrice} PLN</div>
                  <div className="flex items-center justify-center gap-1 mt-2 text-sm text-green-400">
                    <Truck className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{yourDelivery} dni dostawy</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-zinc-700 bg-zinc-900 text-center">
                  <Badge className="bg-zinc-700 text-zinc-300 border-0 mb-2">AliExpress</Badge>
                  <div className="text-3xl font-bold text-zinc-400">{aliPrice} PLN</div>
                  <div className="flex items-center justify-center gap-1 mt-2 text-sm text-red-400">
                    <Truck className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{aliDelivery} dni dostawy</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Roznica w cenie:</span>
                  <span className={priceDiff > 0 ? "text-amber-400" : "text-green-400"}>{priceDiff > 0 ? "+" : ""}{priceDiff.toFixed(0)} PLN</span>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">Czas dostawy:</span>
                    <span className="text-green-400">{deliveryDiff} dni szybciej</span>
                  </div>
                  <div className="flex gap-1 items-center" role="img" aria-label={`Czas dostawy: Ty ${yourDelivery} dni, AliExpress ${aliDelivery} dni`}>
                    <div className="h-3 rounded-l-full bg-green-500" style={{ width: `${Math.min(100, ((parseFloat(yourDelivery) || 1) / (parseFloat(aliDelivery) || 1)) * 100)}%` }} />
                    <div className="h-3 rounded-r-full bg-red-500/40 flex-1" />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                    <span>Ty: {yourDelivery} dni</span>
                    <span>Ali: {aliDelivery} dni</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-medium">Co dostajesz u mnie, a nie na Ali:</p>
                <div className="space-y-2">
                  {VALUE_ITEMS.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-md bg-zinc-900/50">
                      <item.icon className="h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium">{item.label}</span>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <div className="flex items-center gap-0.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-400" aria-hidden="true" />
                          <span className="text-xs text-green-400">Ty</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <XCircle className="h-3.5 w-3.5 text-red-400" aria-hidden="true" />
                          <span className="text-xs text-red-400">Ali</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground">Wynik wartosci</p>
                <div className="flex justify-center gap-6">
                  <div>
                    <span className="text-2xl font-bold text-primary">{yourScore}</span>
                    <span className="text-xs text-muted-foreground">/9</span>
                    <p className="text-xs text-primary">Twoj wydruk</p>
                  </div>
                  <div className="w-px bg-zinc-700" aria-hidden="true" />
                  <div>
                    <span className="text-2xl font-bold text-zinc-500">{aliScore}</span>
                    <span className="text-xs text-muted-foreground">/9</span>
                    <p className="text-xs text-zinc-500">AliExpress</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-primary/30 bg-primary/5 text-center">
                <p className="font-bold text-primary text-lg">Zamow u mnie!</p>
                <p className="text-sm text-muted-foreground mt-1">{contactInfo}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Szybka realizacja, polska gwarancja, personalizacja</p>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground text-center">Zrob screenshot tej karty i wyslij klientowi jako argument</p>
        </AnimatedSection>
      </div>
    </PageTransition>
  );
}
