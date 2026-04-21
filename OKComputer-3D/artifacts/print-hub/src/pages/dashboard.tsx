import React from "react";
import { useGetDashboardSummary, useGetDashboardActivity } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, CheckSquare, Printer, Users, DollarSign, FileText, Package, AlertTriangle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

function PrinterStatusCard() {
  return (
    <Card className="border-zinc-800 bg-card col-span-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Printer className="h-5 w-5 text-muted-foreground" />
            Status drukarki
          </CardTitle>
          <Badge className="text-xs border bg-zinc-800 text-zinc-400 border-zinc-700">
            Bezczynna
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-6 text-center gap-2">
          <Printer className="h-10 w-10 text-zinc-700" />
          <p className="text-sm text-muted-foreground">Brak aktywnego zlecenia</p>
          <p className="text-xs text-zinc-600">Dodaj zlecenie na tablicy Kanban, aby zobaczyć postęp wydruku.</p>
        </div>
      </CardContent>
    </Card>
  );
}

const containerAnim = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemAnim = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function Dashboard() {
  const { data: summary, isLoading: isLoadingSummary } = useGetDashboardSummary();
  const { data: activity, isLoading: isLoadingActivity } = useGetDashboardActivity();

  const kanban = {
    todo: summary?.pendingTasks || 0,
    inProgress: summary?.activePrintJobs || 0,
    done: summary?.completedJobsThisMonth || 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Centrum dowodzenia twojej farmy druku 3D.</p>
      </div>

      <PrinterStatusCard />

      {isLoadingSummary ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="h-[120px] w-full rounded-xl bg-muted" />)}
        </div>
      ) : (
        <motion.div
          variants={containerAnim}
          initial="hidden"
          animate="show"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={itemAnim}>
            <Card className="border-border bg-card h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Przychod miesieczny</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{(summary?.monthlyRevenue || 0).toLocaleString("pl-PL")} PLN</div>
                <p className="text-xs text-muted-foreground mt-1">Calkowity przychod w tym miesiacu</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemAnim}>
            <Card className="border-border bg-card h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aktywne Projekty</CardTitle>
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary?.activeProjects || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Projekty w toku</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemAnim}>
            <Card className="border-border bg-card h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Klienci</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary?.totalClients || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Zarejestrowanych klientow</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemAnim}>
            <Card className="border-border bg-card h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Oczekujace wyceny</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary?.pendingQuotes || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Do wyslania klientom</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-primary" />
              Kanban — Zadania
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                <div className="text-2xl font-bold text-amber-400">{kanban.todo}</div>
                <div className="text-xs text-muted-foreground mt-1">Do zrobienia</div>
              </div>
              <div className="text-center p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                <div className="text-2xl font-bold text-blue-400">{kanban.inProgress}</div>
                <div className="text-xs text-muted-foreground mt-1">W trakcie</div>
              </div>
              <div className="text-center p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                <div className="text-2xl font-bold text-green-400">{kanban.done}</div>
                <div className="text-xs text-muted-foreground mt-1">Gotowe</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FolderKanban className="h-4 w-4 text-primary" />
              Projekty wg statusu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { label: "Pomysl", count: 1, color: "bg-zinc-600" },
                { label: "Prototyp", count: summary?.activeProjects || 0, color: "bg-blue-500" },
                { label: "Testowany", count: 0, color: "bg-amber-500" },
                { label: "Gotowy", count: 0, color: "bg-green-500" },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                  <span className="text-sm flex-1">{s.label}</span>
                  <span className="text-sm font-bold">{s.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {(summary?.lowStockFilaments ?? 0) > 0 ? (
          <Card className="border-red-800/50 bg-red-900/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-4 w-4" />
                Alerty Magazynu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400 mb-2">{summary?.lowStockFilaments}</div>
              <p className="text-xs text-muted-foreground">Filamentow ponizej 500g. Sprawdz magazyn i uzupelnij stany.</p>
              <a href="/inventory" className="text-xs text-primary flex items-center gap-1 mt-3 hover:underline">
                Przejdz do magazynu <ArrowRight className="h-3 w-3" />
              </a>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-green-800/50 bg-green-900/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-green-400">
                <Package className="h-4 w-4" />
                Magazyn OK
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Wszystkie filamenty powyzej progu minimalnego.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Ostatnia Aktywnosc</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingActivity ? (
              <div className="space-y-4">
                {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full bg-muted" />)}
              </div>
            ) : activity?.length ? (
              <div className="space-y-3">
                {activity.slice(0, 6).map((item, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-4">{new Date(item.createdAt).toLocaleDateString('pl-PL')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground py-4">Brak ostatniej aktywnosci.</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Szybkie statystyki</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
                <div className="text-xs text-muted-foreground">Wydruki w tym miesiacu</div>
                <div className="text-xl font-bold mt-1">{summary?.completedJobsThisMonth || 0}</div>
              </div>
              <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
                <div className="text-xs text-muted-foreground">Aktywne wydruki</div>
                <div className="text-xl font-bold mt-1 text-primary">{summary?.activePrintJobs || 0}</div>
              </div>
              <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
                <div className="text-xs text-muted-foreground">Zadania do zrobienia</div>
                <div className="text-xl font-bold mt-1 text-amber-400">{summary?.pendingTasks || 0}</div>
              </div>
              <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
                <div className="text-xs text-muted-foreground">Mało filamentu</div>
                <div className="text-xl font-bold mt-1 text-red-400">{summary?.lowStockFilaments || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
