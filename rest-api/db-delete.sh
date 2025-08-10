#!/usr/bin/env bash
set -euo pipefail
TABLE="${1:-}"
WHERE_JSON="${2:-}"
if [ -z "$TABLE" ] || [ -z "$WHERE_JSON" ]; then echo "Usage: $0 <table> '<where-json>'"; exit 1; fi
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$source_dir/.env" ]; then export $(grep -v '^#' "$source_dir/.env" | xargs); fi
curl -sS -X DELETE "$API_URL/db/delete" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"table\":\"$TABLE\",\"where\":$WHERE_JSON}" | jq .
