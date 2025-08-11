#!/usr/bin/env bash
set -euo pipefail
QUESTION="${1:-}"
TABLE="${2:-}"
if [ -z "$QUESTION" ] || [ -z "$TABLE" ]; then echo "Usage: $0 '<question>' <table>"; exit 1; fi
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$source_dir/.env" ]; then export $(grep -v '^#' "$source_dir/.env" | xargs); fi
curl -sS -X POST "https://api.worqhat.com/db/nl-query" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"question\":\"$QUESTION\",\"table\":\"$TABLE\"}" | jq .
