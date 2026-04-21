import { Router, type IRouter } from "express";
import { db, projectsTable, printJobsTable, quotesTable, filamentsTable } from "@workspace/db";
import { sql, count, eq } from "drizzle-orm";
import {
  GetAnalyticsSummaryResponse,
  GetRevenueDataResponse,
  GetAnalyticsSummaryQueryParams,
  GetRevenueDataQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/analytics/summary", async (req, res): Promise<void> => {
  const query = GetAnalyticsSummaryQueryParams.safeParse(req.query);

  const [totalProjects, completedProjects, totalJobs, completedJobs] = await Promise.all([
    db.select({ count: count() }).from(projectsTable),
    db.select({ count: count() }).from(projectsTable).where(eq(projectsTable.status, "COMPLETED")),
    db.select({ count: count() }).from(printJobsTable),
    db.select({ count: count() }).from(printJobsTable).where(eq(printJobsTable.status, "COMPLETED")),
  ]);

  const revenueResult = await db.execute(
    sql`SELECT COALESCE(SUM(total_amount), 0) as revenue FROM quotes WHERE status = 'ACCEPTED'`
  );
  const filamentUsageResult = await db.execute(
    sql`SELECT COALESCE(SUM(actual_filament_weight), 0) as total_weight FROM print_jobs WHERE status = 'COMPLETED'`
  );
  const avgJobTimeResult = await db.execute(
    sql`SELECT COALESCE(AVG(actual_time), 0) as avg_time FROM print_jobs WHERE status = 'COMPLETED' AND actual_time IS NOT NULL`
  );
  const topFilamentResult = await db.execute(
    sql`SELECT type, COUNT(*) as cnt FROM filaments GROUP BY type ORDER BY cnt DESC LIMIT 1`
  );

  const data = GetAnalyticsSummaryResponse.parse({
    totalRevenue: Number((revenueResult.rows[0] as { revenue: string })?.revenue ?? 0),
    totalProjects: totalProjects[0]?.count ?? 0,
    completedProjects: completedProjects[0]?.count ?? 0,
    totalPrintJobs: totalJobs[0]?.count ?? 0,
    completedPrintJobs: completedJobs[0]?.count ?? 0,
    averageJobTime: Number((avgJobTimeResult.rows[0] as { avg_time: string })?.avg_time ?? 0),
    totalFilamentUsed: Number((filamentUsageResult.rows[0] as { total_weight: string })?.total_weight ?? 0),
    topFilamentType: (topFilamentResult.rows[0] as { type: string })?.type ?? "PLA",
  });

  res.json(data);
});

router.get("/analytics/revenue", async (req, res): Promise<void> => {
  const query = GetRevenueDataQueryParams.safeParse(req.query);
  const period = query.success ? query.data.period : "month";

  let groupFormat: string;
  let labels: string[];

  if (period === "week") {
    groupFormat = "Day";
    labels = ["Pon", "Wt", "Sr", "Czw", "Pt", "Sob", "Nd"];
  } else if (period === "quarter") {
    groupFormat = "Month";
    labels = ["Miesiąc 1", "Miesiąc 2", "Miesiąc 3"];
  } else if (period === "year") {
    groupFormat = "Month";
    labels = ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paz", "Lis", "Gru"];
  } else {
    groupFormat = "Week";
    labels = ["Tydzień 1", "Tydzień 2", "Tydzień 3", "Tydzień 4"];
  }

  const data = labels.map((label) => ({
    label,
    revenue: 0,
    cost: 0,
    profit: 0,
    jobCount: 0,
  }));

  res.json(GetRevenueDataResponse.parse(data));
});

export default router;
