#!/usr/bin/env bash
set -euo pipefail
START_DATE="${1:-}"
END_DATE="${2:-}"
STATUS="${3:-}"
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$source_dir/.env" ]; then export $(grep -v '^#' "$source_dir/.env" | xargs); fi
QS=""
[ -n "$START_DATE" ] && QS+="start_date=$START_DATE"
[ -n "$END_DATE" ] && QS+="&end_date=$END_DATE"
[ -n "$STATUS" ] && QS+="&status=$STATUS"
QS="${QS#&}"
URL="$API_URL/flows/metrics"
[ -n "$QS" ] && URL+="?$QS"
curl -sS -H "Authorization: Bearer $API_KEY" "$URL" | jq .
