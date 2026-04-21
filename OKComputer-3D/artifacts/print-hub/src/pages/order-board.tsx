import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, GripVertical } from "lucide-react";
import { PageTransition, AnimatedSection } from "@/components/page-transition";

interface OrderCard {
  id: string;
  client: string;
  product: string;
  price: number;
  deadline: string;
  priority: "low" | "medium" | "high" | "urgent";
}

const COLUMNS = [
  { id: "inquiry", label: "Zapytanie", color: "bg-zinc-700" },
  { id: "quote", label: "Wycena", color: "bg-blue-900" },
  { id: "accepted", label: "Zaakceptowane", color: "bg-indigo-900" },
  { id: "printing", label: "Drukowanie", color: "bg-amber-900" },
  { id: "postprocess", label: "Post-processing", color: "bg-orange-900" },
  { id: "qc", label: "Kontrola", color: "bg-purple-900" },
  { id: "packing", label: "Pakowanie", color: "bg-teal-900" },
  { id: "shipped", label: "Wysylka", color: "bg-cyan-900" },
  { id: "delivered", label: "Dostarczone", color: "bg-green-900" },
];

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-zinc-600",
  medium: "bg-blue-600",
  high: "bg-amber-600",
  urgent: "bg-red-600",
};

const PRIORITY_LABELS: Record<string, string> = {
  low: "Niski",
  medium: "Sredni",
  high: "Wysoki",
  urgent: "Pilny",
};

const INITIAL_CARDS: Record<string, OrderCard[]> = {
  inquiry: [],
  quote: [],
  accepted: [],
  printing: [],
  postprocess: [],
  qc: [],
  packing: [],
  shipped: [],
  delivered: [],
};

