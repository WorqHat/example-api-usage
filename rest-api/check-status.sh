#!/usr/bin/env bash
set -euo pipefail
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$source_dir/.env" ]; then export $(grep -v '^#' "$source_dir/.env" | xargs); fi
# Sample curl commands to check API status:
# curl -sS "https://api.worqhat.com/" | jq .
curl -sS "https://api.worqhat.com/" | jq .
