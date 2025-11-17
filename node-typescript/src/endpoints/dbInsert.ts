import Worqhat from "worqhat";

export async function createTask() {
  // Initialize the client with your API key - matching smoke test
  const apiKey = process.env.WORQHAT_API_KEY;
  if (!apiKey) {
    throw new Error("WORQHAT_API_KEY environment variable is required");
  }

  const client = new Worqhat({
    apiKey, // Always use environment variables for API keys
  });

  try {
    const taskId = Math.floor(Date.now() / 1000);
    const nowIso = new Date().toISOString();

    // Call the insertRecord method - matching smoke test
    const response = await client.db.insertRecord({
      table: "tasks", // The table to insert into - matching smoke test
      data: {
        // The data to insert - matching smoke test structure
        id: taskId,
        status: "open",
        priority: "high",
        created_at: nowIso,
        updated_at: nowIso,
      },
    });

    // Handle the successful response
    console.log("Task created with ID:", taskId);
    console.log("Created task:", response.data);
    return response;
  } catch (error) {
    // Handle any errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error creating task:", errorMessage);
    throw error;
  }
}

// Export a function to run all examples (for backward compatibility)
export async function dbInsert() {
  // Call the function - matching smoke test
  await createTask();
}
