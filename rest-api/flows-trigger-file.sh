#!/usr/bin/env bash
set -euo pipefail
WORKFLOW_ID="${1:-}"
INPUT_TYPE="${2:-}"  # "file" or "url"
INPUT_VALUE="${3:-}"
if [ -z "$WORKFLOW_ID" ] || [ -z "$INPUT_TYPE" ] || [ -z "$INPUT_VALUE" ]; then
  echo "Usage: $0 <workflow-id> <file|url> <file-path-or-url> [key=value ...]"
  echo ""
  echo "Examples:"
  echo "1) File upload:"
  echo "   $0 'document-processing-workflow-id' file './contract.pdf' documentType=contract priority=high"
  echo ""
  echo "2) URL processing:"
  echo "   $0 'image-analysis-workflow-id' url 'https://storage.example.com/products/laptop-x1.jpg' imageType=product category=electronics"
  echo ""
  echo "3) Complex parameters:"
  echo "   $0 'document-processing-workflow-id' file './contract.pdf' customerId=CID-12345 department=legal requireSignature=true processingMode=detailed"
  exit 1
fi
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$source_dir/.env" ]; then export $(grep -v '^#' "$source_dir/.env" | xargs); fi

# Example cURL commands:
# File upload:
# curl -X POST "https://api.worqhat.com/flows/file/document-processing-workflow-id" \
#   -H "Authorization: Bearer YOUR_API_KEY" \
#   -F "file=@./contract.pdf" \
#   -F "documentType=contract" \
#   -F "priority=high"
#
# URL processing:
# curl -X POST "https://api.worqhat.com/flows/file/image-analysis-workflow-id" \
#   -H "Authorization: Bearer YOUR_API_KEY" \
#   -F "url=https://storage.example.com/products/laptop-x1.jpg" \
#   -F "imageType=product" \
#   -F "category=electronics"

EXTRA_FIELDS=( )
if [ "$#" -ge 4 ]; then
  for kv in "${@:4}"; do
    EXTRA_FIELDS+=( -F "$kv" )
  done
fi

if [ "$INPUT_TYPE" = "file" ]; then
  curl -sS -X POST "https://api.worqhat.com/flows/file/$WORKFLOW_ID" \
    -H "Authorization: Bearer $API_KEY" \
    -F "file=@$INPUT_VALUE" \
    "${EXTRA_FIELDS[@]}" | jq .
elif [ "$INPUT_TYPE" = "url" ]; then
  curl -sS -X POST "https://api.worqhat.com/flows/file/$WORKFLOW_ID" \
    -H "Authorization: Bearer $API_KEY" \
    -F "url=$INPUT_VALUE" \
    "${EXTRA_FIELDS[@]}" | jq .
else
  echo "Error: INPUT_TYPE must be 'file' or 'url'"
  exit 1
fi