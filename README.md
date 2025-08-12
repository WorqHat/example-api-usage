# WorqHat API Examples — Monorepo

This repository contains multiple ways to interact with the WorqHat API:

- Node TypeScript client using Axios (`node-typescript/`)
- Python FastAPI server using the official `worqhat` SDK (`python/`)
- Pure REST cURL scripts (`rest-api/`)

Each approach demonstrates identical capabilities: status/health checks, database operations, and workflows (flows) with JSON, file upload, and URL triggers.

## Repository structure
- `node-typescript/` — Express/TypeScript example with endpoint scripts and a pre-configured Axios client.
- `python/` — FastAPI app mirroring the Node routes, using the official `worqhat` PyPI package.
- `rest-api/` — cURL scripts calling WorqHat endpoints directly.

## Requirements
- A WorqHat API key. Keep it in a local `.env` file and never commit secrets.

## Quick start
- Node TypeScript: see `node-typescript/README.md`
- Python (FastAPI): see `python/README.md`
- REST cURL: see `rest-api/README.md`

## Routes matrix
| Feature | Node TypeScript (SDK) | Python FastAPI (SDK) | REST cURL (HTTP) |
|---|---|---|---|
| Server status | `checkStatus()` | GET `/status` | `rest-api/check-status.sh` |
| Health check | `checkHealth()` | GET `/health` | `rest-api/health.sh` |
| DB: query | `dbQuery()` | GET `/db/query` | `rest-api/db-query.sh` |
| DB: insert | `dbInsert()` | GET `/db/insert` | `rest-api/db-insert.sh` |
| DB: update | `dbUpdate()` | GET `/db/update` | `rest-api/db-update.sh` |
| DB: delete | `dbDelete()` | GET `/db/delete` | `rest-api/db-delete.sh` |
| DB: NL query | `dbNlQuery()` | GET `/db/nl-query` | `rest-api/db-nl-query.sh` |
| Flows: trigger JSON | `triggerFlowJson()` | GET `/flows/trigger-json` | `rest-api/flows-trigger-json.sh` |
| Flows: metrics | `getFlowsMetrics()` | GET `/flows/metrics` | `rest-api/flows-metrics.sh` |
| Flows: file URL | `triggerFlowWithUrl()` | GET `/flows/file-url` | `rest-api/flows-trigger-url.sh` |
| Flows: file upload | `triggerFlowWithFile()` | GET `/flows/file-upload` | `rest-api/flows-trigger-file.sh` |

## How to run
- __Node (SDK)__
  ```bash
  cd node-typescript
  cp .env.example .env && edit .env  # set API_KEY
  npm install
  npm run dev
  ```

- __Python FastAPI (SDK)__
  ```bash
  cd python
  python -m venv .venv && source .venv/bin/activate
  cp .env.example .env && edit .env  # set WORQHAT_API_KEY
  pip install -r requirements.txt
  uvicorn src.app:app --reload --port 4000
  # Test: curl http://localhost:4000/status
  ```

- __REST cURL (HTTP)__
  ```bash
  cd rest-api
  cp .env.example .env && edit .env  # set API_KEY
  chmod +x *.sh
  ./check-status.sh
  ```

## Environment variables
- Node TypeScript: `.env` typically includes `API_KEY` (and optionally `API_URL` if supported by that client).
- Python: `.env` uses `WORQHAT_API_KEY` only. The SDK manages the base URL internally.
- REST cURL: `.env` uses `API_KEY` and a fixed base URL `https://api.worqhat.com` within scripts (no `API_URL`).

## Security
- Do not commit `.env` or API keys.
- Rotate keys periodically and follow WorqHat security best practices.

## License
MIT (or repository default). See `LICENSE` if present.