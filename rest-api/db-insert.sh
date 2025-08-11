#!/usr/bin/env bash
set -euo pipefail
TABLE="${1:-}"
DATA_JSON="${2:-}"
if [ -z "$TABLE" ] || [ -z "$DATA_JSON" ]; then echo "Usage: $0 <table> '<data-json>'"; exit 1; fi
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$source_dir/.env" ]; then export $(grep -v '^#' "$source_dir/.env" | xargs); fi
curl -sS -X POST "https://api.worqhat.com/db/insert" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"table\":\"$TABLE\",\"data\":$DATA_JSON}" | jq .
