import Worqhat from "worqhat";

export async function getWorkflowMetrics() {
  // Initialize the client with your API key
  const apiKey = process.env.WORQHAT_API_KEY;
  if (!apiKey) {
    throw new Error("WORQHAT_API_KEY environment variable is required");
  }

  const client = new Worqhat({
    apiKey, // Always use environment variables for API keys
    environment: process.env.WORQHAT_ENVIRONMENT || "production", // Defaults to production
  });

  try {
    // Call the getMetrics method
    const response = await client.workflows.getMetrics({
      start_date: "2025-07-01", // Start date in YYYY-MM-DD format
      end_date: "2025-07-24", // End date in YYYY-MM-DD format
      status: "completed", // Only include completed workflows
    });

    // Handle the successful response
    console.log(`Total Executions: ${response.metrics.totalExecutions}`);
    console.log(`Success Rate: ${response.metrics.successRate}%`);
    console.log(`Average Duration: ${response.metrics.averageDuration}ms`);

    // Log metrics for individual workflows
    response.workflowMetrics.forEach((workflow) => {
      console.log(`\nWorkflow: ${workflow.name} (${workflow.id})`);
      console.log(`  Executions: ${workflow.executions}`);
      console.log(`  Success Rate: ${workflow.successRate}%`);
      console.log(`  Most Common Error: ${workflow.mostCommonError || "None"}`);
    });

    return response;
  } catch (error) {
    // Handle any errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error getting workflow metrics:", errorMessage);
    throw error;
  }
}

export async function getAllWorkflowMetrics() {
  // Initialize the client with your API key
  const apiKey = process.env.WORQHAT_API_KEY;
  if (!apiKey) {
    throw new Error("WORQHAT_API_KEY environment variable is required");
  }

  const client = new Worqhat({
    apiKey,
    environment: process.env.WORQHAT_ENVIRONMENT || "production", // Defaults to production
  });

  try {
    // Call the getMetrics method without date parameters
    // This will use the default date range (current month)
    const response = await client.workflows.getMetrics();

    // Handle the successful response
    console.log(
      `Period: ${response.period.startDate} to ${response.period.endDate}`
    );
    console.log(`Total Executions: ${response.metrics.totalExecutions}`);
    console.log(`Success Rate: ${response.metrics.successRate}%`);
    console.log(`Error Rate: ${response.metrics.errorRate}%`);

    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error getting workflow metrics:", errorMessage);
    throw error;
  }
}

// Export a function to run all examples (for backward compatibility)
export async function getFlowsMetrics() {
  // Call the function
  await getWorkflowMetrics();

  // Call the function
  await getAllWorkflowMetrics();
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
