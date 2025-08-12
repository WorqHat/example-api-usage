# Python (FastAPI) — WorqHat SDK examples

This folder mirrors `node-typescript/` using the official `worqhat` PyPI package and exposes the same demo routes via FastAPI.

## Setup
- Create venv and install deps
  ```bash
  python -m venv .venv
  source .venv/bin/activate
  pip install -r requirements.txt
  ```
- Env vars
  ```bash
  cp .env.example .env
  # Edit .env and set
  # WORQHAT_API_KEY=your_key
  ```

## Run the server
```bash
uvicorn src.app:app --reload --port 4000
```

Server will be available at `http://localhost:4000`.

## Routes (mirror of node-typescript/src/index.ts)
- GET `/status` — server info
- GET `/health` — health check
- GET `/db/query` — run sample SQL
- GET `/db/insert` — single + bulk insert examples
- GET `/db/update` — update example
- GET `/db/delete` — delete example
- GET `/db/nl-query` — natural language DB question
- GET `/flows/trigger-json` — trigger workflow with JSON payload
- GET `/flows/metrics` — list metrics (sample filters)
- GET `/flows/file-url` — trigger workflow with remote file URL
- GET `/flows/file-upload` — trigger workflow with local file `src/image.png`

## Notes
- Uses `worqhat` SDK. API key read from `WORQHAT_API_KEY`.
- For file upload demo, place an image at `python/src/image.png`, or use `/flows/file-url`.
- The legacy helper in `src/client.py` + small endpoint scripts under `src/endpoints/` are kept only as references; the FastAPI app at `src/app.py` is the primary entry point.
