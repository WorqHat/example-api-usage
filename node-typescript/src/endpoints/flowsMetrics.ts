import axios from "axios";

export async function getWorkflowMetrics() {
  const apiKey = process.env.WORQHAT_API_KEY;
  if (!apiKey) {
    throw new Error("WORQHAT_API_KEY environment variable is required");
  }

  try {
    const response = await axios.get("https://api.worqhat.com/flows/metrics", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      params: {
        start_date: "2025-07-01",
        end_date: "2025-07-24",
        status: "completed",
      },
    });

    console.log(`Total Executions: ${response.data.metrics.totalExecutions}`);
    console.log(`Success Rate: ${response.data.metrics.successRate}%`);
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error getting workflow metrics:", errorMessage);
    throw error;
  }
}

export async function getAllWorkflowMetrics() {
  const apiKey = process.env.WORQHAT_API_KEY;
  if (!apiKey) {
    throw new Error("WORQHAT_API_KEY environment variable is required");
  }

  try {
    const response = await axios.get("https://api.worqhat.com/flows/metrics", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    console.log(
      `Period: ${response.data.period.startDate} to ${response.data.period.endDate}`
    );
    console.log(`Total Executions: ${response.data.metrics.totalExecutions}`);
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error getting workflow metrics:", errorMessage);
    throw error;
  }
}

export async function getFlowsMetrics() {
  console.log("Running flows metrics examples...");
  await getWorkflowMetrics();
  await getAllWorkflowMetrics();
}
