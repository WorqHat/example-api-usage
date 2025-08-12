import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { requireKey } from './client';
import { checkStatus } from './endpoints/status';
import { checkHealth } from './endpoints/health';
import { dbQuery } from './endpoints/dbQuery';
import { dbInsert } from './endpoints/dbInsert';
import { dbUpdate } from './endpoints/dbUpdate';
import { dbDelete } from './endpoints/dbDelete';
import { dbNlQuery } from './endpoints/dbNlQuery';
import { triggerFlowJson } from './endpoints/flowsTriggerJson';
import { getFlowsMetrics } from './endpoints/flowsMetrics';
import { triggerFlowWithFile, triggerFlowWithUrl } from './endpoints/flowsFile';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

// Simple middleware to log and ensure API key when required
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] GET ${req.path}`);
  next();
});

// Root status check (calls remote '/')
app.get('/', async (_req: Request, res: Response) => {
  try {
    await checkStatus();
    res.send('Status checked. See server logs for response.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error checking status');
  }
});

// Health check (calls remote '/health')
app.get('/health', async (_req: Request, res: Response) => {
  try {
    await checkHealth();
    res.send('Health checked. See server logs for response.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error checking health');
  }
});

// DB: SQL query
app.get('/db/query', async (_req: Request, res: Response) => {
  try {
    requireKey();
    await dbQuery('SELECT * FROM my_table', 10, 0);
    res.send('dbQuery executed. See server logs for response.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error executing dbQuery');
  }
});

// DB: Insert
app.get('/db/insert', async (_req: Request, res: Response) => {
  try {
    requireKey();
    await dbInsert('my_table', { id: 1, name: 'Alice' });
    res.send('dbInsert executed. See server logs for response.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error executing dbInsert');
  }
});

// DB: Update
app.get('/db/update', async (_req: Request, res: Response) => {
  try {
    requireKey();
    await dbUpdate('my_table', { id: 1 }, { name: 'Bob' });
    res.send('dbUpdate executed. See server logs for response.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error executing dbUpdate');
  }
});

// DB: Delete
app.get('/db/delete', async (_req: Request, res: Response) => {
  try {
    requireKey();
    await dbDelete('my_table', { id: 1 });
    res.send('dbDelete executed. See server logs for response.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error executing dbDelete');
  }
});

// DB: Natural language query
app.get('/db/nl-query', async (_req: Request, res: Response) => {
  try {
    requireKey();
    await dbNlQuery('How many rows are in my_table?', 'my_table');
    res.send('dbNlQuery executed. See server logs for response.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error executing dbNlQuery');
  }
});

// Flows: Trigger JSON
app.get('/flows/trigger-json', async (_req: Request, res: Response) => {
  try {
    requireKey();
    await triggerFlowJson('demo-flow-id', { message: 'Hello from demo route' });
    res.send('triggerFlowJson executed. See server logs for response.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error triggering flow (JSON)');
  }
});

// Flows: Metrics
app.get('/flows/metrics', async (_req: Request, res: Response) => {
  try {
    requireKey();
    await getFlowsMetrics({ status: 'completed' });
    res.send('getFlowsMetrics executed. See server logs for response.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching flows metrics');
  }
});

// Flows: Trigger with URL (no local file dependency)
app.get('/flows/file-url', async (_req: Request, res: Response) => {
  try {
    requireKey();
    await triggerFlowWithUrl('demo-flow-id', 'https://example.com/image.jpg', { note: 'demo via url' });
    res.send('triggerFlowWithUrl executed. See server logs for response.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error triggering flow with URL');
  }
});

// Flows: Trigger with file (uses repo README as a demo file)
app.get('/flows/file-upload', async (_req: Request, res: Response) => {
  try {
    requireKey();
    await triggerFlowWithFile('demo-flow-id', `${process.cwd()}/README.md`, { note: 'demo file upload' });
    res.send('triggerFlowWithFile executed. See server logs for response.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error triggering flow with file');
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
