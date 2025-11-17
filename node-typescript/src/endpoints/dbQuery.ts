import Worqhat from "worqhat";

export async function fetchTaskById(taskId: number) {
  // Initialize the client with your API key - matching smoke test
  const apiKey = process.env.WORQHAT_API_KEY;
  if (!apiKey) {
    throw new Error("WORQHAT_API_KEY environment variable is required");
  }

  const client = new Worqhat({
    apiKey, // Always use environment variables for API keys
  });

  try {
    // Call the executeQuery method with named parameters - matching smoke test
    const response = await client.db.executeQuery({
      query: "SELECT * FROM tasks WHERE id = {id}",
      params: {
        id: taskId,
      },
    });

    // Handle the successful response
    console.log(`Found ${response.data.length} tasks`);
    console.log("Query execution time:", response.executionTime, "ms");
    console.log("Results:", response.data);
    return response;
  } catch (error) {
    // Handle any errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error executing query:", errorMessage);
    throw error;
  }
}

// Export a function to run all examples (for backward compatibility)
export async function dbQuery(taskId: number) {
  // Call the function - matching smoke test
  await fetchTaskById(taskId);
}
