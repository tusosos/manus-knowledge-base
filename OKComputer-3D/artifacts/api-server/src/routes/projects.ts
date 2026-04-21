import { Router, type IRouter } from "express";
import { db, projectsTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import {
  CreateProjectBody,
  UpdateProjectBody,
  UpdateProjectParams,
  GetProjectParams,
  DeleteProjectParams,
  ListProjectsResponse,
  GetProjectResponse,
  UpdateProjectResponse,
  ListProjectsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/projects", async (req, res): Promise<void> => {
  const query = ListProjectsQueryParams.safeParse(req.query);
  const conditions = [];

  if (query.success && query.data.status) {
    conditions.push(eq(projectsTable.status, query.data.status));
  }
  if (query.success && query.data.clientId) {
    conditions.push(eq(projectsTable.clientId, query.data.clientId));
  }

  const projects = await db
    .select()
    .from(projectsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(projectsTable.createdAt));

  res.json(ListProjectsResponse.parse(projects));
});

router.post("/projects", async (req, res): Promise<void> => {
  const parsed = CreateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [project] = await db.insert(projectsTable).values({
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    status: parsed.data.status ?? "DRAFT",
    priority: parsed.data.priority ?? "MEDIUM",
    clientId: parsed.data.clientId ?? null,
    budget: parsed.data.budget ?? null,
    startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
    deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : null,
    tags: (parsed.data.tags ?? []) as string[],
  }).returning();

  res.status(201).json(GetProjectResponse.parse(project));
});

router.get("/projects/:id", async (req, res): Promise<void> => {
  const params = GetProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, params.data.id));
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  res.json(GetProjectResponse.parse(project));
});

router.patch("/projects/:id", async (req, res): Promise<void> => {
  const params = UpdateProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (parsed.data.name != null) updates.name = parsed.data.name;
  if (parsed.data.description !== undefined) updates.description = parsed.data.description;
  if (parsed.data.status != null) updates.status = parsed.data.status;
  if (parsed.data.priority != null) updates.priority = parsed.data.priority;
  if (parsed.data.clientId !== undefined) updates.clientId = parsed.data.clientId;
  if (parsed.data.budget !== undefined) updates.budget = parsed.data.budget;
  if (parsed.data.progress != null) updates.progress = parsed.data.progress;
  if (parsed.data.startDate !== undefined) updates.startDate = parsed.data.startDate ? new Date(parsed.data.startDate) : null;
  if (parsed.data.deadline !== undefined) updates.deadline = parsed.data.deadline ? new Date(parsed.data.deadline) : null;
  if (parsed.data.tags != null) updates.tags = parsed.data.tags;

  const [project] = await db.update(projectsTable).set(updates).where(eq(projectsTable.id, params.data.id)).returning();
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  res.json(UpdateProjectResponse.parse(project));
});

router.delete("/projects/:id", async (req, res): Promise<void> => {
  const params = DeleteProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [project] = await db.delete(projectsTable).where(eq(projectsTable.id, params.data.id)).returning();
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
