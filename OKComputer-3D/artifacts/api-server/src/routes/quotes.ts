import { Router, type IRouter } from "express";
import { db, quotesTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import {
  CreateQuoteBody,
  UpdateQuoteBody,
  UpdateQuoteParams,
  GetQuoteParams,
  DeleteQuoteParams,
  ListQuotesResponse,
  GetQuoteResponse,
  UpdateQuoteResponse,
  ListQuotesQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function calcTotal(items: Array<{ quantity: number; unitPrice: number }>) {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

function buildItems(rawItems: Array<{ description: string; quantity: number; unitPrice: number }>) {
  return rawItems.map((item, idx) => ({
    id: crypto.randomUUID(),
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    total: item.quantity * item.unitPrice,
  }));
}

router.get("/quotes", async (req, res): Promise<void> => {
  const query = ListQuotesQueryParams.safeParse(req.query);
  const conditions = [];

  if (query.success && query.data.status) {
    conditions.push(eq(quotesTable.status, query.data.status));
  }
  if (query.success && query.data.clientId) {
    conditions.push(eq(quotesTable.clientId, query.data.clientId));
  }

  const quotes = await db
    .select()
    .from(quotesTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(quotesTable.createdAt));

  res.json(ListQuotesResponse.parse(quotes.map(q => ({ ...q, items: (q.items as unknown[]) ?? [] }))));
});

router.post("/quotes", async (req, res): Promise<void> => {
  const parsed = CreateQuoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const rawItems = (parsed.data.items ?? []) as Array<{ description: string; quantity: number; unitPrice: number }>;
  const items = buildItems(rawItems);
  const totalAmount = calcTotal(rawItems);

  const [quote] = await db.insert(quotesTable).values({
    title: parsed.data.title,
    clientId: parsed.data.clientId ?? null,
    clientName: null,
    projectId: parsed.data.projectId ?? null,
    totalAmount,
    validUntil: parsed.data.validUntil ? new Date(parsed.data.validUntil) : null,
    notes: parsed.data.notes ?? null,
    items,
  }).returning();

  res.status(201).json(GetQuoteResponse.parse({ ...quote, items: (quote.items as unknown[]) ?? [] }));
});

router.get("/quotes/:id", async (req, res): Promise<void> => {
  const params = GetQuoteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [quote] = await db.select().from(quotesTable).where(eq(quotesTable.id, params.data.id));
  if (!quote) {
    res.status(404).json({ error: "Quote not found" });
    return;
  }

  res.json(GetQuoteResponse.parse({ ...quote, items: (quote.items as unknown[]) ?? [] }));
});

router.patch("/quotes/:id", async (req, res): Promise<void> => {
  const params = UpdateQuoteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateQuoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (parsed.data.title != null) updates.title = parsed.data.title;
  if (parsed.data.status != null) updates.status = parsed.data.status;
  if (parsed.data.clientId !== undefined) updates.clientId = parsed.data.clientId;
  if (parsed.data.projectId !== undefined) updates.projectId = parsed.data.projectId;
  if (parsed.data.validUntil !== undefined) updates.validUntil = parsed.data.validUntil ? new Date(parsed.data.validUntil) : null;
  if (parsed.data.notes !== undefined) updates.notes = parsed.data.notes;
  if (parsed.data.items != null) {
    const rawItems = parsed.data.items as Array<{ description: string; quantity: number; unitPrice: number }>;
    updates.items = buildItems(rawItems);
    updates.totalAmount = calcTotal(rawItems);
  }

  const [quote] = await db.update(quotesTable).set(updates).where(eq(quotesTable.id, params.data.id)).returning();
  if (!quote) {
    res.status(404).json({ error: "Quote not found" });
    return;
  }

  res.json(UpdateQuoteResponse.parse({ ...quote, items: (quote.items as unknown[]) ?? [] }));
});

router.delete("/quotes/:id", async (req, res): Promise<void> => {
  const params = DeleteQuoteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [quote] = await db.delete(quotesTable).where(eq(quotesTable.id, params.data.id)).returning();
  if (!quote) {
    res.status(404).json({ error: "Quote not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
