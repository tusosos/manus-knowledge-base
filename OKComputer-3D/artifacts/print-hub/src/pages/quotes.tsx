import React, { useState } from "react";
import { useListQuotes, useCreateQuote, useUpdateQuote, useDeleteQuote, useListClients, getListQuotesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Pencil, Wallet, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Szkic", SENT: "Wysłana", ACCEPTED: "Zaakceptowana", REJECTED: "Odrzucona", EXPIRED: "Wygasła",
};
const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-zinc-700 text-zinc-200", SENT: "bg-blue-900 text-blue-200",
  ACCEPTED: "bg-green-900 text-green-200", REJECTED: "bg-red-900 text-red-200", EXPIRED: "bg-orange-900 text-orange-200",
};

type LineItem = { description: string; quantity: number; unitPrice: number };
type Form = { title: string; clientId: string; status: string; validUntil: string; notes: string; items: LineItem[] };
const defaultForm: Form = { title: "", clientId: "", status: "DRAFT", validUntil: "", notes: "", items: [{ description: "", quantity: 1, unitPrice: 0 }] };

export default function Quotes() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(defaultForm);
  const { data: quotes, isLoading } = useListQuotes();
  const { data: clients } = useListClients();
  const createQuote = useCreateQuote();
  const updateQuote = useUpdateQuote();
  const deleteQuote = useDeleteQuote();

  function openNew() { setEditId(null); setForm(defaultForm); setOpen(true); }

  function openEdit(q: NonNullable<typeof quotes>[number]) {
    setEditId(q.id);
    const rawItems = (q.items as Array<{ description: string; quantity: number; unitPrice: number; total: number }>);
    setForm({
      title: q.title, clientId: q.clientId ?? "", status: q.status,
      validUntil: q.validUntil ? new Date(q.validUntil).toISOString().substring(0, 10) : "",
      notes: q.notes ?? "",
      items: rawItems.length ? rawItems.map(i => ({ description: i.description, quantity: i.quantity, unitPrice: i.unitPrice })) : [{ description: "", quantity: 1, unitPrice: 0 }],
    });
    setOpen(true);
  }

  const total = form.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);

  function setItem(idx: number, key: keyof LineItem, val: string | number) {
    setForm(f => {
      const items = [...f.items];
      items[idx] = { ...items[idx], [key]: val };
      return { ...f, items };
    });
  }

  function addItem() { setForm(f => ({ ...f, items: [...f.items, { description: "", quantity: 1, unitPrice: 0 }] })); }
  function removeItem(idx: number) { setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) })); }

  async function handleSave() {
    const payload = {
      title: form.title,
      clientId: form.clientId || undefined,
      status: form.status,
      validUntil: form.validUntil || undefined,
      notes: form.notes || undefined,
      items: form.items.filter(i => i.description),
    };
    if (editId) {
      await updateQuote.mutateAsync({ id: editId, ...payload });
    } else {
      await createQuote.mutateAsync(payload);
    }
    qc.invalidateQueries({ queryKey: getListQuotesQueryKey() });
    setOpen(false);
  }

  async function handleDelete(id: string) {
    await deleteQuote.mutateAsync({ id });
    qc.invalidateQueries({ queryKey: getListQuotesQueryKey() });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wyceny</h1>
          <p className="text-muted-foreground mt-1">Twórz i zarządzaj wycenami dla klientów</p>
        </div>
        <Button onClick={openNew} className="bg-primary text-black hover:bg-primary/90 font-semibold" data-testid="new-quote-btn">
          <Plus className="h-4 w-4 mr-2" />Nowa Wycena
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <Skeleton key={i} className="h-16 bg-muted rounded-lg" />)}
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {quotes?.map((q, i) => (
              <motion.div key={q.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="border-border bg-card hover:border-primary/30 transition-colors">
                  <CardContent className="flex items-center gap-4 py-3 px-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{q.title}</span>
                        <Badge className={`text-xs border-0 ${STATUS_COLORS[q.status]}`}>{STATUS_LABELS[q.status]}</Badge>
                      </div>
                      <div className="flex gap-4 mt-0.5 text-xs text-muted-foreground">
                        {q.clientName && <span>Klient: {q.clientName}</span>}
                        {q.validUntil && <span>Ważna do: {new Date(q.validUntil).toLocaleDateString("pl-PL")}</span>}
                        <span>Pozycji: {(q.items as unknown[]).length}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold text-primary">{q.totalAmount.toFixed(2)} PLN</div>
                      <div className="text-xs text-muted-foreground">{new Date(q.createdAt).toLocaleDateString("pl-PL")}</div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(q)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-300" onClick={() => handleDelete(q.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {quotes?.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Wallet className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Brak wycen. Stwórz pierwszą wycenę.</p>
            </div>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? "Edytuj Wycenę" : "Nowa Wycena"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Tytuł *</Label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="bg-background border-border mt-1" />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger className="bg-background border-border mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {Object.entries(STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Klient</Label>
                <Select value={form.clientId} onValueChange={v => setForm(f => ({ ...f, clientId: v }))}>
                  <SelectTrigger className="bg-background border-border mt-1"><SelectValue placeholder="Wybierz klienta" /></SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="">Brak</SelectItem>
                    {clients?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ważna do</Label>
                <Input type="date" value={form.validUntil} onChange={e => setForm(f => ({ ...f, validUntil: e.target.value }))} className="bg-background border-border mt-1" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Pozycje</Label>
                <Button variant="outline" size="sm" onClick={addItem} className="border-border text-xs">
                  <Plus className="h-3 w-3 mr-1" />Dodaj pozycję
                </Button>
              </div>
              <div className="space-y-2">
                {form.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input value={item.description} onChange={e => setItem(idx, "description", e.target.value)} placeholder="Opis" className="bg-background border-border flex-1" />
                    <Input type="number" value={item.quantity} onChange={e => setItem(idx, "quantity", parseFloat(e.target.value) || 1)} className="bg-background border-border w-16" min="1" />
                    <Input type="number" value={item.unitPrice} onChange={e => setItem(idx, "unitPrice", parseFloat(e.target.value) || 0)} placeholder="Cena" className="bg-background border-border w-24" step="0.01" />
                    <span className="text-xs text-muted-foreground w-20 text-right">{(item.quantity * item.unitPrice).toFixed(2)} PLN</span>
                    {form.items.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0 text-red-400" onClick={() => removeItem(idx)}><X className="h-3.5 w-3.5" /></Button>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-right mt-2 font-bold text-primary">Łącznie: {total.toFixed(2)} PLN</div>
            </div>
            <div>
              <Label>Uwagi</Label>
              <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="bg-background border-border mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="border-border">Anuluj</Button>
            <Button onClick={handleSave} disabled={!form.title} className="bg-primary text-black hover:bg-primary/90">
              {createQuote.isPending || updateQuote.isPending ? "Zapisuję..." : "Zapisz"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
