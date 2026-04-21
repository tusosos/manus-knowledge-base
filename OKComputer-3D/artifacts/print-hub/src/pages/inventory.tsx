import React, { useState } from "react";
import { useListFilaments, useCreateFilament, useUpdateFilament, useDeleteFilament, getListFilamentsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Pencil, Package, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Form = {
  name: string; brand: string; type: string; color: string; colorHex: string;
  stockWeight: string; totalWeight: string; lowStockThreshold: string; pricePerKg: string;
  nozzleTemp: string; bedTemp: string; location: string;
};
const defaultForm: Form = {
  name: "", brand: "", type: "PLA", color: "", colorHex: "#fbbf24",
  stockWeight: "1000", totalWeight: "1000", lowStockThreshold: "200", pricePerKg: "89.90",
  nozzleTemp: "215", bedTemp: "60", location: "",
};

const FILAMENT_TYPES = ["PLA", "PETG", "ABS", "ASA", "TPU", "Resin", "Nylon", "PC", "PLA+", "FLEX", "Inne"];

export default function Inventory() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(defaultForm);
  const { data: filaments, isLoading } = useListFilaments();
  const createFilament = useCreateFilament();
  const updateFilament = useUpdateFilament();
  const deleteFilament = useDeleteFilament();

  function openNew() { setEditId(null); setForm(defaultForm); setOpen(true); }

  function openEdit(f: NonNullable<typeof filaments>[number]) {
    setEditId(f.id);
    setForm({
      name: f.name, brand: f.brand, type: f.type, color: f.color, colorHex: f.colorHex ?? "#888888",
      stockWeight: f.stockWeight.toString(), totalWeight: f.totalWeight.toString(),
      lowStockThreshold: f.lowStockThreshold.toString(), pricePerKg: f.pricePerKg.toString(),
      nozzleTemp: f.nozzleTemp?.toString() ?? "", bedTemp: f.bedTemp?.toString() ?? "",
      location: f.location ?? "",
    });
    setOpen(true);
  }

  async function handleSave() {
    const payload = {
      name: form.name, brand: form.brand, type: form.type, color: form.color,
      colorHex: form.colorHex || undefined,
      stockWeight: parseFloat(form.stockWeight) || 0,
      totalWeight: parseFloat(form.totalWeight) || 1000,
      lowStockThreshold: parseFloat(form.lowStockThreshold) || 200,
      pricePerKg: parseFloat(form.pricePerKg) || 0,
      nozzleTemp: form.nozzleTemp ? parseInt(form.nozzleTemp) : undefined,
      bedTemp: form.bedTemp ? parseInt(form.bedTemp) : undefined,
      location: form.location || undefined,
    };
    if (editId) {
      await updateFilament.mutateAsync({ id: editId, ...payload });
    } else {
      await createFilament.mutateAsync(payload);
    }
    qc.invalidateQueries({ queryKey: getListFilamentsQueryKey() });
    setOpen(false);
  }

  async function handleDelete(id: string) {
    await deleteFilament.mutateAsync({ id });
    qc.invalidateQueries({ queryKey: getListFilamentsQueryKey() });
  }

  const lowStockCount = filaments?.filter(f => f.isLowStock).length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Magazyn</h1>
          <p className="text-muted-foreground mt-1">Stan filamentów i materiałów do druku</p>
        </div>
        <Button onClick={openNew} className="bg-primary text-black hover:bg-primary/90 font-semibold" data-testid="new-filament-btn">
          <Plus className="h-4 w-4 mr-2" />Dodaj Filament
        </Button>
      </div>

      {lowStockCount > 0 && (
        <Card className="border-amber-800/50 bg-amber-900/10">
          <CardContent className="py-3 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0" />
            <span className="text-amber-200 text-sm font-medium">{lowStockCount} filament(ów) poniżej progu minimalnego</span>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <Skeleton key={i} className="h-20 bg-muted rounded-lg" />)}
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filaments?.map((fil, i) => {
              const pct = Math.round((fil.stockWeight / fil.totalWeight) * 100);
              return (
                <motion.div key={fil.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <Card className={`border-border bg-card hover:border-primary/30 transition-colors ${fil.isLowStock ? "border-amber-800/50" : ""}`}>
                    <CardContent className="flex items-center gap-4 py-3 px-4">
                      <div className="w-5 h-10 rounded flex-shrink-0" style={{ background: fil.colorHex ?? "#888" }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">{fil.name}</span>
                          <Badge className="text-xs border-0 bg-zinc-700 text-zinc-200">{fil.brand}</Badge>
                          <Badge className="text-xs border-0 bg-blue-900 text-blue-200">{fil.type}</Badge>
                          {fil.isLowStock && <Badge className="text-xs border-0 bg-amber-900 text-amber-200"><AlertTriangle className="h-3 w-3 mr-1" />Mało</Badge>}
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <div className="flex-1 max-w-32">
                            <Progress value={pct} className={`h-1.5 ${fil.isLowStock ? "bg-amber-900/30" : "bg-zinc-800"}`} />
                          </div>
                          <span className="text-xs text-muted-foreground">{fil.stockWeight}g / {fil.totalWeight}g ({pct}%)</span>
                        </div>
                        <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                          <span>{fil.pricePerKg.toFixed(2)} PLN/kg</span>
                          {fil.nozzleTemp && <span>Dysza: {fil.nozzleTemp}°C</span>}
                          {fil.bedTemp && <span>Stół: {fil.bedTemp}°C</span>}
                          {fil.location && <span>Lok: {fil.location}</span>}
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(fil)}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-300" onClick={() => handleDelete(fil.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {filaments?.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Brak filamentów w magazynie. Dodaj pierwszy filament.</p>
            </div>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader><DialogTitle>{editId ? "Edytuj Filament" : "Dodaj Filament"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Nazwa *</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="np. PLA Premium" className="bg-background border-border mt-1" />
              </div>
              <div>
                <Label>Marka *</Label>
                <Input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="np. Fiberlogy" className="bg-background border-border mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Typ</Label>
                <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                  <SelectTrigger className="bg-background border-border mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {FILAMENT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Kolor</Label>
                <Input value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} placeholder="np. Czarny" className="bg-background border-border mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Hex koloru</Label>
                <div className="flex gap-2 mt-1">
                  <input type="color" value={form.colorHex} onChange={e => setForm(f => ({ ...f, colorHex: e.target.value }))} className="w-10 h-9 rounded border border-border bg-background cursor-pointer" />
                  <Input value={form.colorHex} onChange={e => setForm(f => ({ ...f, colorHex: e.target.value }))} className="bg-background border-border" />
                </div>
              </div>
              <div>
                <Label>Lokalizacja</Label>
                <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="np. Półka A1" className="bg-background border-border mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Stan (g)</Label>
                <Input type="number" value={form.stockWeight} onChange={e => setForm(f => ({ ...f, stockWeight: e.target.value }))} className="bg-background border-border mt-1" />
              </div>
              <div>
                <Label>Łącznie (g)</Label>
                <Input type="number" value={form.totalWeight} onChange={e => setForm(f => ({ ...f, totalWeight: e.target.value }))} className="bg-background border-border mt-1" />
              </div>
              <div>
                <Label>Min. stan (g)</Label>
                <Input type="number" value={form.lowStockThreshold} onChange={e => setForm(f => ({ ...f, lowStockThreshold: e.target.value }))} className="bg-background border-border mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Cena/kg (PLN)</Label>
                <Input type="number" value={form.pricePerKg} onChange={e => setForm(f => ({ ...f, pricePerKg: e.target.value }))} className="bg-background border-border mt-1" />
              </div>
              <div>
                <Label>Dysza (°C)</Label>
                <Input type="number" value={form.nozzleTemp} onChange={e => setForm(f => ({ ...f, nozzleTemp: e.target.value }))} className="bg-background border-border mt-1" />
              </div>
              <div>
                <Label>Stół (°C)</Label>
                <Input type="number" value={form.bedTemp} onChange={e => setForm(f => ({ ...f, bedTemp: e.target.value }))} className="bg-background border-border mt-1" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="border-border">Anuluj</Button>
            <Button onClick={handleSave} disabled={!form.name || !form.brand} className="bg-primary text-black hover:bg-primary/90">
              {createFilament.isPending || updateFilament.isPending ? "Zapisuję..." : "Zapisz"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
