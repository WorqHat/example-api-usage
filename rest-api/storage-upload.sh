#!/usr/bin/env bash
set -euo pipefail
FILE_PATH="${1:-}"
CUSTOM_PATH="${2:-}" # optional
if [ -z "$FILE_PATH" ]; then echo "Usage: $0 <filePath> [customPath]"; exit 1; fi
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$source_dir/.env" ]; then export $(grep -v '^#' "$source_dir/.env" | xargs); fi

# Examples:
# 1) Basic File Upload:
# ./storage-upload.sh "/path/to/document.pdf"
#
# 2) Upload with Custom Path:
# ./storage-upload.sh "/path/to/invoice_001.pdf" "invoices/2025/january/"
#
# Example cURL commands:
# curl -X POST "https://api.worqhat.com/storage/upload" \
#   -H "Authorization: Bearer YOUR_API_KEY" \
#   -F "file=@/path/to/document.pdf" \
#   -F "path=documents/"

PAYLOAD_ARGS=( )
PAYLOAD_ARGS+=( -F "file=@$FILE_PATH" )
if [ -n "$CUSTOM_PATH" ]; then
  PAYLOAD_ARGS+=( -F "path=$CUSTOM_PATH" )
fi

curl -sS -X POST "https://api.worqhat.com/storage/upload" \
  -H "Authorization: Bearer $API_KEY" \
  "${PAYLOAD_ARGS[@]}" | jq .
