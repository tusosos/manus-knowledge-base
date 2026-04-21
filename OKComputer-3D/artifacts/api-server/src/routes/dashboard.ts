import { Router, type IRouter } from "express";
import { db, clientsTable, projectsTable, tasksTable, printJobsTable, quotesTable, filamentsTable } from "@workspace/db";
import { sql, count, eq } from "drizzle-orm";
import { GetDashboardSummaryResponse, GetDashboardActivityResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const [
    activeProjects,
    pendingTasks,
    activePrintJobs,
    totalClients,
    pendingQuotes,
    lowStockFilaments,
    completedJobsThisMonth,
  ] = await Promise.all([
    db.select({ count: count() }).from(projectsTable).where(eq(projectsTable.status, "IN_PROGRESS")),
    db.select({ count: count() }).from(tasksTable).where(eq(tasksTable.status, "TODO")),
    db.select({ count: count() }).from(printJobsTable).where(eq(printJobsTable.status, "PRINTING")),
    db.select({ count: count() }).from(clientsTable),
    db.select({ count: count() }).from(quotesTable).where(eq(quotesTable.status, "DRAFT")),
    db.execute(sql`SELECT COUNT(*) FROM filaments WHERE stock_weight <= low_stock_threshold AND is_active = true`),
    db.execute(sql`SELECT COUNT(*) FROM print_jobs WHERE status = 'COMPLETED' AND completed_at >= date_trunc('month', now())`),
  ]);

  const monthlyRevenueResult = await db.execute(
    sql`SELECT COALESCE(SUM(total_amount), 0) as revenue FROM quotes WHERE status = 'ACCEPTED' AND created_at >= date_trunc('month', now())`
  );

  const data = GetDashboardSummaryResponse.parse({
    activeProjects: activeProjects[0]?.count ?? 0,
    pendingTasks: pendingTasks[0]?.count ?? 0,
    activePrintJobs: activePrintJobs[0]?.count ?? 0,
    totalClients: totalClients[0]?.count ?? 0,
    monthlyRevenue: Number((monthlyRevenueResult.rows[0] as { revenue: string })?.revenue ?? 0),
    pendingQuotes: pendingQuotes[0]?.count ?? 0,
    lowStockFilaments: Number((lowStockFilaments.rows[0] as { count: string })?.count ?? 0),
    completedJobsThisMonth: Number((completedJobsThisMonth.rows[0] as { count: string })?.count ?? 0),
  });

  res.json(data);
});

router.get("/dashboard/activity", async (_req, res): Promise<void> => {
  const [recentTasks, recentProjects, recentJobs, recentClients] = await Promise.all([
    db.select().from(tasksTable).orderBy(sql`created_at desc`).limit(3),
    db.select().from(projectsTable).orderBy(sql`created_at desc`).limit(3),
    db.select().from(printJobsTable).orderBy(sql`created_at desc`).limit(3),
    db.select().from(clientsTable).orderBy(sql`created_at desc`).limit(2),
  ]);

  const activities = [
    ...recentTasks.map(t => ({
      id: t.id,
      type: "task" as const,
      title: t.title,
      description: `Zadanie ${t.status === "DONE" ? "ukończone" : "zaktualizowane"}`,
      createdAt: t.createdAt.toISOString(),
    })),
    ...recentProjects.map(p => ({
      id: p.id,
      type: "project" as const,
      title: p.name,
      description: `Projekt ${p.status === "COMPLETED" ? "zakończony" : "zaktualizowany"}`,
      createdAt: p.createdAt.toISOString(),
    })),
    ...recentJobs.map(j => ({
      id: j.id,
      type: "print_job" as const,
      title: j.name,
      description: `Wydruk ${j.status === "COMPLETED" ? "ukończony" : "w kolejce"}`,
      createdAt: j.createdAt.toISOString(),
    })),
    ...recentClients.map(c => ({
      id: c.id,
      type: "client" as const,
      title: c.name,
      description: "Nowy klient dodany",
      createdAt: c.createdAt.toISOString(),
    })),
  ];

  activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json(GetDashboardActivityResponse.parse(activities.slice(0, 10)));
});

export default router;
