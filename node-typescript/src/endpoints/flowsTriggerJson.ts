import Worqhat from "worqhat";

export async function triggerJsonWorkflow() {
  // Initialize the WorqHat client - matching smoke test
  const apiKey = process.env.WORQHAT_API_KEY;
  if (!apiKey) {
    throw new Error("WORQHAT_API_KEY environment variable is required");
  }

  const client = new Worqhat({
    apiKey, // Always use environment variables for API keys
  });

  // JSON payload matching smoke test
  const payload = {
    prompt: "value1",
  };

  try {
    // Trigger the JSON workflow - matching smoke test
    const response = await client.flows.triggerWithPayload(
      "81c88b6a-057a-44a9-8b4a-77755fb77e05", // JSON workflow ID from smoke test
      { body: payload } as any
    );

    console.log(
      `JSON workflow started! Tracking ID: ${(response as any).analytics_id}`
    );

    // You can store this analytics_id to check the status later
    return response;
  } catch (error) {
    // Handle any errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error triggering JSON workflow:", errorMessage);
    throw error;
  }
}

// Export a function to run all examples (for backward compatibility)
export async function triggerFlowJson() {
  // Call the function - matching smoke test
  await triggerJsonWorkflow();
}
