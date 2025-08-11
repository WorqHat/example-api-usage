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
URL="https://api.worqhat.com/flows/metrics"
[ -n "$QS" ] && URL+="?$QS"

# Sample curl command:
# curl -sS -H "Authorization: Bearer $API_KEY" \
#   "https://api.worqhat.com/flows/metrics?start_date=2025-08-01&end_date=2025-08-10&status=success" | jq .

# Sample response:
# {
#   "metrics": {
#     "total_workflows": "14",
#     "completed_workflows": 14,
#     "failed_workflows": 0,
#     "in_progress_workflows": 0,
#     "avg_duration_ms": 8000,
#     "metrics_by_user": {
#       "member-live-79d7631d-ed15-4e03-9f0c-b4cf767f1184": {
#         "total": 14,
#         "completed": 14,
#         "failed": 0,
#         "in_progress": 0
#       }
#     }
#   },
#   "workflows": [
#     {
#       "id": "e207efa3-acef-410b-9b8d-4ce0f4d9e8a7",
#       "workflow_id": "e3f35867-77f4-4c49-b376-ac0f0cedb423",
#       "user_id": "member-live-79d7631d-ed15-4e03-9f0c-b4cf767f1184",
#       "org_id": "organization-live-6a857ca5-2311-46b8-8131-3fb031c5335c",
#       "start_timestamp": "2025-08-06T13:23:47.000Z",
#       "end_timestamp": "2025-08-06T13:23:55.000Z",
#       "status": "completed"
#     }
#   ]
# }

curl -sS -H "Authorization: Bearer $API_KEY" "$URL" | jq .
