import React, { useState } from "react";
import { useGetAnalyticsSummary, useGetRevenueData } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, FolderKanban, Printer, Package } from "lucide-react";

const PERIODS = [
  { label: "Tydzień", value: "week" },
  { label: "Miesiąc", value: "month" },
  { label: "Kwartał", value: "quarter" },
  { label: "Rok", value: "year" },
];

export default function Analytics() {
  const [period, setPeriod] = useState("month");
  const { data: summary, isLoading: isLoadingSummary } = useGetAnalyticsSummary({ period: period as "week" | "month" | "quarter" | "year" });
  const { data: revenue, isLoading: isLoadingRevenue } = useGetRevenueData({ period: period as "week" | "month" | "quarter" | "year" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analizy</h1>
          <p className="text-muted-foreground mt-1">Statystyki i wizualizacje twojego biznesu</p>
        </div>
        <div className="flex gap-1">
          {PERIODS.map(p => (
            <Button key={p.value} variant={period === p.value ? "default" : "outline"} size="sm" onClick={() => setPeriod(p.value)} className={period === p.value ? "bg-primary text-black" : "border-border"}>
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoadingSummary ? [1,2,3,4].map(i => <Skeleton key={i} className="h-24 bg-muted rounded-xl" />) : (
          <>
            <Card className="border-border bg-card">
              <CardContent className="py-4 px-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Łączny przychód</span>
                </div>
                <div className="text-xl font-bold">{summary?.totalRevenue?.toFixed(0) ?? "0"} PLN</div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="py-4 px-4">
                <div className="flex items-center gap-2 mb-1">
                  <FolderKanban className="h-4 w-4 text-blue-400" />
                  <span className="text-xs text-muted-foreground">Projekty</span>
                </div>
                <div className="text-xl font-bold">{summary?.completedProjects ?? 0} / {summary?.totalProjects ?? 0}</div>
                <div className="text-xs text-muted-foreground">ukończone</div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="py-4 px-4">
                <div className="flex items-center gap-2 mb-1">
                  <Printer className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-muted-foreground">Wydruki</span>
                </div>
                <div className="text-xl font-bold">{summary?.completedPrintJobs ?? 0} / {summary?.totalPrintJobs ?? 0}</div>
                <div className="text-xs text-muted-foreground">ukończone</div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="py-4 px-4">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="h-4 w-4 text-amber-400" />
                  <span className="text-xs text-muted-foreground">Filament zużyty</span>
                </div>
                <div className="text-xl font-bold">{summary?.totalFilamentUsed?.toFixed(0) ?? "0"} g</div>
                <div className="text-xs text-muted-foreground">Top: {summary?.topFilamentType ?? "PLA"}</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base">Przychód vs Koszt</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingRevenue ? <Skeleton className="h-48 bg-muted" /> : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={revenue ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="label" tick={{ fill: "#71717a", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#71717a", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 6 }} labelStyle={{ color: "#f4f4f5" }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="revenue" name="Przychód" stroke="#fbbf24" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="cost" name="Koszt" stroke="#60a5fa" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="profit" name="Zysk" stroke="#34d399" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base">Wydruki na okres</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingRevenue ? <Skeleton className="h-48 bg-muted" /> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={revenue ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="label" tick={{ fill: "#71717a", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#71717a", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 6 }} labelStyle={{ color: "#f4f4f5" }} />
                  <Bar dataKey="jobCount" name="Wydruki" fill="#fbbf24" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">Zużycie filamentów wg typu</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <Package className="h-10 w-10 text-zinc-700" />
            <p className="text-sm text-muted-foreground">Brak danych</p>
            <p className="text-xs text-zinc-600">Dane pojawią się po zakończeniu pierwszych wydruków.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
