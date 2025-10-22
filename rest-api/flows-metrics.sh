#!/usr/bin/env bash
set -euo pipefail
START_DATE="${1:-}"
END_DATE="${2:-}"
STATUS="${3:-}"
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$source_dir/.env" ]; then export $(grep -v '^#' "$source_dir/.env" | xargs); fi

# Examples:
# 1) Get workflow metrics for a specific date range and status
# ./flows-metrics.sh "2025-07-01" "2025-07-24" "completed"
#
# 2) Get workflow metrics with default date range (no parameters)
# ./flows-metrics.sh
#
# Example cURL commands:
# curl -X GET "https://api.worqhat.com/flows/metrics?start_date=2025-07-01&end_date=2025-07-24&status=completed" \
#   -H "Authorization: Bearer YOUR_API_KEY" \
#   -H "Content-Type: application/json"

QS=""
[ -n "$START_DATE" ] && QS+="start_date=$START_DATE"
[ -n "$END_DATE" ] && QS+="&end_date=$END_DATE"
[ -n "$STATUS" ] && QS+="&status=$STATUS"
QS="${QS#&}"
URL="https://api.worqhat.com/flows/metrics"
[ -n "$QS" ] && URL+="?$QS"

curl -sS -H "Authorization: Bearer $API_KEY" "$URL" | jq .
