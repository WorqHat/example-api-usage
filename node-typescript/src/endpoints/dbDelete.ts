import Worqhat from "worqhat";

export async function deleteTaskById(taskId: number) {
  // Initialize the client with your API key - matching smoke test
  const apiKey = process.env.WORQHAT_API_KEY;
  if (!apiKey) {
    throw new Error("WORQHAT_API_KEY environment variable is required");
  }

  const client = new Worqhat({
    apiKey, // Always use environment variables for API keys
    environment: process.env.WORQHAT_ENVIRONMENT || "production", // Defaults to production
  });

  try {
    // Call the deleteRecords method - matching smoke test
    const response = await client.db.deleteRecords({
      table: "tasks", // The table to delete from - matching smoke test
      where: {
        // The condition to match records - matching smoke test
        id: taskId,
      },
    });

    // Handle the successful response
    console.log(`Deleted task with ID: ${taskId}`);
    console.log(`Message: ${response.message}`);
    return response;
  } catch (error) {
    // Handle any errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error deleting task:", errorMessage);
    throw error;
  }
}

// Export a function to run all examples (for backward compatibility)
export async function dbDelete(taskId: number) {
  // Call the function - matching smoke test
  await deleteTaskById(taskId);
}
