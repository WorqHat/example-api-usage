#!/usr/bin/env bash
set -euo pipefail
FLOW_ID="${1:-}"
INPUT_URL="${2:-}"
if [ -z "$FLOW_ID" ] || [ -z "$INPUT_URL" ]; then echo "Usage: $0 <flowId> <url> [key=value ...]"; exit 1; fi
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$source_dir/.env" ]; then export $(grep -v '^#' "$source_dir/.env" | xargs); fi
# Example (this is an example command):
# curl -X POST "https://api.worqhat.com/flows/file/e3f35867-77f4-4c49-b376-ac0f0cedb423" \
#   -H "Authorization: Bearer wh_mdyshg3cOWFaIiiFZckiRx5FgqGqWXO8z8W6BWZCsqg" \
#   -F "url=https://assets.worqhat.com/worqkitties/kitty-hi.png" \
#   -F "input1=value1" \
#   -F "input2=value2"

# Sample response:
# {
#   "success": true,
#   "statusCode": "200",
#   "data": {
#     "output": "Certainly! In the picture, I see an adorable cartoon cat wearing a Santa hat. It's holding a sign that says \"Hi\" with a paw print. The cat also has a red collar with a round tag.\n",
#     "data1": "value1",
#     "data2": "value2"
#   },
#   "message": "Workflow triggered successfully with file upload"
# }

EXTRA_FIELDS=( )
if [ "$#" -ge 3 ]; then
  for kv in "${@:3}"; do
    EXTRA_FIELDS+=( -F "$kv" )
  done
fi

curl -sS -X POST "https://api.worqhat.com/flows/file/$FLOW_ID" \
  -H "Authorization: Bearer $API_KEY" \
  -F "url=$INPUT_URL" \
  "${EXTRA_FIELDS[@]}" | jq .
