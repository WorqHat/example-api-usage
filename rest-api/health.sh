#!/usr/bin/env bash
set -euo pipefail
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$source_dir/.env" ]; then export $(grep -v '^#' "$source_dir/.env" | xargs); fi

# curl -sS "https://api.worqhat.com/health" | jq .
# Sample response:
# {
#   "status": "ok",
#   "uptime": 199177,
#   "version": "1.0.0",
#   "environment": "production",
#   "timestamp": "2025-08-11T03:38:52.497Z",
#   "memory": {
#     "rss": 112,
#     "heapTotal": 28,
#     "heapUsed": 22,
#     "external": 3
#   },
#   "services": {
#     "database": "ok",
#     "api": "ok"
#   }
# }
curl -sS "https://api.worqhat.com/health" | jq .
