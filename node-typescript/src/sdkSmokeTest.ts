import fs from "fs";
import path from "path";
import Worqhat from "worqhat";
import axios from "axios";
import FormData from "form-data";

type StepFn = () => Promise<any>;

function section(title: string) {
  console.log("\n=== " + title + " ===");
}

function logInput(input: any) {
  console.log(
    "INPUT:",
    typeof input === "object" ? JSON.stringify(input, null, 2) : input
  );
}

function logOutput(output: any) {
  console.log(
    "OUTPUT:",
    typeof output === "object" ? JSON.stringify(output, null, 2) : output
  );
}

function logError(stepName: string, err: any) {
  const errorObj = {
    message: err instanceof Error ? err.message : String(err),
    name: err?.name,
    status: err?.status,
    code: err?.code,
    full: err?.response?.data || err,
  };
  console.error(`[${stepName}] ERROR:`, JSON.stringify(errorObj, null, 2));
}

async function runStep(name: string, fn: StepFn) {
  section(name);
  try {
    await fn();
  } catch (err) {
    logError(name, err);
  }
}

async function main() {
  const apiKey = process.env.WORQHAT_API_KEY;
  if (!apiKey) {
    throw new Error("WORQHAT_API_KEY environment variable is required");
  }

  const FILE_WORKFLOW_ID = "fdd76a77-8906-403a-850c-d9eed906c47a";
  const JSON_WORKFLOW_ID = "81c88b6a-057a-44a9-8b4a-77755fb77e05";

  const client = new Worqhat({ apiKey });

  const invoicePath = path.resolve(__dirname, "../Invoice.pdf");
  if (!fs.existsSync(invoicePath)) {
    throw new Error(`Invoice file not found at ${invoicePath}`);
  }

  let uploadedFileId: string | undefined;
  let uploadedFileUrl: string | undefined;
  let uploadedFileName: string | undefined;

  const taskId = Math.floor(Date.now() / 1000);
  const nowIso = new Date().toISOString();

  await runStep("Storage: upload Invoice.pdf to invoices/", async () => {
    const form = new FormData();
    form.append("file", fs.createReadStream(invoicePath));
    form.append("path", "invoices/");
    logInput({ file: "[FileStream]", path: "invoices/" });

    const resp = await axios.post(
      "https://api.worqhat.com/storage/upload",
      form,
      {
        headers: { ...form.getHeaders(), Authorization: `Bearer ${apiKey}` },
      }
    );
    logOutput(resp.data);

    uploadedFileId = resp.data.file.id;
    uploadedFileUrl = resp.data.file.url;
    uploadedFileName = resp.data.file.filename || "Invoice.pdf";
    console.log(
      "Extracted: file.id =",
      uploadedFileId,
      "file.url =",
      uploadedFileUrl
    );
  });

  await runStep("Flows: triggerWithFile (local Invoice.pdf)", async () => {
    const fileStream = fs.createReadStream(invoicePath);
    const input = {
      workflowId: FILE_WORKFLOW_ID,
      file: "[FileStream]",
      prompt: "value1",
    };
    logInput(input);

    const res = await client.flows.triggerWithFile(FILE_WORKFLOW_ID, {
      file: fileStream,
      prompt: "value1",
    } as any);
    logOutput(res);

    console.log(
      "Extracted: success =",
      (res as any).success ?? true,
      "analytics_id =",
      (res as any).analytics_id ?? "n/a"
    );
  });

  await runStep(
    "Flows: triggerWithFile via URL (uploaded Invoice.pdf URL)",
    async () => {
      if (!uploadedFileUrl) throw new Error("No uploaded file URL available");

      const input = {
        workflowId: FILE_WORKFLOW_ID,
        url: uploadedFileUrl,
        prompt: "value1",
      };
      logInput(input);

      const res = await client.flows.triggerWithFile(FILE_WORKFLOW_ID, {
        url: uploadedFileUrl,
        prompt: "value1",
      } as any);
      logOutput(res);

      console.log(
        "Extracted: success =",
        (res as any).success ?? true,
        "analytics_id =",
        (res as any).analytics_id ?? "n/a"
      );
    }
  );

  await runStep("Flows: triggerWithPayload (JSON)", async () => {
    const input = { workflowId: JSON_WORKFLOW_ID, body: { prompt: "value1" } };
    logInput(input);

    const res = await client.flows.triggerWithPayload(JSON_WORKFLOW_ID, {
      body: { prompt: "value1" },
    } as any);
    logOutput(res);

    console.log(
      "Extracted: success =",
      (res as any).success ?? true,
      "analytics_id =",
      (res as any).analytics_id ?? "n/a"
    );
  });

  await runStep("DB: insert into tasks", async () => {
    const input = {
      table: "tasks",
      data: {
        id: taskId,
        status: "open",
        priority: "high",
        created_at: nowIso,
        updated_at: nowIso,
      },
    };
    logInput(input);

    const resp = await client.db.insertRecord(input);
    logOutput(resp);

    console.log("Extracted: count =", (resp as any).count);
  });

  await runStep("DB: SQL query by id", async () => {
    const input = {
      query: "SELECT * FROM tasks WHERE id = {id}",
      params: { id: taskId },
    };
    logInput(input);

    const resp = await client.db.executeQuery(input);
    logOutput(resp);

    console.log("Extracted: rows =", resp.data?.length ?? 0);
  });

  await runStep("DB: NL query (tasks)", async () => {
    const input = {
      question: `Show the task with id ${taskId}`,
      table: "tasks",
    };
    logInput(input);

    const resp = await client.db.processNlQuery(input);
    logOutput(resp);

    console.log("Extracted: nl.rows =", (resp.data as any[])?.length ?? 0);
    if ((resp as any).sql) console.log("Extracted: sql =", (resp as any).sql);
  });

  await runStep("Storage: fetch by ID", async () => {
    if (!uploadedFileId) throw new Error("No uploaded file ID available");

    const input = { fileId: uploadedFileId };
    logInput(input);

    const resp = await axios.get(
      `https://api.worqhat.com/storage/fetch/${uploadedFileId}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      }
    );
    logOutput(resp.data);

    console.log(
      "Extracted: filename =",
      resp.data.file.filename,
      "size =",
      resp.data.file.size
    );
  });

  await runStep("Storage: fetch by path (invoices/Invoice.pdf)", async () => {
    const relPath = `invoices/${uploadedFileName || "Invoice.pdf"}`;

    const input = { filepath: relPath };
    logInput(input);

    const resp = await axios.get(
      "https://api.worqhat.com/storage/fetch-by-path",
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        params: { filepath: relPath },
      }
    );
    logOutput(resp.data);

    console.log(
      "Extracted: filename =",
      resp.data.file.filename,
      "url =",
      resp.data.file.url
    );
  });

  await runStep("DB: delete inserted task (cleanup)", async () => {
    const input = {
      table: "tasks",
      where: { id: taskId },
    };
    logInput(input);

    const resp = await client.db.deleteRecords(input);
    logOutput(resp);

    console.log("Extracted: deletedCount =", (resp.data as any[])?.length ?? 0);
  });

  await runStep("Flows: metrics (default period)", async () => {
    const input = {}; // No input parameters for default metrics
    logInput(input);

    const resp = await axios.get("https://api.worqhat.com/flows/metrics", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    logOutput(resp.data);

    console.log(
      "Extracted: totalExecutions =",
      resp.data.metrics.totalExecutions,
      "successRate =",
      resp.data.metrics.successRate
    );
  });

  console.log("\nDone.");
}

main().catch((err) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error("Fatal:", msg);
  process.exit(1);
});
