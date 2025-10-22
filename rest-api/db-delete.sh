#!/usr/bin/env bash
set -euo pipefail
TABLE="${1:-}"
WHERE_JSON="${2:-}"
if [ -z "$TABLE" ] || [ -z "$WHERE_JSON" ]; then echo "Usage: $0 <table> '<where-json>'"; exit 1; fi
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$source_dir/.env" ]; then export $(grep -v '^#' "$source_dir/.env" | xargs); fi

# Examples:
# 1) Delete inactive users
# ./db-delete.sh users '{"status": "inactive"}'
#
# 2) Delete old completed tasks
# ./db-delete.sh tasks '{"status": "completed", "priority": "low"}'
#
# Example cURL commands:
# curl -X DELETE "https://api.worqhat.com/db/delete" \
#   -H "Content-Type: application/json" \
#   -H "Authorization: Bearer YOUR_API_KEY" \
#   -d '{
#     "table": "users",
#     "where": {
#       "status": "inactive"
#     },
#     "environment": "production"
#   }'

curl -sS -X DELETE "https://api.worqhat.com/db/delete" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"table\":\"$TABLE\",\"where\":$WHERE_JSON,\"environment\":\"production\"}" | jq .
