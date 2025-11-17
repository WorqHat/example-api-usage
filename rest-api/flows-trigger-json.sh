#!/usr/bin/env bash
set -euo pipefail
WORKFLOW_ID="${1:-}"
PAYLOAD_JSON="${2:-}"
if [ -z "$WORKFLOW_ID" ] || [ -z "$PAYLOAD_JSON" ]; then
  echo "Usage: $0 <workflow-id> <json-payload>"
  echo ""
  echo "Examples:"
  echo "1) Customer onboarding:"
  echo "   $0 'workflow-id-for-customer-onboarding' '{\"name\":\"Jane Smith\",\"email\":\"jane.smith@example.com\",\"plan\":\"premium\",\"company\":\"Acme Inc.\",\"preferences\":{\"notifications\":true,\"newsletter\":false,\"productUpdates\":true}}'"
  echo ""
  echo "2) E-commerce order:"
  echo "   $0 'order-processing-workflow-id' '{\"orderId\":\"ORD-12345\",\"customer\":{\"id\":\"CUST-789\",\"name\":\"Alex Johnson\",\"email\":\"alex@example.com\"},\"items\":[{\"productId\":\"PROD-001\",\"quantity\":2,\"price\":29.99}],\"shipping\":{\"method\":\"express\",\"address\":{\"street\":\"123 Main St\",\"city\":\"Boston\",\"state\":\"MA\",\"zip\":\"02108\"}},\"payment\":{\"method\":\"credit_card\",\"transactionId\":\"TXN-5678\"}}'"
  echo ""
  echo "3) Data analysis:"
  echo "   $0 'data-analysis-workflow-id' '{\"datasetId\":\"DS-456\",\"analysisParameters\":{\"timeRange\":{\"start\":\"2025-01-01\",\"end\":\"2025-07-31\"},\"metrics\":[\"revenue\",\"user_growth\",\"conversion_rate\"],\"segmentation\":[\"region\",\"device_type\",\"user_tier\"],\"comparisonPeriod\":\"previous_quarter\"},\"outputFormat\":\"pdf\",\"notifyEmail\":\"reports@yourcompany.com\"}'"
  exit 1
fi
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$source_dir/.env" ]; then export $(grep -v '^#' "$source_dir/.env" | xargs); fi

# Example cURL commands:
# curl -X POST "https://api.worqhat.com/flows/trigger/f825ab82-371f-40cb-9bed-b325531ead4a" \
#   -H "Authorization: Bearer YOUR_API_KEY" \
#   -H "Content-Type: application/json" \
#   -d '{
#     "name": "Jane Smith",
#     "email": "jane.smith@example.com",
#     "plan": "premium",
#     "company": "Acme Inc.",
#     "preferences": {
#       "notifications": true,
#       "newsletter": false,
#       "productUpdates": true
#     }
#   }'

curl -sS -X POST "https://api.worqhat.com/flows/trigger/$WORKFLOW_ID" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD_JSON" | jq .
