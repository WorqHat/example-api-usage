#!/usr/bin/env bash
set -euo pipefail
TABLE="${1:-}"
DATA_JSON="${2:-}"
if [ -z "$TABLE" ] || [ -z "$DATA_JSON" ]; then echo "Usage: $0 <table> '<data-json>'"; exit 1; fi
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$source_dir/.env" ]; then export $(grep -v '^#' "$source_dir/.env" | xargs); fi
# Examples:
# 1) Insert a single user record
# ./db-insert.sh users '{"name":"John Doe","email":"john@example.com","role":"user","active":true}'
#
# 2) Insert a product with custom documentId
# ./db-insert.sh products '{"documentId":"prod_1627384950","name":"Premium Widget","price":99.99,"inStock":true,"category":"electronics"}'
#
# 3) Insert multiple products (batch insert)
# ./db-insert.sh products '[{"name":"Basic Widget","price":19.99,"inStock":true,"category":"essentials"},{"name":"Standard Widget","price":49.99,"inStock":true,"category":"essentials"},{"name":"Premium Widget","price":99.99,"inStock":false,"category":"premium"}]'
curl -sS -X POST "https://api.worqhat.com/db/insert" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"table\":\"$TABLE\",\"data\":$DATA_JSON}" | jq .
