import { pgTable, text, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const printJobsTable = pgTable("print_jobs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("QUEUED"),
  filamentId: text("filament_id").notNull(),
  filamentName: text("filament_name").notNull().default(""),
  filamentColor: text("filament_color").notNull().default(""),
  filamentColorHex: text("filament_color_hex"),
  quantity: integer("quantity").notNull().default(1),
  completedQuantity: integer("completed_quantity").notNull().default(0),
  estimatedTime: integer("estimated_time"),
  actualTime: integer("actual_time"),
  estimatedFilamentWeight: real("estimated_filament_weight"),
  actualFilamentWeight: real("actual_filament_weight"),
  priority: integer("priority").notNull().default(5),
  scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertPrintJobSchema = createInsertSchema(printJobsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPrintJob = z.infer<typeof insertPrintJobSchema>;
export type PrintJob = typeof printJobsTable.$inferSelect;
