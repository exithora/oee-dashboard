import { pgTable, text, serial, integer, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const oeeRecords = pgTable("oee_records", {
  id: serial("id").primaryKey(),
  startOfOrder: timestamp("start_of_order").notNull().defaultNow(),
  plannedProductionTime: integer("planned_production_time").notNull(),
  actualProductionTime: integer("actual_production_time").notNull(),
  idealCycleTime: real("ideal_cycle_time").notNull(),
  totalPieces: integer("total_pieces").notNull(),
  goodPieces: integer("good_pieces").notNull(),
});

export const insertOeeRecordSchema = createInsertSchema(oeeRecords).omit({
  id: true
});

export const timeRangeSchema = z.object({
  start: z.string(),
  end: z.string(),
  frequency: z.enum(["hour", "day", "week", "month"])
});

export type InsertOeeRecord = z.infer<typeof insertOeeRecordSchema>;
export type OeeRecord = typeof oeeRecords.$inferSelect;
export type TimeRange = z.infer<typeof timeRangeSchema>;

// Helper functions for OEE calculations
export function calculateAvailability(planned: number, actual: number): number {
  return (actual / planned) * 100;
}

export function calculatePerformance(
  actualTime: number,
  idealCycleTime: number,
  totalPieces: number
): number {
  const theoreticalTime = idealCycleTime * totalPieces;
  return (theoreticalTime / actualTime) * 100;
}

export function calculateQuality(total: number, good: number): number {
  return (good / total) * 100;
}

export function calculateOEE(
  availability: number,
  performance: number,
  quality: number
): number {
  return (availability * performance * quality) / 10000;
}