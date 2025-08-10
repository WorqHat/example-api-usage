#!/usr/bin/env bash
set -euo pipefail
TABLE="${1:-}"
WHERE_JSON="${2:-}"
DATA_JSON="${3:-}"
if [ -z "$TABLE" ] || [ -z "$WHERE_JSON" ] || [ -z "$DATA_JSON" ]; then echo "Usage: $0 <table> '<where-json>' '<data-json>'"; exit 1; fi
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$source_dir/.env" ]; then export $(grep -v '^#' "$source_dir/.env" | xargs); fi
curl -sS -X PUT "$API_URL/db/update" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"table\":\"$TABLE\",\"where\":$WHERE_JSON,\"data\":$DATA_JSON}" | jq .
