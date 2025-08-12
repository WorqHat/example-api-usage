import dotenv from "dotenv";
import Worqhat from "worqhat";

dotenv.config();

const API_KEY = process.env.API_KEY || "";

export const client = new Worqhat({
  apiKey: API_KEY,
});

export async function getFlowsMetrics() {
  const params: Record<string, unknown> = {
    start_date: "2025-08-01",
    end_date: "2025-08-31",
    status: "completed",
  };

  const response = await client.flows.getMetrics(params);
  console.log(JSON.stringify(response, null, 2));
}

// Sample Response

// {
// "metrics": {
//   "total_workflows": "16",
//   "completed_workflows": 16,
//   "failed_workflows": 0,
//   "in_progress_workflows": 0,
//   "avg_duration_ms": 7916.666666666667,
//   "metrics_by_user": {
//     "member-live-79d7631d-ed15-4e03-9f0c-b4cf767f1184": {
//       "total": 16,
//       "completed": 16,
//       "failed": 0,
//       "in_progress": 0
//     }
//   }
// },
//   workflows: [
//     {
//       id: '83c1b005-cbaf-4b31-aecd-352c03e27d44',
//       workflow_id: 'e3f35867-77f4-4c49-b376-ac0f0cedb423',
//       user_id: 'member-live-79d7631d-ed15-4e03-9f0c-b4cf767f1184',
//       org_id: 'organization-live-6a857ca5-2311-46b8-8131-3fb031c5335c',
//       start_timestamp: '2025-08-11T04:04:28.000Z',
//       end_timestamp: '2025-08-11T04:04:35.000Z',
//       status: 'completed'
//     },
//   ]
// }
