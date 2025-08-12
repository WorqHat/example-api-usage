# REST API cURL Examples

This folder contains cURL scripts for all WorqHat API endpoints.

## Prerequisites
- Copy `.env.example` to `.env` and set `API_KEY`.
- Base URL is fixed to `https://api.worqhat.com` in scripts. Do not use an `API_URL` env var.
- Make scripts executable: `chmod +x *.sh`

## Usage examples
- `./check-status.sh`
- `./health.sh`
- `./flows-metrics.sh 2025-07-01 2025-07-24 completed`
- `./flows-trigger-json.sh your-flow-id`
- `./flows-trigger-file.sh your-flow-id /path/to/file.pdf`
- `./flows-trigger-url.sh your-flow-id https://example.com/file.pdf`
- `./db-query.sh "SELECT * FROM users LIMIT 10" 10 0`
- `./db-insert.sh users '{"name":"John","email":"john@worqhat.com"}'`
- `./db-update.sh users '{"id":"123"}' '{"status":"active"}'`
- `./db-delete.sh users '{"id":"123"}'`
- `./db-nl-query.sh 'How many active users?' users`

## Environment
- `.env` contains `API_KEY` only.
- Base URL is literal in scripts: `https://api.worqhat.com`.

## Notes
- Scripts echo responses as-is; you can pipe to `jq` for pretty printing.
- Check individual `*.sh` files for parameters and usage.

