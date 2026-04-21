import { Router, type IRouter } from "express";
import { db, clientsTable } from "@workspace/db";
import { eq, desc, and, ilike, or } from "drizzle-orm";
import {
  CreateClientBody,
  UpdateClientBody,
  UpdateClientParams,
  GetClientParams,
  DeleteClientParams,
  ListClientsResponse,
  GetClientResponse,
  UpdateClientResponse,
  ListClientsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/clients", async (req, res): Promise<void> => {
  const query = ListClientsQueryParams.safeParse(req.query);
  const conditions = [];

  if (query.success && query.data.type) {
    conditions.push(eq(clientsTable.type, query.data.type));
  }
  if (query.success && query.data.search) {
    conditions.push(or(
      ilike(clientsTable.name, `%${query.data.search}%`),
      ilike(clientsTable.email, `%${query.data.search}%`)
    )!);
  }

  const clients = await db
    .select()
    .from(clientsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(clientsTable.createdAt));

  res.json(ListClientsResponse.parse(clients));
});

router.post("/clients", async (req, res): Promise<void> => {
  const parsed = CreateClientBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [client] = await db.insert(clientsTable).values({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    type: parsed.data.type ?? "INDIVIDUAL",
    companyName: parsed.data.companyName ?? null,
    taxId: parsed.data.taxId ?? null,
    notes: parsed.data.notes ?? null,
  }).returning();

  res.status(201).json(GetClientResponse.parse(client));
});

router.get("/clients/:id", async (req, res): Promise<void> => {
  const params = GetClientParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [client] = await db.select().from(clientsTable).where(eq(clientsTable.id, params.data.id));
  if (!client) {
    res.status(404).json({ error: "Client not found" });
    return;
  }

  res.json(GetClientResponse.parse(client));
});

router.patch("/clients/:id", async (req, res): Promise<void> => {
  const params = UpdateClientParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateClientBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (parsed.data.name != null) updates.name = parsed.data.name;
  if (parsed.data.email != null) updates.email = parsed.data.email;
  if (parsed.data.phone !== undefined) updates.phone = parsed.data.phone;
  if (parsed.data.type != null) updates.type = parsed.data.type;
  if (parsed.data.companyName !== undefined) updates.companyName = parsed.data.companyName;
  if (parsed.data.taxId !== undefined) updates.taxId = parsed.data.taxId;
  if (parsed.data.notes !== undefined) updates.notes = parsed.data.notes;

  const [client] = await db.update(clientsTable).set(updates).where(eq(clientsTable.id, params.data.id)).returning();
  if (!client) {
    res.status(404).json({ error: "Client not found" });
    return;
  }

  res.json(UpdateClientResponse.parse(client));
});

router.delete("/clients/:id", async (req, res): Promise<void> => {
  const params = DeleteClientParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [client] = await db.delete(clientsTable).where(eq(clientsTable.id, params.data.id)).returning();
  if (!client) {
    res.status(404).json({ error: "Client not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
