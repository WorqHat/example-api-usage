#!/usr/bin/env bash
set -euo pipefail
TABLE="${1:-}"
DATA_JSON="${2:-}"
if [ -z "$TABLE" ] || [ -z "$DATA_JSON" ]; then echo "Usage: $0 <table> '<data-json>'"; exit 1; fi
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$source_dir/.env" ]; then export $(grep -v '^#' "$source_dir/.env" | xargs); fi
# Examples:
# 1) Insert a single JSON object
# curl -X POST "https://api.worqhat.com/db/insert" \
#   -H "Content-Type: application/json" \
#   -H "Authorization: Bearer $API_KEY" \
#   -d '{
#     "table": "customer_management_data",
#     "data": {
#       "customer_name": "Alice Johnson",
#       "customer_email": "alice@example.com",
#       "customer_phone_number": "+91-9876543210",
#       "customer_address": "123 MG Road, Pune",
#       "customer_type": "individual"
#     }
#   }'
#
# 2) Insert an array of JSON objects
# curl -X POST "https://api.worqhat.com/db/insert" \
#   -H "Content-Type: application/json" \
#   -H "Authorization: Bearer $API_KEY" \
#   -d '{
#     "table": "customer_management_data",
#     "data": [
#       {
#         "customer_name": "Alice Johnson",
#         "customer_email": "alice@example.com",
#         "customer_phone_number": "+91-9876543210",
#         "customer_address": "123 MG Road, Pune",
#         "customer_type": "individual"
#       },
#       {
#         "customer_name": "Raj Mehra",
#         "customer_email": "raj.mehra@example.com",
#         "customer_phone_number": "+91-9898989898",
#         "customer_address": "22 Nehru Street, Delhi",
#         "customer_type": "business"
#       }
#     ]
#   }'
curl -sS -X POST "https://api.worqhat.com/db/insert" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"table\":\"$TABLE\",\"data\":$DATA_JSON}" | jq .
