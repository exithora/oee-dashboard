import { oeeRecords, type OeeRecord, type InsertOeeRecord, type TimeRange } from "@shared/schema";

export interface IStorage {
  insertOeeRecord(record: InsertOeeRecord): Promise<OeeRecord>;
  getOeeRecords(timeRange: TimeRange): Promise<OeeRecord[]>;
  getLatestOeeRecord(): Promise<OeeRecord | undefined>;
}

export class MemStorage implements IStorage {
  private records: Map<number, OeeRecord>;
  private currentId: number;

  constructor() {
    this.records = new Map();
    this.currentId = 1;
  }

  async insertOeeRecord(record: InsertOeeRecord): Promise<OeeRecord> {
    const id = this.currentId++;
    const timestamp = new Date();
    const oeeRecord: OeeRecord = { ...record, id, timestamp };
    this.records.set(id, oeeRecord);
    return oeeRecord;
  }

  async getOeeRecords(timeRange: TimeRange): Promise<OeeRecord[]> {
    const start = new Date(timeRange.start);
    const end = new Date(timeRange.end);
    
    return Array.from(this.records.values()).filter(record => 
      record.timestamp >= start && record.timestamp <= end
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async getLatestOeeRecord(): Promise<OeeRecord | undefined> {
    const records = Array.from(this.records.values());
    if (records.length === 0) return undefined;
    
    return records.reduce((latest, current) => 
      current.timestamp > latest.timestamp ? current : latest
    );
  }
}

export const storage = new MemStorage();
