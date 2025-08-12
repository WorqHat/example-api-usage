# Node TypeScript — WorqHat SDK

Scaffold for WorqHat API examples using the official WorqHat SDK for Node/TypeScript.

## Setup
- Copy `.env.example` to `.env` and set values
  ```bash
  cp .env.example .env
  # set API_KEY=your_key
  ```
- Install dependencies
  ```bash
  npm install
  ```

## Development
- Run the app (executes `src/index.ts`):
  ```bash
  npm run dev
  ```
- Add endpoint scripts under `src/endpoints/` or `src/routes/` and import them from `src/index.ts`.

## Provided utilities
- `src/client.ts` exports a pre-configured WorqHat SDK client reading `API_KEY` (and optionally `API_URL` if set).

## Example routes (parity with Python FastAPI demo)
- Status and Health
  - `checkStatus()` calls `client.getServerInfo()`
  - `checkHealth()` calls `client.health.check()`
- Database
  - `dbQuery()` → `client.db.executeQuery(...)`
  - `dbInsert()` → `client.db.insertRecord(...)`
  - `dbUpdate()` → `client.db.updateRecords(...)`
  - `dbDelete()` → `client.db.deleteRecords(...)`
  - `dbNlQuery()` → `client.db.processNlQuery(...)`
- Flows
  - `triggerFlowJson()` → `client.flows.triggerWithPayload(...)`
  - `getFlowsMetrics()` → `client.flows.getMetrics(...)`
  - `triggerFlowWithFile()` / `triggerFlowWithUrl()` → `client.flows.triggerWithFile(...)`

See `src/index.ts` for how these are wired for local execution during development.
