import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Printer as PrinterIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { PageTransition, AnimatedSection } from "@/components/page-transition";

const MATERIALS = ["PLA", "PLA Silk", "PETG", "ABS", "ASA", "TPU", "PA (Nylon)", "PC"];

export default function LabelGenerator() {
  const [brandName, setBrandName] = useState(() => {
    try { return localStorage.getItem("label_brand") || "Moja Drukarnia 3D"; } catch { return "Moja Drukarnia 3D"; }
  });
  const [productName, setProductName] = useState("Figurka smok artykulowany");
  const [material, setMaterial] = useState("PLA");
  const [color, setColor] = useState("Zloty");
  const [printDate, setPrintDate] = useState(new Date().toISOString().slice(0, 10));
  const [careInstructions, setCareInstructions] = useState("Unikaj temperatury powyzej 50°C. Czysc wilgotna sciereczka.");
  const [qrUrl, setQrUrl] = useState("https://instagram.com/moja_drukarnia3d");

  useEffect(() => {
    try { localStorage.setItem("label_brand", brandName); } catch {}
  }, [brandName]);

  function handlePrint() {
    window.print();
  }

  return (
    <PageTransition className="space-y-6">
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Generator Etykiet</h1>
            <p className="text-muted-foreground mt-1">Twórz profesjonalne etykiety produktowe z kodem QR</p>
          </div>
          <Button onClick={handlePrint} className="bg-primary text-black hover:bg-primary/90 min-h-[44px]">
            <PrinterIcon className="h-4 w-4 mr-2" aria-hidden="true" />Drukuj etykiete
          </Button>
        </div>
      </AnimatedSection>

      <div className="grid lg:grid-cols-2 gap-6">
        <AnimatedSection className="space-y-4 print:hidden">
          <Card className="border-border bg-card">
            <CardHeader><CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Dane etykiety</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="brand-name">Nazwa marki</Label>
                <Input id="brand-name" value={brandName} onChange={e => setBrandName(e.target.value)} className="bg-background border-border mt-1" />
                <p className="text-xs text-muted-foreground mt-1">Zapisywane automatycznie</p>
              </div>
              <div>
                <Label htmlFor="label-product">Nazwa produktu</Label>
                <Input id="label-product" value={productName} onChange={e => setProductName(e.target.value)} className="bg-background border-border mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="label-material">Material</Label>
                  <select id="label-material" value={material} onChange={e => setMaterial(e.target.value)} className="w-full mt-1 bg-background border border-border rounded-md px-3 py-2 text-sm min-h-[44px]">
                    {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="label-color">Kolor</Label>
                  <Input id="label-color" value={color} onChange={e => setColor(e.target.value)} className="bg-background border-border mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="label-date">Data produkcji</Label>
                <Input id="label-date" type="date" value={printDate} onChange={e => setPrintDate(e.target.value)} className="bg-background border-border mt-1" />
              </div>
              <div>
                <Label htmlFor="label-care">Instrukcja / pielegnacja</Label>
                <Input id="label-care" value={careInstructions} onChange={e => setCareInstructions(e.target.value)} className="bg-background border-border mt-1" />
              </div>
              <div>
                <Label htmlFor="label-qr">URL do kodu QR</Label>
                <Input id="label-qr" value={qrUrl} onChange={e => setQrUrl(e.target.value)} className="bg-background border-border mt-1" placeholder="https://..." />
                <p className="text-xs text-muted-foreground mt-1">Link do portfolio, strony zamowien lub social media</p>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection className="space-y-4">
          <p className="text-xs text-muted-foreground print:hidden">Podglad etykiety (proporcje 60x40mm):</p>

          <div className="flex justify-center">
            <div
              id="label-preview"
              className="bg-white text-black rounded-lg shadow-2xl print:shadow-none print:rounded-none w-full max-w-[360px]"
              style={{ aspectRatio: "3/2", padding: "16px", position: "relative", overflow: "hidden" }}
            >
              <div style={{ borderBottom: "2px solid #fbbf24", paddingBottom: "8px", marginBottom: "8px" }}>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#0a0a0a", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  {brandName}
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", height: "calc(100% - 50px)" }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "#0a0a0a", lineHeight: 1.2, marginBottom: "8px" }}>
                      {productName}
                    </div>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "8px" }}>
                      <span style={{ background: "#fbbf24", color: "#000", padding: "2px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: 600 }}>
                        {material}
                      </span>
                      <span style={{ background: "#e5e7eb", color: "#374151", padding: "2px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: 600 }}>
                        {color}
                      </span>
                    </div>
                    <div style={{ fontSize: "10px", color: "#6b7280" }}>
                      Produkcja: {new Date(printDate).toLocaleDateString("pl-PL")}
                    </div>
                  </div>

                  <div style={{ fontSize: "8px", color: "#9ca3af", lineHeight: 1.4, borderTop: "1px solid #e5e7eb", paddingTop: "6px" }}>
                    {careInstructions}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {qrUrl && (
                    <QRCodeSVG
                      value={qrUrl}
                      size={90}
                      bgColor="#ffffff"
                      fgColor="#0a0a0a"
                      level="M"
                    />
                  )}
                  <div style={{ fontSize: "7px", color: "#9ca3af", marginTop: "4px", textAlign: "center", maxWidth: "90px", wordBreak: "break-all" }}>
                    {qrUrl.replace(/^https?:\/\//, "").slice(0, 30)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <style>{`
            @media print {
              body * { visibility: hidden !important; }
              #label-preview, #label-preview * { visibility: visible !important; }
              #label-preview {
                position: fixed !important;
                left: 50% !important;
                top: 50% !important;
                transform: translate(-50%, -50%) !important;
                width: 60mm !important;
                height: 40mm !important;
                padding: 3mm !important;
                box-shadow: none !important;
                border-radius: 0 !important;
              }
            }
          `}</style>
        </AnimatedSection>
      </div>
    </PageTransition>
  );
}
