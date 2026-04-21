import React, { useState } from "react";
import { useListProjects, useCreateProject, useUpdateProject, useDeleteProject, getListProjectsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Pencil, FolderKanban } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Szkic",
  PLANNING: "Planowanie",
  IN_PROGRESS: "W realizacji",
  ON_HOLD: "Wstrzymany",
  COMPLETED: "Ukończony",
  CANCELLED: "Anulowany",
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-zinc-700 text-zinc-200",
  PLANNING: "bg-blue-900 text-blue-200",
  IN_PROGRESS: "bg-amber-900 text-amber-200",
  ON_HOLD: "bg-orange-900 text-orange-200",
  COMPLETED: "bg-green-900 text-green-200",
  CANCELLED: "bg-red-900 text-red-200",
};

const PRIORITY_LABELS: Record<string, string> = { LOW: "Niski", MEDIUM: "Średni", HIGH: "Wysoki", URGENT: "Pilny" };
const PRIORITY_COLORS: Record<string, string> = {
  LOW: "bg-zinc-700 text-zinc-200",
  MEDIUM: "bg-blue-900 text-blue-200",
  HIGH: "bg-amber-900 text-amber-200",
  URGENT: "bg-red-900 text-red-200",
};

type Form = { name: string; description: string; status: string; priority: string; budget: string; deadline: string; tags: string };
const defaultForm: Form = { name: "", description: "", status: "DRAFT", priority: "MEDIUM", budget: "", deadline: "", tags: "" };

export default function Projects() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(defaultForm);
  const { data: projects, isLoading } = useListProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  function openNew() { setEditId(null); setForm(defaultForm); setOpen(true); }

  function openEdit(p: NonNullable<typeof projects>[number]) {
    setEditId(p.id);
    setForm({
      name: p.name,
      description: p.description ?? "",
      status: p.status,
      priority: p.priority,
      budget: p.budget?.toString() ?? "",
      deadline: p.deadline ? new Date(p.deadline).toISOString().substring(0, 10) : "",
      tags: (p.tags ?? []).join(", "),
    });
    setOpen(true);
  }

  async function handleSave() {
    const payload = {
      name: form.name,
      description: form.description || undefined,
      status: form.status,
      priority: form.priority,
      budget: form.budget ? parseFloat(form.budget) : undefined,
      deadline: form.deadline || undefined,
      tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
    };
    if (editId) {
      await updateProject.mutateAsync({ id: editId, ...payload });
    } else {
      await createProject.mutateAsync(payload);
    }
    qc.invalidateQueries({ queryKey: getListProjectsQueryKey() });
    setOpen(false);
  }

  async function handleDelete(id: string) {
    await deleteProject.mutateAsync({ id });
    qc.invalidateQueries({ queryKey: getListProjectsQueryKey() });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projekty</h1>
          <p className="text-muted-foreground mt-1">Śledź postęp i zarządzaj projektami</p>
        </div>
        <Button onClick={openNew} className="bg-primary text-black hover:bg-primary/90 font-semibold" data-testid="new-project-btn">
          <Plus className="h-4 w-4 mr-2" />
          Nowy Projekt
        </Button>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-48 bg-muted rounded-xl" />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {projects?.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-border bg-card hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base leading-tight">{p.name}</CardTitle>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-300" onClick={() => handleDelete(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      <Badge className={`text-xs border-0 ${STATUS_COLORS[p.status]}`}>{STATUS_LABELS[p.status]}</Badge>
                      <Badge className={`text-xs border-0 ${PRIORITY_COLORS[p.priority]}`}>{PRIORITY_LABELS[p.priority]}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {p.description && <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Postęp</span>
                        <span className="text-primary font-medium">{p.progress}%</span>
                      </div>
                      <Progress value={p.progress} className="h-1.5 bg-zinc-800" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      {p.clientName && <div><span className="text-foreground/60">Klient:</span> {p.clientName}</div>}
                      {p.budget && <div><span className="text-foreground/60">Budżet:</span> {p.budget.toLocaleString("pl-PL")} PLN</div>}
                      {p.deadline && <div><span className="text-foreground/60">Termin:</span> {new Date(p.deadline).toLocaleDateString("pl-PL")}</div>}
                    </div>
                    {(p.tags ?? []).length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {(p.tags ?? []).map(tag => (
                          <span key={tag} className="text-xs bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">{tag}</span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {projects?.length === 0 && (
            <div className="col-span-full text-center py-16 text-muted-foreground">
              <FolderKanban className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Brak projektów. Kliknij "Nowy Projekt" aby dodać pierwszy.</p>
            </div>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader><DialogTitle>{editId ? "Edytuj Projekt" : "Nowy Projekt"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nazwa *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nazwa projektu" className="bg-background border-border mt-1" />
            </div>
            <div>
              <Label>Opis</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="bg-background border-border mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger className="bg-background border-border mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {Object.entries(STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priorytet</Label>
                <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v }))}>
                  <SelectTrigger className="bg-background border-border mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {Object.entries(PRIORITY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Budżet (PLN)</Label>
                <Input type="number" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} placeholder="0.00" className="bg-background border-border mt-1" />
              </div>
              <div>
                <Label>Termin</Label>
                <Input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} className="bg-background border-border mt-1" />
              </div>
            </div>
            <div>
              <Label>Tagi (oddzielone przecinkami)</Label>
              <Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="np. prototyp, klient B2B" className="bg-background border-border mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="border-border">Anuluj</Button>
            <Button onClick={handleSave} disabled={!form.name} className="bg-primary text-black hover:bg-primary/90">
              {createProject.isPending || updateProject.isPending ? "Zapisuję..." : "Zapisz"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
