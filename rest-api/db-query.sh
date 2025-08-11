#!/usr/bin/env bash
set -euo pipefail
QUERY="${1:-}"
LIMIT="${2:-}" # optional
OFFSET="${3:-}" # optional
if [ -z "$QUERY" ]; then echo "Usage: $0 <sql-query> [limit] [offset]"; exit 1; fi
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$source_dir/.env" ]; then export $(grep -v '^#' "$source_dir/.env" | xargs); fi
QS=""
[ -n "$LIMIT" ] && QS+="limit=$LIMIT"
[ -n "$OFFSET" ] && QS+="&offset=$OFFSET"
QS="${QS#&}"
URL="https://api.worqhat.com/db/query"
[ -n "$QS" ] && URL+="?$QS"
curl -sS -X POST "$URL" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"${QUERY//\"/\\\"}\"}" | jq .
