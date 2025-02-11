import { type InsertOeeRecord } from "@shared/schema";

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateSampleData(numberOfRecords: number): InsertOeeRecord[] {
  const records: InsertOeeRecord[] = [];
  const now = new Date();

  // Start from 30 days ago
  const startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

  for (let i = 0; i < numberOfRecords; i++) {
    // Generate timestamp between startDate and now
    const timestamp = new Date(
      startDate.getTime() + Math.random() * (now.getTime() - startDate.getTime())
    );

    // Generate realistic production data
    const plannedProductionTime = 480; // 8 hours in minutes
    const actualProductionTime = randomInRange(420, 480); // Between 7-8 hours
    const idealCycleTime = 0.5; // 30 seconds per piece
    const totalPieces = randomInRange(750, 900); // Realistic production count
    const goodPieces = Math.floor(totalPieces * (randomInRange(85, 98) / 100)); // 85-98% quality rate

    records.push({
      startOfOrder: timestamp,
      productNumber: `PRD-${randomInRange(1000, 9999)}`,
      productionLine: `LINE-${randomInRange(1, 5)}`,
      plannedProductionTime,
      actualProductionTime,
      idealCycleTime,
      totalPieces,
      goodPieces
    });
  }

  // Sort by timestamp
  return records.sort((a, b) => 
    new Date(a.startOfOrder).getTime() - new Date(b.startOfOrder).getTime()
  );
}