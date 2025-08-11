#!/usr/bin/env bash
set -euo pipefail
FLOW_ID="${1:-}"
FILE_PATH="${2:-}"
if [ -z "$FLOW_ID" ] || [ -z "$FILE_PATH" ]; then echo "Usage: $0 <flowId> <filePath> [key=value ...]"; exit 1; fi
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$source_dir/.env" ]; then export $(grep -v '^#' "$source_dir/.env" | xargs); fi
# Example (this is an example command):
# curl -X POST "https://api.worqhat.com/flows/file/e3f35867-77f4-4c49-b376-ac0f0cedb423" \
#   -H "Authorization: Bearer wh_mdyshg3cOWFaIiiFZckiRx5FgqGqWXO8z8W6BWZCsqg" \
#   -F "file=@/path/to/local/file.png" \
#   -F "input1=value1" \
#   -F "input2=value2"

# Sample response:
# {
#   "success": true,
#   "statusCode": "200",
#   "data": {
#     "output": "...",
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
  -F "file=@$FILE_PATH" \
  "${EXTRA_FIELDS[@]}" | jq .
