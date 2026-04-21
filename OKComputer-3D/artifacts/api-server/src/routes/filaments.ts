import { Router, type IRouter } from "express";
import { db, filamentsTable } from "@workspace/db";
import { eq, desc, and, sql } from "drizzle-orm";
import {
  CreateFilamentBody,
  UpdateFilamentBody,
  UpdateFilamentParams,
  GetFilamentParams,
  DeleteFilamentParams,
  ListFilamentsResponse,
  GetFilamentResponse,
  UpdateFilamentResponse,
  ListFilamentsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function toFilamentResponse(f: typeof filamentsTable.$inferSelect) {
  return {
    ...f,
    isLowStock: f.stockWeight <= f.lowStockThreshold,
  };
}

router.get("/filaments", async (req, res): Promise<void> => {
  const query = ListFilamentsQueryParams.safeParse(req.query);
  const conditions = [];

  if (query.success && query.data.type) {
    conditions.push(eq(filamentsTable.type, query.data.type));
  }
  if (query.success && query.data.brand) {
    conditions.push(eq(filamentsTable.brand, query.data.brand));
  }
  if (query.success && query.data.lowStock === true) {
    conditions.push(sql`${filamentsTable.stockWeight} <= ${filamentsTable.lowStockThreshold}`);
  }

  const filaments = await db
    .select()
    .from(filamentsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(filamentsTable.createdAt));

  res.json(ListFilamentsResponse.parse(filaments.map(toFilamentResponse)));
});

router.post("/filaments", async (req, res): Promise<void> => {
  const parsed = CreateFilamentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [filament] = await db.insert(filamentsTable).values({
    name: parsed.data.name,
    brand: parsed.data.brand,
    type: parsed.data.type,
    color: parsed.data.color,
    colorHex: parsed.data.colorHex ?? null,
    stockWeight: parsed.data.stockWeight,
    totalWeight: parsed.data.totalWeight,
    lowStockThreshold: parsed.data.lowStockThreshold ?? 200,
    pricePerKg: parsed.data.pricePerKg,
    nozzleTemp: parsed.data.nozzleTemp ?? null,
    bedTemp: parsed.data.bedTemp ?? null,
    location: parsed.data.location ?? null,
    notes: parsed.data.notes ?? null,
  }).returning();

  res.status(201).json(GetFilamentResponse.parse(toFilamentResponse(filament)));
});

router.get("/filaments/:id", async (req, res): Promise<void> => {
  const params = GetFilamentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [filament] = await db.select().from(filamentsTable).where(eq(filamentsTable.id, params.data.id));
  if (!filament) {
    res.status(404).json({ error: "Filament not found" });
    return;
  }

  res.json(GetFilamentResponse.parse(toFilamentResponse(filament)));
});

router.patch("/filaments/:id", async (req, res): Promise<void> => {
  const params = UpdateFilamentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateFilamentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (parsed.data.name != null) updates.name = parsed.data.name;
  if (parsed.data.brand != null) updates.brand = parsed.data.brand;
  if (parsed.data.type != null) updates.type = parsed.data.type;
  if (parsed.data.color != null) updates.color = parsed.data.color;
  if (parsed.data.colorHex !== undefined) updates.colorHex = parsed.data.colorHex;
  if (parsed.data.stockWeight != null) updates.stockWeight = parsed.data.stockWeight;
  if (parsed.data.totalWeight != null) updates.totalWeight = parsed.data.totalWeight;
  if (parsed.data.lowStockThreshold != null) updates.lowStockThreshold = parsed.data.lowStockThreshold;
  if (parsed.data.pricePerKg != null) updates.pricePerKg = parsed.data.pricePerKg;
  if (parsed.data.nozzleTemp !== undefined) updates.nozzleTemp = parsed.data.nozzleTemp;
  if (parsed.data.bedTemp !== undefined) updates.bedTemp = parsed.data.bedTemp;
  if (parsed.data.isActive != null) updates.isActive = parsed.data.isActive;
  if (parsed.data.location !== undefined) updates.location = parsed.data.location;
  if (parsed.data.notes !== undefined) updates.notes = parsed.data.notes;

  const [filament] = await db.update(filamentsTable).set(updates).where(eq(filamentsTable.id, params.data.id)).returning();
  if (!filament) {
    res.status(404).json({ error: "Filament not found" });
    return;
  }

  res.json(UpdateFilamentResponse.parse(toFilamentResponse(filament)));
});

router.delete("/filaments/:id", async (req, res): Promise<void> => {
  const params = DeleteFilamentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [filament] = await db.delete(filamentsTable).where(eq(filamentsTable.id, params.data.id)).returning();
  if (!filament) {
    res.status(404).json({ error: "Filament not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
