import React, { useState } from "react";
import { useListClients, useCreateClient, useUpdateClient, useDeleteClient, getListClientsQueryKey } from "@workspace/api-client-react";
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
import { Plus, Trash2, Pencil, Users, Building2, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Form = { name: string; email: string; phone: string; type: string; companyName: string; taxId: string; notes: string };
const defaultForm: Form = { name: "", email: "", phone: "", type: "INDIVIDUAL", companyName: "", taxId: "", notes: "" };

export default function Clients() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(defaultForm);
  const [search, setSearch] = useState("");
  const { data: clients, isLoading } = useListClients(search ? { search } : undefined);
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  function openNew() { setEditId(null); setForm(defaultForm); setOpen(true); }

  function openEdit(c: NonNullable<typeof clients>[number]) {
    setEditId(c.id);
    setForm({ name: c.name, email: c.email, phone: c.phone ?? "", type: c.type, companyName: c.companyName ?? "", taxId: c.taxId ?? "", notes: c.notes ?? "" });
    setOpen(true);
  }

  async function handleSave() {
    const payload = {
      name: form.name, email: form.email,
      phone: form.phone || undefined,
      type: form.type,
      companyName: form.companyName || undefined,
      taxId: form.taxId || undefined,
      notes: form.notes || undefined,
    };
    if (editId) {
      await updateClient.mutateAsync({ id: editId, ...payload });
    } else {
      await createClient.mutateAsync(payload);
    }
    qc.invalidateQueries({ queryKey: getListClientsQueryKey() });
    setOpen(false);
  }

  async function handleDelete(id: string) {
    await deleteClient.mutateAsync({ id });
    qc.invalidateQueries({ queryKey: getListClientsQueryKey() });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Klienci</h1>
          <p className="text-muted-foreground mt-1">Zarządzaj bazą klientów i kontaktami</p>
        </div>
        <Button onClick={openNew} className="bg-primary text-black hover:bg-primary/90 font-semibold" data-testid="new-client-btn">
          <Plus className="h-4 w-4 mr-2" />Nowy Klient
        </Button>
      </div>

      <Input
        placeholder="Szukaj klientów..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="bg-card border-border max-w-sm"
      />

      {isLoading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <Skeleton key={i} className="h-16 bg-muted rounded-lg" />)}
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {clients?.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="border-border bg-card hover:border-primary/30 transition-colors">
                  <CardContent className="flex items-center gap-4 py-3 px-4">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center">
                      {c.type === "COMPANY" ? <Building2 className="h-4 w-4 text-primary" /> : <User className="h-4 w-4 text-zinc-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{c.name}</span>
                        <Badge className={`text-xs border-0 ${c.type === "COMPANY" ? "bg-blue-900 text-blue-200" : "bg-zinc-700 text-zinc-200"}`}>
                          {c.type === "COMPANY" ? "Firma" : "Osoba prywatna"}
                        </Badge>
                      </div>
                      <div className="flex gap-4 mt-0.5 text-xs text-muted-foreground">
                        <span>{c.email}</span>
                        {c.phone && <span>{c.phone}</span>}
                        {c.companyName && <span>{c.companyName}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground flex-shrink-0">
                      <span>{c.totalOrders} zamówień</span>
                      <span className="text-primary font-medium">{c.totalRevenue.toFixed(0)} PLN</span>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-300" onClick={() => handleDelete(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {clients?.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Brak klientów. Dodaj pierwszego klienta.</p>
            </div>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader><DialogTitle>{editId ? "Edytuj Klienta" : "Nowy Klient"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Imię i nazwisko / Nazwa *</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="bg-background border-border mt-1" />
              </div>
              <div>
                <Label>Typ</Label>
                <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                  <SelectTrigger className="bg-background border-border mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="INDIVIDUAL">Osoba prywatna</SelectItem>
                    <SelectItem value="COMPANY">Firma</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Email *</Label>
                <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="bg-background border-border mt-1" />
              </div>
              <div>
                <Label>Telefon</Label>
                <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="bg-background border-border mt-1" />
              </div>
            </div>
            {form.type === "COMPANY" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Nazwa firmy</Label>
                  <Input value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} className="bg-background border-border mt-1" />
                </div>
                <div>
                  <Label>NIP</Label>
                  <Input value={form.taxId} onChange={e => setForm(f => ({ ...f, taxId: e.target.value }))} className="bg-background border-border mt-1" />
                </div>
              </div>
            )}
            <div>
              <Label>Notatki</Label>
              <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="bg-background border-border mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="border-border">Anuluj</Button>
            <Button onClick={handleSave} disabled={!form.name || !form.email} className="bg-primary text-black hover:bg-primary/90">
              {createClient.isPending || updateClient.isPending ? "Zapisuję..." : "Zapisz"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
