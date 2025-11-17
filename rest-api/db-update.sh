#!/usr/bin/env bash
set -euo pipefail
TABLE="${1:-}"
WHERE_JSON="${2:-}"
DATA_JSON="${3:-}"
if [ -z "$TABLE" ] || [ -z "$WHERE_JSON" ] || [ -z "$DATA_JSON" ]; then echo "Usage: $0 <table> '<where-json>' '<data-json>'"; exit 1; fi
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$source_dir/.env" ]; then export $(grep -v '^#' "$source_dir/.env" | xargs); fi
# Examples:
# 1) Update records using multiple where conditions
# ./db-update.sh users '{"id": "123", "email": "user@example.com"}' '{"status": "active", "name": "Updated Name"}'
#
# 2) Update all inactive users to active
# ./db-update.sh users '{"status": "inactive"}' '{"status": "active", "updatedBy": "system"}'
#
# Example cURL commands:
# curl -X PUT "https://api.worqhat.com/db/update" \
#   -H "Content-Type: application/json" \
#   -H "Authorization: Bearer YOUR_API_KEY" \
#   -d '{
#     "table": "users",
#     "where": {
#       "id": "123",
#       "email": "user@example.com"
#     },
#     "data": {
#       "status": "active",
#       "name": "Updated Name"
#     },
#     "environment": "production"
#   }'

# Sample Response:
# {
#   "success": true,
#   "data": [
#     {
#       "documentId": "22904fb3-8ead-44de-83f6-4689d4958d7d",
#       "createdAt": "2025-08-05 18:36:40",
#       "updatedAt": "2025-08-11 11:40:36",
#       "customer_name": "Alice Johnson",
#       "customer_email": "alice@example.com",
#       "customer_phone_number": "+91-9876543210",
#       "customer_address": "456 Park Street, Mumbai",
#       "customer_type": "individual"
#     }
#     {Additional Records}
#   ],
#   "count": 7,
#   "executionTime": 387,
#   "message": "7 record(s) updated successfully in customer_management_data"
# }

curl -sS -X PUT "https://api.worqhat.com/db/update" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"table\":\"$TABLE\",\"where\":$WHERE_JSON,\"data\":$DATA_JSON}" | jq .
