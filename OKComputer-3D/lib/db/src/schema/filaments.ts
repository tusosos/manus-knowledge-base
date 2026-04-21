import { pgTable, text, real, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const filamentsTable = pgTable("filaments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  type: text("type").notNull(),
  color: text("color").notNull(),
  colorHex: text("color_hex"),
  stockWeight: real("stock_weight").notNull().default(0),
  totalWeight: real("total_weight").notNull().default(1000),
  lowStockThreshold: real("low_stock_threshold").notNull().default(200),
  pricePerKg: real("price_per_kg").notNull().default(0),
  nozzleTemp: integer("nozzle_temp"),
  bedTemp: integer("bed_temp"),
  isActive: boolean("is_active").notNull().default(true),
  location: text("location"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertFilamentSchema = createInsertSchema(filamentsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertFilament = z.infer<typeof insertFilamentSchema>;
export type Filament = typeof filamentsTable.$inferSelect;