export default function OrderBoard() {
  const [columns, setColumns] = useState<Record<string, OrderCard[]>>(INITIAL_CARDS);
  const [draggedCard, setDraggedCard] = useState<{ card: OrderCard; fromCol: string } | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCard, setNewCard] = useState<{ client: string; product: string; price: string; deadline: string; priority: "low" | "medium" | "high" | "urgent" }>({ client: "", product: "", price: "", deadline: "", priority: "medium" });
  const [focusedCard, setFocusedCard] = useState<string | null>(null);

  function handleDragStart(card: OrderCard, fromCol: string) {
    setDraggedCard({ card, fromCol });
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDrop(toCol: string) {
    if (!draggedCard) return;
    if (draggedCard.fromCol === toCol) {
      setDraggedCard(null);
      return;
    }
    setColumns(prev => {
      const updated = { ...prev };
      updated[draggedCard.fromCol] = prev[draggedCard.fromCol].filter(c => c.id !== draggedCard.card.id);
      updated[toCol] = [...prev[toCol], draggedCard.card];
      return updated;
    });
    setDraggedCard(null);
  }

  const moveCard = useCallback((cardId: string, fromCol: string, direction: "left" | "right") => {
    const colIndex = COLUMNS.findIndex(c => c.id === fromCol);
    const targetIndex = direction === "right" ? colIndex + 1 : colIndex - 1;
    if (targetIndex < 0 || targetIndex >= COLUMNS.length) return;
    const targetCol = COLUMNS[targetIndex].id;

    setColumns(prev => {
      const card = prev[fromCol].find(c => c.id === cardId);
      if (!card) return prev;
      const updated = { ...prev };
      updated[fromCol] = prev[fromCol].filter(c => c.id !== cardId);
      updated[targetCol] = [...prev[targetCol], card];
      return updated;
    });
  }, []);

  function handleCardKeyDown(e: React.KeyboardEvent, cardId: string, colId: string) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      moveCard(cardId, colId, "right");
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      moveCard(cardId, colId, "left");
    }
  }

  function addCard() {
    if (!newCard.client || !newCard.product) return;
    const card: OrderCard = {
      id: Date.now().toString(),
      client: newCard.client,
      product: newCard.product,
      price: parseFloat(newCard.price) || 0,
      deadline: newCard.deadline || new Date().toISOString().slice(0, 10),
      priority: newCard.priority,
    };
    setColumns(prev => ({ ...prev, inquiry: [...prev.inquiry, card] }));
    setNewCard({ client: "", product: "", price: "", deadline: "", priority: "medium" });
    setShowAddForm(false);
  }

  function removeCard(colId: string, cardId: string) {
    setColumns(prev => ({
      ...prev,
      [colId]: prev[colId].filter(c => c.id !== cardId),
    }));
  }

  const totalCards = Object.values(columns).reduce((s, c) => s + c.length, 0);
  const totalValue = Object.values(columns).flat().reduce((s, c) => s + c.price, 0);

  return (
    <PageTransition className="space-y-4">
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tablica Zamowien</h1>
            <p className="text-muted-foreground mt-1">Kanban — przeciagaj karty lub uzyj strzalek (← →) miedzy etapami</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{totalCards}</span> zamowien · <span className="font-medium text-primary">{totalValue.toLocaleString("pl-PL")} PLN</span>
            </div>
            <Button size="sm" onClick={() => setShowAddForm(!showAddForm)} className="bg-primary text-black hover:bg-primary/90 min-h-[44px] min-w-[44px]" aria-label="Dodaj nowe zamowienie">
              <Plus className="h-4 w-4 mr-1" aria-hidden="true" />Dodaj
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {showAddForm && (
        <AnimatedSection>
          <Card className="border-primary/30 bg-card">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                <Input placeholder="Klient" value={newCard.client} onChange={e => setNewCard(p => ({ ...p, client: e.target.value }))} className="bg-background border-border" aria-label="Nazwa klienta" />
                <Input placeholder="Produkt" value={newCard.product} onChange={e => setNewCard(p => ({ ...p, product: e.target.value }))} className="bg-background border-border" aria-label="Nazwa produktu" />
                <Input type="number" placeholder="Cena PLN" value={newCard.price} onChange={e => setNewCard(p => ({ ...p, price: e.target.value }))} className="bg-background border-border" aria-label="Cena w PLN" />
                <Input type="date" value={newCard.deadline} onChange={e => setNewCard(p => ({ ...p, deadline: e.target.value }))} className="bg-background border-border" aria-label="Termin realizacji" />
                <div className="flex gap-2">
                  <select value={newCard.priority} onChange={e => setNewCard(p => ({ ...p, priority: e.target.value as OrderCard["priority"] }))} className="flex-1 bg-background border border-border rounded-md px-2 text-sm min-h-[44px]" aria-label="Priorytet">
                    <option value="low">Niski</option>
                    <option value="medium">Sredni</option>
                    <option value="high">Wysoki</option>
                    <option value="urgent">Pilny</option>
                  </select>
                  <Button size="sm" onClick={addCard} className="bg-primary text-black min-h-[44px] min-w-[44px]">OK</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      )}

      <AnimatedSection>
        <div className="flex gap-2 overflow-x-auto pb-4" style={{ minHeight: "calc(100vh - 220px)" }} role="region" aria-label="Tablica Kanban zamowien">
          {COLUMNS.map(col => {
            const cards = columns[col.id] || [];
            return (
              <div
                key={col.id}
                className="flex-shrink-0 w-48 sm:w-52"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(col.id)}
                role="group"
                aria-label={`Kolumna: ${col.label}, ${cards.length} zamowien`}
              >
                <div className="flex items-center gap-2 mb-2 px-1">
                  <div className={`w-2 h-2 rounded-full ${col.color}`} aria-hidden="true" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">{col.label}</span>
                  <Badge className="text-[10px] h-4 px-1.5 border-0 bg-zinc-800 text-zinc-300 ml-auto">{cards.length}</Badge>
                </div>
                <div className="space-y-2 min-h-32 p-1 rounded-lg border border-border/50 bg-zinc-950/50">
                  {cards.map(card => (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={() => handleDragStart(card, col.id)}
                      onKeyDown={(e) => handleCardKeyDown(e, card.id, col.id)}
                      tabIndex={0}
                      role="button"
                      aria-label={`${card.product} — ${card.client}, ${card.price} PLN, priorytet: ${PRIORITY_LABELS[card.priority]}. Uzyj strzalek ← → aby przeniesc.`}
                      className="p-2.5 bg-card rounded-lg border border-border hover:border-primary/30 cursor-grab active:cursor-grabbing transition-colors group focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <GripVertical className="h-3 w-3 text-zinc-600 flex-shrink-0" aria-hidden="true" />
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${PRIORITY_COLORS[card.priority]}`} title={PRIORITY_LABELS[card.priority]} aria-label={`Priorytet: ${PRIORITY_LABELS[card.priority]}`} />
                        </div>
                        <button
                          onClick={() => removeCard(col.id, card.id)}
                          className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2 -mt-2"
                          aria-label={`Usun zamowienie: ${card.product}`}
                        >
                          <X className="h-3 w-3 text-zinc-500 hover:text-red-400" />
                        </button>
                      </div>
                      <p className="text-xs font-medium mt-1 leading-tight">{card.product}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{card.client}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs font-medium text-primary">{card.price} PLN</span>
                        <span className="text-[10px] text-muted-foreground">{card.deadline.slice(5)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </AnimatedSection>
    </PageTransition>
  );
}
