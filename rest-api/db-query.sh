#!/usr/bin/env bash
set -euo pipefail
QUERY="${1:-}"
PARAMS_JSON="${2:-}" # optional JSON string for parameters
if [ -z "$QUERY" ]; then echo "Usage: $0 <sql-query> [params-json]"; exit 1; fi
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$source_dir/.env" ]; then export $(grep -v '^#' "$source_dir/.env" | xargs); fi

# Examples:
# 1) Execute SQL query with named parameters
# ./db-query.sh "SELECT * FROM users WHERE status = {status} LIMIT {limit}" '{"status": "active", "limit": 10}'
#
# 2) Execute complex SQL query with positional parameters
# ./db-query.sh "SELECT category, COUNT(*) as order_count, SUM(quantity) as total_items, SUM(price * quantity) as total_revenue FROM orders WHERE order_date >= \$1 GROUP BY category ORDER BY total_revenue DESC" '["2025-01-01"]'
#
# 3) Search users with named parameters
# ./db-query.sh "SELECT * FROM users WHERE status = {status} AND created_at >= {created_after} ORDER BY {sort_by} LIMIT {limit}" '{"status": "active", "created_after": "2025-01-01", "sort_by": "created_at", "limit": 50}'
#
# Example cURL commands:
# curl -X POST "https://api.worqhat.com/db/query" \
#   -H "Content-Type: application/json" \
#   -H "Authorization: Bearer YOUR_API_KEY" \
#   -d '{
#     "query": "SELECT * FROM users WHERE status = {status} LIMIT {limit}",
#     "params": {
#       "status": "active",
#       "limit": 10
#     },
#     "environment": "production"
#   }'

if [ -n "$PARAMS_JSON" ]; then
  PAYLOAD="{\"query\": \"${QUERY//\"/\\\"}\", \"params\": $PARAMS_JSON, \"environment\": \"production\"}"
else
  PAYLOAD="{\"query\": \"${QUERY//\"/\\\"}\", \"environment\": \"production\"}"
fi

curl -sS -X POST "https://api.worqhat.com/db/query" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" | jq .
