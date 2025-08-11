#!/usr/bin/env bash
set -euo pipefail
FLOW_ID="${1:-}"
BODY_JSON="${2:-'{"key":"value"}'}"
if [ -z "$FLOW_ID" ]; then echo "Usage: $0 <flowId> [json-body]"; exit 1; fi
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$source_dir/.env" ]; then export $(grep -v '^#' "$source_dir/.env" | xargs); fi
# Example (this is an example):
# curl -X POST "https://api.worqhat.com/flows/trigger/a4a0053f-adec-4a3d-abf6-87ccac03b391" \
#   -H "Authorization: Bearer wh_mdyshg3cOWFaIiiFZckiRx5FgqGqWXO8z8W6BWZCsqg" \
#   -H "Content-Type: application/json" \
#   -d '{
#     "input1": "value1",
#     "input2": "value2"
#   }'

# Sample response:
# {
#   "success": true,
#   "message": "Workflow a4a0053f-adec-4a3d-abf6-87ccac03b391 triggered successfully",
#   "timestamp": "2025-08-11T03:55:10.814Z",
#   "data": {
#     "success": true,
#     "statusCode": "200",
#     "data": {
#       "output1": "value1",
#       "output2": "value2"
#     }
#   }
# }
curl -sS -X POST "https://api.worqhat.com/flows/trigger/$FLOW_ID" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "$BODY_JSON" | jq .
