#!/usr/bin/env bash
set -euo pipefail
FLOW_ID="${1:-}"
BODY_JSON="${2:-'{"key":"value"}'}"
if [ -z "$FLOW_ID" ]; then echo "Usage: $0 <flowId> [json-body]"; exit 1; fi
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$source_dir/.env" ]; then export $(grep -v '^#' "$source_dir/.env" | xargs); fi
curl -sS -X POST "https://api.worqhat.com/flows/trigger/$FLOW_ID" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "$BODY_JSON" | jq .
