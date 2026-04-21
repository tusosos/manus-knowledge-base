import { Router, type IRouter } from "express";
import { db, printJobsTable, filamentsTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import {
  CreatePrintJobBody,
  UpdatePrintJobBody,
  UpdatePrintJobParams,
  GetPrintJobParams,
  DeletePrintJobParams,
  ListPrintJobsResponse,
  GetPrintJobResponse,
  UpdatePrintJobResponse,
  ListPrintJobsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/print-jobs", async (req, res): Promise<void> => {
  const query = ListPrintJobsQueryParams.safeParse(req.query);
  const conditions = [];

  if (query.success && query.data.status) {
    conditions.push(eq(printJobsTable.status, query.data.status));
  }
  if (query.success && query.data.filamentId) {
    conditions.push(eq(printJobsTable.filamentId, query.data.filamentId));
  }

  const jobs = await db
    .select()
    .from(printJobsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(printJobsTable.createdAt));

  res.json(ListPrintJobsResponse.parse(jobs));
});

router.post("/print-jobs", async (req, res): Promise<void> => {
  const parsed = CreatePrintJobBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [filament] = await db.select().from(filamentsTable).where(eq(filamentsTable.id, parsed.data.filamentId));

  const [job] = await db.insert(printJobsTable).values({
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    filamentId: parsed.data.filamentId,
    filamentName: filament?.name ?? "",
    filamentColor: filament?.color ?? "",
    filamentColorHex: filament?.colorHex ?? null,
    quantity: parsed.data.quantity ?? 1,
    estimatedTime: parsed.data.estimatedTime ?? null,
    estimatedFilamentWeight: parsed.data.estimatedFilamentWeight ?? null,
    priority: parsed.data.priority ?? 5,
    scheduledFor: parsed.data.scheduledFor ? new Date(parsed.data.scheduledFor) : null,
    notes: parsed.data.notes ?? null,
  }).returning();

  res.status(201).json(GetPrintJobResponse.parse(job));
});

router.get("/print-jobs/:id", async (req, res): Promise<void> => {
  const params = GetPrintJobParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [job] = await db.select().from(printJobsTable).where(eq(printJobsTable.id, params.data.id));
  if (!job) {
    res.status(404).json({ error: "Print job not found" });
    return;
  }

  res.json(GetPrintJobResponse.parse(job));
});

router.patch("/print-jobs/:id", async (req, res): Promise<void> => {
  const params = UpdatePrintJobParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdatePrintJobBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (parsed.data.name != null) updates.name = parsed.data.name;
  if (parsed.data.description !== undefined) updates.description = parsed.data.description;
  if (parsed.data.status != null) updates.status = parsed.data.status;
  if (parsed.data.filamentId != null) {
    updates.filamentId = parsed.data.filamentId;
    const [filament] = await db.select().from(filamentsTable).where(eq(filamentsTable.id, parsed.data.filamentId));
    if (filament) {
      updates.filamentName = filament.name;
      updates.filamentColor = filament.color;
      updates.filamentColorHex = filament.colorHex;
    }
  }
  if (parsed.data.quantity != null) updates.quantity = parsed.data.quantity;
  if (parsed.data.completedQuantity != null) updates.completedQuantity = parsed.data.completedQuantity;
  if (parsed.data.estimatedTime !== undefined) updates.estimatedTime = parsed.data.estimatedTime;
  if (parsed.data.actualTime !== undefined) updates.actualTime = parsed.data.actualTime;
  if (parsed.data.estimatedFilamentWeight !== undefined) updates.estimatedFilamentWeight = parsed.data.estimatedFilamentWeight;
  if (parsed.data.actualFilamentWeight !== undefined) updates.actualFilamentWeight = parsed.data.actualFilamentWeight;
  if (parsed.data.priority != null) updates.priority = parsed.data.priority;
  if (parsed.data.scheduledFor !== undefined) updates.scheduledFor = parsed.data.scheduledFor ? new Date(parsed.data.scheduledFor) : null;
  if (parsed.data.startedAt !== undefined) updates.startedAt = parsed.data.startedAt ? new Date(parsed.data.startedAt) : null;
  if (parsed.data.completedAt !== undefined) updates.completedAt = parsed.data.completedAt ? new Date(parsed.data.completedAt) : null;
  if (parsed.data.notes !== undefined) updates.notes = parsed.data.notes;

  const [job] = await db.update(printJobsTable).set(updates).where(eq(printJobsTable.id, params.data.id)).returning();
  if (!job) {
    res.status(404).json({ error: "Print job not found" });
    return;
  }

  res.json(UpdatePrintJobResponse.parse(job));
});

router.delete("/print-jobs/:id", async (req, res): Promise<void> => {
  const params = DeletePrintJobParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [job] = await db.delete(printJobsTable).where(eq(printJobsTable.id, params.data.id)).returning();
  if (!job) {
    res.status(404).json({ error: "Print job not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
