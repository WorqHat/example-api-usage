## WorqHat Endpoint Playground

Next.js + App Router UI that reads request definitions from JSON and runs live WorqHat API calls. Requests are hard-coded (from JSON), responses are always fetched in real time—no mock data unless you omit your API key.

---

## 1. Running locally

```bash
cd next-endpoint-ui
npm install
npm run dev
# http://localhost:3000
```

Without `WORQHAT_API_KEY`, the UI still renders but `/api/run` will fall back to any `mockResponse` defined per endpoint (purely informational).

---

## 2. Adding or editing endpoints

All request metadata lives in `data/endpoints.json`. Each entry matches the `EndpointDefinition` type:

```ts
type EndpointDefinition = {
  id: string;                 // unique identifier, used as key
  name: string;               // display name
  method: "GET" | "POST" | ...;
  path: string;               // relative path, e.g. "/db/insert"
  category: "system" | "database" | "workflows" | "storage";
  summary: string;            // short description
  requestApiCode: string;     // shown under “Test via API”
  requestSdkCode: string;     // shown under “Test via SDK”
  samplePayload?: object;     // body sent when hitting the real API (optional)
  mockResponse?: unknown;     // optional fallback when no API key is configured
};
```

### Step-by-step
1. Open `data/endpoints.json`.
2. Append a new object with the fields above. Keep JSON valid (double quotes, commas).
3. If the endpoint requires a body, set `samplePayload` exactly like you’d POST it.
4. Provide `requestApiCode` / `requestSdkCode` strings—these show up verbatim inside the code panel tabs.
5. (Optional) `mockResponse` is only used when no API key is set; omit it if you don’t want any fallback.

Example entry:
```json
{
  "id": "flows-trigger-json",
  "name": "Flows: Trigger JSON",
  "method": "POST",
  "path": "/flows/trigger-json",
  "category": "workflows",
  "summary": "Kick off a workflow run by posting JSON input.",
  "requestApiCode": "const res = await fetch(\"https://api.worqhat.com/flows/trigger-json\", {...});",
  "requestSdkCode": "const run = await client.flows.triggerJson({ ... });",
  "samplePayload": {
    "flowId": "example-flow-id",
    "input": { "firstName": "Ada" }
  }
}
```

> **Note:** `requestApiCode` / `requestSdkCode` are informational only. The actual live HTTP call uses `method`, `path`, and `samplePayload`.

---

## 3. Live responses

- `src/app/api/run/route.ts` handles all “Test” executions.
- When you click/ switch endpoints, the frontend calls `/api/run` with the endpoint `id`.
- The server route:
  1. Looks up the entry in `endpoints.json`.
  2. Builds the URL: `{WORQHAT_API_BASE_URL}{path}`.
  3. Sends a real HTTP request using `method` and `samplePayload`.
  4. Streams the JSON/text response back to the UI.
- Therefore responses are **never** hard-coded. They always reflect the live WorqHat API (unless you removed the API key; then you’ll see `mockResponse` so the UI isn’t empty).

---

## 4. Extending behavior

| Task | File(s) |
| ---- | ------- |
| Update branding/layout | `src/components/*`, `src/app/globals.css` |
| Change endpoint schema | `src/types/endpoints.ts` |
| Adjust fetch logic | `src/app/api/run/route.ts` |

Feel free to edit the JSON structure if you need more fields—just update the `EndpointDefinition` type and UI components accordingly.
