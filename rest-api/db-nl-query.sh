#!/usr/bin/env bash
set -euo pipefail
QUESTION="${1:-}"
TABLE="${2:-}"
if [ -z "$QUESTION" ] || [ -z "$TABLE" ]; then echo "Usage: $0 '<question>' <table>"; exit 1; fi
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$source_dir/.env" ]; then export $(grep -v '^#' "$source_dir/.env" | xargs); fi

# Examples:
# 1) Count active users
# ./db-nl-query.sh "How many active users do we have?" "users"
#
# 2) Analyze sales data
# ./db-nl-query.sh "What were the top 3 product categories by revenue last quarter?" "sales"
#
# Example cURL commands:
# curl -X POST "https://api.worqhat.com/db/nl-query" \
#   -H "Content-Type: application/json" \
#   -H "Authorization: Bearer YOUR_API_KEY" \
#   -d '{
#     "question": "How many active users do we have?",
#     "table": "users",
#     "environment": "production"
#   }'

curl -sS -X POST "https://api.worqhat.com/db/nl-query" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"question\":\"$QUESTION\",\"table\":\"$TABLE\",\"environment\":\"production\"}" | jq .
