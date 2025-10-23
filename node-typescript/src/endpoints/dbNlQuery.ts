import Worqhat from "worqhat";

export async function queryTaskById(taskId: number) {
  // Initialize the client with your API key - matching smoke test
  const apiKey = process.env.WORQHAT_API_KEY;
  if (!apiKey) {
    throw new Error("WORQHAT_API_KEY environment variable is required");
  }

  const client = new Worqhat({
    apiKey, // Always use environment variables for API keys
  });

  try {
    // Call the processNlQuery method - matching smoke test
    const response = await client.db.processNlQuery({
      question: `Show the task with id ${taskId}`,
      table: "tasks",
    });

    // Handle the successful response
    console.log(`Result: ${JSON.stringify(response.data)}`);
    console.log("Generated SQL:", response.sql);
    console.log("Query execution time:", response.executionTime, "ms");
    return response;
  } catch (error) {
    // Handle any errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error executing query:", errorMessage);
    throw error;
  }
}

// Export a function to run all examples (for backward compatibility)
export async function dbNlQuery(taskId: number) {
  // Call the function - matching smoke test
  await queryTaskById(taskId);
}
