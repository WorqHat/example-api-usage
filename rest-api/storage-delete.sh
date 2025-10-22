#!/usr/bin/env bash
set -euo pipefail
FILE_ID="${1:-}"
if [ -z "$FILE_ID" ]; then echo "Usage: $0 <fileId>"; exit 1; fi
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$source_dir/.env" ]; then export $(grep -v '^#' "$source_dir/.env" | xargs); fi

# Example:
# ./storage-delete.sh "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
#
# Example cURL command:
# curl -X DELETE "https://api.worqhat.com/storage/delete/a1b2c3d4-e5f6-7890-abcd-ef1234567890" \
#   -H "Authorization: Bearer YOUR_API_KEY"

curl -sS -X DELETE "https://api.worqhat.com/storage/delete/$FILE_ID" \
  -H "Authorization: Bearer $API_KEY" | jq .
