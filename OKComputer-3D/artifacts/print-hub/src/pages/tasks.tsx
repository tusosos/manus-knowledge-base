import React, { useState } from "react";
import { useListTasks, useCreateTask, useUpdateTask, useDeleteTask, getListTasksQueryKey } from "@workspace/api-client-react";
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
import { Plus, Trash2, Pencil, CheckCircle2, Circle, Clock, XCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_LABELS: Record<string, string> = {
  TODO: "Do zrobienia",
  IN_PROGRESS: "W toku",
  REVIEW: "Recenzja",
  DONE: "Ukończone",
  CANCELLED: "Anulowane",
};

const STATUS_COLORS: Record<string, string> = {
  TODO: "bg-zinc-700 text-zinc-200",
  IN_PROGRESS: "bg-blue-900 text-blue-200",
  REVIEW: "bg-amber-900 text-amber-200",
  DONE: "bg-green-900 text-green-200",
  CANCELLED: "bg-red-900 text-red-200",
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "bg-zinc-700 text-zinc-200",
  MEDIUM: "bg-blue-900 text-blue-200",
  HIGH: "bg-amber-900 text-amber-200",
  URGENT: "bg-red-900 text-red-200",
};

const PRIORITY_LABELS: Record<string, string> = {
  LOW: "Niski",
  MEDIUM: "Średni",
  HIGH: "Wysoki",
  URGENT: "Pilny",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  TODO: <Circle className="h-4 w-4 text-zinc-400" />,
  IN_PROGRESS: <Clock className="h-4 w-4 text-blue-400" />,
  REVIEW: <AlertCircle className="h-4 w-4 text-amber-400" />,
  DONE: <CheckCircle2 className="h-4 w-4 text-green-400" />,
  CANCELLED: <XCircle className="h-4 w-4 text-red-400" />,
};

type TaskForm = { title: string; description: string; status: string; priority: string; dueDate: string; tags: string };

const defaultForm: TaskForm = { title: "", description: "", status: "TODO", priority: "MEDIUM", dueDate: "", tags: "" };

export default function Tasks() {
  const qc = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<TaskForm>(defaultForm);

  const params = filterStatus !== "all" ? { status: filterStatus } : undefined;
  const { data: tasks, isLoading } = useListTasks(params);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  function openNew() {
    setEditId(null);
    setForm(defaultForm);
    setOpen(true);
  }

  function openEdit(task: NonNullable<typeof tasks>[number]) {
    setEditId(task.id);
    setForm({
      title: task.title,
      description: task.description ?? "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().substring(0, 10) : "",
      tags: (task.tags ?? []).join(", "),
    });
    setOpen(true);
  }

  async function handleSave() {
    const payload = {
      title: form.title,
      description: form.description || undefined,
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || undefined,
      tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
    };

    if (editId) {
      await updateTask.mutateAsync({ id: editId, ...payload });
    } else {
      await createTask.mutateAsync(payload);
    }
    qc.invalidateQueries({ queryKey: getListTasksQueryKey() });
    setOpen(false);
  }

  async function handleDelete(id: string) {
    await deleteTask.mutateAsync({ id });
    qc.invalidateQueries({ queryKey: getListTasksQueryKey() });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Zadania</h1>
          <p className="text-muted-foreground mt-1">Zarządzaj zadaniami i postępem pracy</p>
        </div>
        <Button onClick={openNew} className="bg-primary text-black hover:bg-primary/90 font-semibold" data-testid="new-task-btn">
          <Plus className="h-4 w-4 mr-2" />
          Nowe Zadanie
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "TODO", "IN_PROGRESS", "REVIEW", "DONE", "CANCELLED"].map(s => (
          <Button
            key={s}
            variant={filterStatus === s ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus(s)}
            className={filterStatus === s ? "bg-primary text-black" : "border-border"}
          >
            {s === "all" ? "Wszystkie" : STATUS_LABELS[s]}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-16 w-full bg-muted rounded-lg" />)}
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {tasks?.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className="border-border bg-card hover:border-primary/30 transition-colors">
                  <CardContent className="flex items-center gap-4 py-3 px-4">
                    <div className="flex-shrink-0">{STATUS_ICONS[task.status]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{task.title}</span>
                        <Badge className={`text-xs ${PRIORITY_COLORS[task.priority]} border-0`}>
                          {PRIORITY_LABELS[task.priority]}
                        </Badge>
                        <Badge className={`text-xs ${STATUS_COLORS[task.status]} border-0`}>
                          {STATUS_LABELS[task.status]}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{task.description}</p>
                      )}
                      <div className="flex gap-2 mt-1">
                        {task.projectName && (
                          <span className="text-xs text-muted-foreground">Projekt: {task.projectName}</span>
                        )}
                        {task.dueDate && (
                          <span className="text-xs text-muted-foreground">
                            Termin: {new Date(task.dueDate).toLocaleDateString("pl-PL")}
                          </span>
                        )}
                        {(task.tags ?? []).map(tag => (
                          <span key={tag} className="text-xs bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(task)} data-testid={`edit-task-${task.id}`}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-300" onClick={() => handleDelete(task.id)} data-testid={`delete-task-${task.id}`}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {tasks?.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Brak zadań. Kliknij "Nowe Zadanie" aby dodać pierwsze.</p>
            </div>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? "Edytuj Zadanie" : "Nowe Zadanie"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tytuł *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Tytuł zadania" className="bg-background border-border mt-1" data-testid="task-title-input" />
            </div>
            <div>
              <Label>Opis</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Opis zadania" className="bg-background border-border mt-1" />
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
            <div>
              <Label>Termin</Label>
              <Input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} className="bg-background border-border mt-1" />
            </div>
            <div>
              <Label>Tagi (oddzielone przecinkami)</Label>
              <Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="np. modelowanie, zakupy" className="bg-background border-border mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="border-border">Anuluj</Button>
            <Button onClick={handleSave} disabled={!form.title || createTask.isPending || updateTask.isPending} className="bg-primary text-black hover:bg-primary/90" data-testid="save-task-btn">
              {createTask.isPending || updateTask.isPending ? "Zapisuję..." : "Zapisz"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
