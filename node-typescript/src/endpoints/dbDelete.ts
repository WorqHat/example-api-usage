import Worqhat from "worqhat";

export async function deleteInactiveUsers() {
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
    // Call the deleteRecords method
    const response = await client.db.deleteRecords({
      table: "users", // The table to delete from
      where: {
        // The condition to match records
        status: "inactive",
      },
    });

    // Handle the successful response
    console.log(`Deleted ${response.deletedCount} inactive users`);
    console.log(`Message: ${response.message}`);
    return response;
  } catch (error) {
    // Handle any errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error deleting users:", errorMessage);
    throw error;
  }
}

export async function deleteOldCompletedTasks() {
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
    // Get date from 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Call the deleteRecords method with multiple conditions
    const response = await client.db.deleteRecords({
      table: "tasks", // The table to delete from
      where: {
        // Multiple conditions to match records
        status: "completed",
        priority: "low",
      },
    });

    // Handle the successful response
    console.log(`Deleted ${response.deletedCount} old completed tasks`);
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error deleting tasks:", errorMessage);
    throw error;
  }
}

// Export a function to run all examples (for backward compatibility)
export async function dbDelete() {
  // Call the function
  await deleteInactiveUsers();

  // Call the function
  await deleteOldCompletedTasks();
}

// Sample Response:
// {
//   "success": true,
//   "table": "users",
//   "count": 1,
//   "executionTime": 241,
//   "message": "Data deleted successfully from users"
// }
