import express from "express";
import type { Request, Response, NextFunction } from "express";
import { checkStatus } from "./endpoints/status";
import { checkHealth } from "./endpoints/health";
import { dbQuery } from "./endpoints/dbQuery";
import { dbInsert } from "./endpoints/dbInsert";
import { dbUpdate } from "./endpoints/dbUpdate";
import { dbDelete } from "./endpoints/dbDelete";
import { dbNlQuery } from "./endpoints/dbNlQuery";
import { triggerFlowJson } from "./endpoints/flowsTriggerJson";
import { getFlowsMetrics } from "./endpoints/flowsMetrics";
import { triggerFlowWithFile } from "./endpoints/flowsFile";
import { storage } from "./endpoints/storage";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

// Simple middleware to log and ensure API key when required
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] GET ${req.path}`);
  next();
});

// Root status check (calls remote '/status')
app.get("/status", async (_req: Request, res: Response) => {
  try {
    await checkStatus();
    res.send("Status checked. See server logs for response.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error checking status");
  }
});

// Health check (calls remote '/health')
app.get("/health", async (_req: Request, res: Response) => {
  try {
    await checkHealth();
    res.send("Health checked. See server logs for response.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error checking health");
  }
});

// DB: SQL query
app.get("/db/query", async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.query.id as string) || 1; // Default to 1 if not provided
    await dbQuery(taskId);
    res.send("dbQuery executed. See server logs for response.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error executing dbQuery");
  }
});

// DB: Insert
app.get("/db/insert", async (_req: Request, res: Response) => {
  try {
    await dbInsert();
    res.send("dbInsert executed. See server logs for response.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error executing dbInsert");
  }
});

// DB: Update
app.get("/db/update", async (_req: Request, res: Response) => {
  try {
    await dbUpdate();
    res.send("dbUpdate executed. See server logs for response.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error executing dbUpdate");
  }
});

// DB: Delete
app.get("/db/delete", async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.query.id as string) || 1; // Default to 1 if not provided
    await dbDelete(taskId);
    res.send("dbDelete executed. See server logs for response.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error executing dbDelete");
  }
});

// DB: Natural language query
app.get("/db/nl-query", async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.query.id as string) || 1; // Default to 1 if not provided
    await dbNlQuery(taskId);
    res.send("dbNlQuery executed. See server logs for response.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error executing dbNlQuery");
  }
});

// Flows: Trigger JSON
app.get("/flows/trigger-json", async (_req: Request, res: Response) => {
  try {
    await triggerFlowJson();
    res.send("triggerFlowJson executed. See server logs for response.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error triggering flow (JSON)");
  }
});

// Flows: Metrics
app.get("/flows/metrics", async (_req: Request, res: Response) => {
  try {
    await getFlowsMetrics();
    res.send("getFlowsMetrics executed. See server logs for response.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching flows metrics");
  }
});

// Flows: Trigger with file (uses Invoice.pdf)
app.get("/flows/file-upload", async (req: Request, res: Response) => {
  try {
    const url = req.query.url as string; // Optional URL parameter
    await triggerFlowWithFile(url);
    res.send("triggerFlowWithFile executed. See server logs for response.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error triggering flow with file");
  }
});

// Storage operations
app.get("/storage/upload", async (_req: Request, res: Response) => {
  try {
    await storage();
    res.send("Storage operations executed. See server logs for response.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error with storage operations");
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
