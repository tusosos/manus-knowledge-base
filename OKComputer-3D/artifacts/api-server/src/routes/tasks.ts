import { Router, type IRouter } from "express";
import { db, tasksTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import {
  CreateTaskBody,
  UpdateTaskBody,
  UpdateTaskParams,
  GetTaskParams,
  DeleteTaskParams,
  ListTasksResponse,
  GetTaskResponse,
  UpdateTaskResponse,
  ListTasksQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/tasks", async (req, res): Promise<void> => {
  const query = ListTasksQueryParams.safeParse(req.query);
  const conditions = [];

  if (query.success && query.data.status) {
    conditions.push(eq(tasksTable.status, query.data.status));
  }
  if (query.success && query.data.priority) {
    conditions.push(eq(tasksTable.priority, query.data.priority));
  }
  if (query.success && query.data.projectId) {
    conditions.push(eq(tasksTable.projectId, query.data.projectId));
  }

  const tasks = await db
    .select()
    .from(tasksTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(tasksTable.createdAt));

  res.json(ListTasksResponse.parse(tasks));
});

router.post("/tasks", async (req, res): Promise<void> => {
  const parsed = CreateTaskBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [task] = await db.insert(tasksTable).values({
    title: parsed.data.title,
    description: parsed.data.description ?? null,
    status: parsed.data.status ?? "TODO",
    priority: parsed.data.priority ?? "MEDIUM",
    dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
    projectId: parsed.data.projectId ?? null,
    tags: (parsed.data.tags ?? []) as string[],
  }).returning();

  res.status(201).json(GetTaskResponse.parse(task));
});

router.get("/tasks/:id", async (req, res): Promise<void> => {
  const params = GetTaskParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [task] = await db.select().from(tasksTable).where(eq(tasksTable.id, params.data.id));
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  res.json(GetTaskResponse.parse(task));
});

router.patch("/tasks/:id", async (req, res): Promise<void> => {
  const params = UpdateTaskParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateTaskBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (parsed.data.title != null) updates.title = parsed.data.title;
  if (parsed.data.description !== undefined) updates.description = parsed.data.description;
  if (parsed.data.status != null) updates.status = parsed.data.status;
  if (parsed.data.priority != null) updates.priority = parsed.data.priority;
  if (parsed.data.dueDate !== undefined) updates.dueDate = parsed.data.dueDate ? new Date(parsed.data.dueDate) : null;
  if (parsed.data.projectId !== undefined) updates.projectId = parsed.data.projectId;
  if (parsed.data.tags != null) updates.tags = parsed.data.tags;

  const [task] = await db.update(tasksTable).set(updates).where(eq(tasksTable.id, params.data.id)).returning();
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  res.json(UpdateTaskResponse.parse(task));
});

router.delete("/tasks/:id", async (req, res): Promise<void> => {
  const params = DeleteTaskParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [task] = await db.delete(tasksTable).where(eq(tasksTable.id, params.data.id)).returning();
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
