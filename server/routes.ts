import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOeeRecordSchema, timeRangeSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  // OEE Record endpoints
  app.post("/api/oee-records", async (req, res) => {
    try {
      const record = insertOeeRecordSchema.parse(req.body);
      const result = await storage.insertOeeRecord(record);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid OEE record data" });
    }
  });

  app.get("/api/oee-records", async (req, res) => {
    try {
      const timeRange = timeRangeSchema.parse({
        start: req.query.start,
        end: req.query.end,
        frequency: req.query.frequency
      });
      const records = await storage.getOeeRecords(timeRange);
      res.json(records);
    } catch (error) {
      res.status(400).json({ error: "Invalid time range parameters" });
    }
  });

  app.get("/api/oee-records/latest", async (_req, res) => {
    const record = await storage.getLatestOeeRecord();
    if (!record) {
      res.status(404).json({ error: "No OEE records found" });
      return;
    }
    res.json(record);
  });

  const httpServer = createServer(app);
  return httpServer;
}
