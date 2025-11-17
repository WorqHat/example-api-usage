#!/usr/bin/env bash
set -euo pipefail
FILE_PATH="${1:-}"
if [ -z "$FILE_PATH" ]; then echo "Usage: $0 <filepath>"; exit 1; fi
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$source_dir/.env" ]; then export $(grep -v '^#' "$source_dir/.env" | xargs); fi

# Example:
# ./storage-fetch-path.sh "documents/invoices/invoice_2025.pdf"
#
# Example cURL command:
# curl -X GET "https://api.worqhat.com/storage/fetch-by-path?filepath=documents/invoices/invoice_2025.pdf" \
#   -H "Authorization: Bearer YOUR_API_KEY"

curl -sS -X GET "https://api.worqhat.com/storage/fetch-by-path?filepath=$FILE_PATH" \
  -H "Authorization: Bearer $API_KEY" | jq .
