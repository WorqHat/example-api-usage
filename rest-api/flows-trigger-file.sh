#!/usr/bin/env bash
set -euo pipefail
FLOW_ID="${1:-}"
FILE_PATH="${2:-}"
METADATA_JSON="${3:-}" # optional JSON string
if [ -z "$FLOW_ID" ] || [ -z "$FILE_PATH" ]; then echo "Usage: $0 <flowId> <filePath> [metadata-json]"; exit 1; fi
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$source_dir/.env" ]; then export $(grep -v '^#' "$source_dir/.env" | xargs); fi
if [ -n "$METADATA_JSON" ]; then
  curl -sS -X POST "$API_URL/flows/file/$FLOW_ID" \
    -H "Authorization: Bearer $API_KEY" \
    -F "file=@$FILE_PATH" \
    -F "metadata=$METADATA_JSON" | jq .
else
  curl -sS -X POST "$API_URL/flows/file/$FLOW_ID" \
    -H "Authorization: Bearer $API_KEY" \
    -F "file=@$FILE_PATH" | jq .
fi
