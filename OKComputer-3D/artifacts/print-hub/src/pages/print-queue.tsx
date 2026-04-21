import React, { useState } from "react";
import { useListPrintJobs, useCreatePrintJob, useUpdatePrintJob, useDeletePrintJob, useListFilaments, getListPrintJobsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Pencil, Printer, Play, Pause, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_LABELS: Record<string, string> = {
  QUEUED: "W kolejce",
  PREPARING: "Przygotowanie",
  PRINTING: "Drukowanie",
  PAUSED: "Wstrzymany",
  COMPLETED: "Ukończony",
  FAILED: "Błąd",
  CANCELLED: "Anulowany",
};

const STATUS_COLORS: Record<string, string> = {
  QUEUED: "bg-zinc-700 text-zinc-200",
  PREPARING: "bg-blue-900 text-blue-200",
  PRINTING: "bg-green-900 text-green-200",
  PAUSED: "bg-amber-900 text-amber-200",
  COMPLETED: "bg-green-900/50 text-green-200",
  FAILED: "bg-red-900 text-red-200",
  CANCELLED: "bg-red-900/50 text-red-200",
};

type Form = { name: string; description: string; filamentId: string; quantity: string; estimatedTime: string; estimatedFilamentWeight: string; priority: string; notes: string };
const defaultForm: Form = { name: "", description: "", filamentId: "", quantity: "1", estimatedTime: "", estimatedFilamentWeight: "", priority: "5", notes: "" };

export default function PrintQueue() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(defaultForm);
  const { data: jobs, isLoading } = useListPrintJobs();
  const { data: filaments } = useListFilaments();
  const createJob = useCreatePrintJob();
  const updateJob = useUpdatePrintJob();
  const deleteJob = useDeletePrintJob();

  function openNew() { setEditId(null); setForm(defaultForm); setOpen(true); }

  function openEdit(j: NonNullable<typeof jobs>[number]) {
    setEditId(j.id);
    setForm({
      name: j.name,
      description: j.description ?? "",
      filamentId: j.filamentId,
      quantity: j.quantity.toString(),
      estimatedTime: j.estimatedTime?.toString() ?? "",
      estimatedFilamentWeight: j.estimatedFilamentWeight?.toString() ?? "",
      priority: j.priority.toString(),
      notes: j.notes ?? "",
    });
    setOpen(true);
  }

  async function handleSave() {
    const payload = {
      name: form.name,
      description: form.description || undefined,
      filamentId: form.filamentId,
      quantity: parseInt(form.quantity) || 1,
      estimatedTime: form.estimatedTime ? parseInt(form.estimatedTime) : undefined,
      estimatedFilamentWeight: form.estimatedFilamentWeight ? parseFloat(form.estimatedFilamentWeight) : undefined,
      priority: parseInt(form.priority) || 5,
      notes: form.notes || undefined,
    };
    if (editId) {
      await updateJob.mutateAsync({ id: editId, ...payload });
    } else {
      await createJob.mutateAsync(payload);
    }
    qc.invalidateQueries({ queryKey: getListPrintJobsQueryKey() });
    setOpen(false);
  }

  async function handleStatusChange(id: string, status: string) {
    await updateJob.mutateAsync({ id, status });
    qc.invalidateQueries({ queryKey: getListPrintJobsQueryKey() });
  }

  async function handleDelete(id: string) {
    await deleteJob.mutateAsync({ id });
    qc.invalidateQueries({ queryKey: getListPrintJobsQueryKey() });
  }

  const activeJobs = jobs?.filter(j => j.status === "PRINTING") ?? [];
  const queuedJobs = jobs?.filter(j => j.status === "QUEUED" || j.status === "PREPARING") ?? [];
  const doneJobs = jobs?.filter(j => j.status === "COMPLETED" || j.status === "FAILED" || j.status === "CANCELLED") ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kolejka Druku</h1>
          <p className="text-muted-foreground mt-1">Zarządzaj wydrukami i kolejką druku 3D</p>
        </div>
        <Button onClick={openNew} className="bg-primary text-black hover:bg-primary/90 font-semibold" data-testid="new-job-btn">
          <Plus className="h-4 w-4 mr-2" />Nowy Wydruk
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <Card className="border-green-800/50 bg-green-900/10">
          <CardContent className="py-4">
            <div className="text-2xl font-bold text-green-400">{activeJobs.length}</div>
            <div className="text-xs text-muted-foreground">Drukowanie</div>
          </CardContent>
        </Card>
        <Card className="border-amber-800/50 bg-amber-900/10">
          <CardContent className="py-4">
            <div className="text-2xl font-bold text-amber-400">{queuedJobs.length}</div>
            <div className="text-xs text-muted-foreground">W kolejce</div>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-card">
          <CardContent className="py-4">
            <div className="text-2xl font-bold">{doneJobs.length}</div>
            <div className="text-xs text-muted-foreground">Zakończone</div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <Skeleton key={i} className="h-20 bg-muted rounded-lg" />)}
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {jobs?.map((job, i) => {
              const fil = filaments?.find(f => f.id === job.filamentId);
              return (
                <motion.div key={job.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <Card className="border-border bg-card hover:border-primary/30 transition-colors">
                    <CardContent className="flex items-center gap-4 py-3 px-4">
                      <div className="flex-shrink-0">
                        {job.status === "PRINTING" ? <Printer className="h-5 w-5 text-green-400 animate-pulse" /> :
                         job.status === "COMPLETED" ? <CheckCircle2 className="h-5 w-5 text-green-400" /> :
                         job.status === "PAUSED" ? <Pause className="h-5 w-5 text-amber-400" /> :
                         <Printer className="h-5 w-5 text-zinc-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">{job.name}</span>
                          <Badge className={`text-xs border-0 ${STATUS_COLORS[job.status]}`}>{STATUS_LABELS[job.status]}</Badge>
                          <span className="text-xs text-muted-foreground">Priorytet: {job.priority}</span>
                        </div>
                        <div className="flex gap-3 mt-1 flex-wrap text-xs text-muted-foreground">
                          {job.filamentName && (
                            <span className="flex items-center gap-1">
                              {job.filamentColorHex && <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: job.filamentColorHex }} />}
                              {job.filamentName}
                            </span>
                          )}
                          <span>Ilość: {job.completedQuantity}/{job.quantity}</span>
                          {job.estimatedTime && <span>Czas: ~{Math.round(job.estimatedTime / 60)}h {job.estimatedTime % 60}min</span>}
                          {job.estimatedFilamentWeight && <span>Filament: ~{job.estimatedFilamentWeight}g</span>}
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        {job.status === "QUEUED" && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-green-400" onClick={() => handleStatusChange(job.id, "PRINTING")} title="Rozpocznij">
                            <Play className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {job.status === "PRINTING" && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-amber-400" onClick={() => handleStatusChange(job.id, "PAUSED")} title="Wstrzymaj">
                            <Pause className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {(job.status === "PAUSED" || job.status === "PRINTING") && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-green-400" onClick={() => handleStatusChange(job.id, "COMPLETED")} title="Ukończ">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(job)}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-300" onClick={() => handleDelete(job.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {jobs?.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Printer className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Kolejka druku jest pusta. Dodaj nowy wydruk.</p>
            </div>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader><DialogTitle>{editId ? "Edytuj Wydruk" : "Nowy Wydruk"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nazwa *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nazwa wydruku" className="bg-background border-border mt-1" />
            </div>
            <div>
              <Label>Filament *</Label>
              <Select value={form.filamentId} onValueChange={v => setForm(f => ({ ...f, filamentId: v }))}>
                <SelectTrigger className="bg-background border-border mt-1"><SelectValue placeholder="Wybierz filament" /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {filaments?.map(fil => (
                    <SelectItem key={fil.id} value={fil.id}>
                      <div className="flex items-center gap-2">
                        {fil.colorHex && <span className="w-3 h-3 rounded-full inline-block" style={{ background: fil.colorHex }} />}
                        {fil.name} ({fil.brand})
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ilość</Label>
                <Input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} min="1" className="bg-background border-border mt-1" />
              </div>
              <div>
                <Label>Priorytet (1-10)</Label>
                <Input type="number" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} min="1" max="10" className="bg-background border-border mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Czas druku (min)</Label>
                <Input type="number" value={form.estimatedTime} onChange={e => setForm(f => ({ ...f, estimatedTime: e.target.value }))} placeholder="0" className="bg-background border-border mt-1" />
              </div>
              <div>
                <Label>Filament (g)</Label>
                <Input type="number" value={form.estimatedFilamentWeight} onChange={e => setForm(f => ({ ...f, estimatedFilamentWeight: e.target.value }))} placeholder="0" className="bg-background border-border mt-1" />
              </div>
            </div>
            <div>
              <Label>Uwagi</Label>
              <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="bg-background border-border mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="border-border">Anuluj</Button>
            <Button onClick={handleSave} disabled={!form.name || !form.filamentId} className="bg-primary text-black hover:bg-primary/90">
              {createJob.isPending || updateJob.isPending ? "Zapisuję..." : "Zapisz"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
