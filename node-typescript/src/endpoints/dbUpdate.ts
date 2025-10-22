import Worqhat from "worqhat";

export async function updateUserStatus() {
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
    // Call the updateRecords method
    const response = await client.db.updateRecords({
      table: "users", // The table to update
      where: {
        // Which records to update
        id: "123", // Find records with id = 123
        email: "user@example.com", // AND email = user@example.com
      },
      data: {
        // New values to set
        status: "active", // Change status to active
        name: "Updated Name", // Update the name
      },
    });

    // Handle the successful response
    console.log(`Updated ${response.count} records`);
    console.log("Updated records:", response.data);
    return response;
  } catch (error) {
    // Handle any errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error updating records:", errorMessage);
    throw error;
  }
}

export async function updateInactiveUsers() {
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
    // Update all inactive users to active
    const response = await client.db.updateRecords({
      table: "users", // The table to update
      where: {
        // Which records to update
        status: "inactive", // Find ALL records with status = inactive
      },
      data: {
        // New values to set
        status: "active", // Change status to active
        updatedBy: "system", // Add audit information
      },
    });

    // Handle the successful response
    console.log(`Updated ${response.count} inactive users to active status`);
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error updating users:", errorMessage);
    throw error;
  }
}

// Export a function to run all examples (for backward compatibility)
export async function dbUpdate() {
  // Call the function
  await updateUserStatus();

  // Call the function
  await updateInactiveUsers();
}

// Sample Response:
// {
//   "success": true,
//   "data": [
//     {
//       "documentId": "22904fb3-8ead-44de-83f6-4689d4958d7d",
//       "createdAt": "2025-08-05 18:36:40",
//       "updatedAt": "2025-08-11 11:40:36",
//       "customer_name": "Alice Johnson",
//       "customer_email": "alice@example.com",
//       "customer_phone_number": "+91-9876543210",
//       "customer_address": "456 Park Street, Mumbai",
//       "customer_type": "individual"
//     }
//     {Additional Records}
//   ],
//   "count": 7,
//   "executionTime": 387,
//   "message": "7 record(s) updated successfully in customer_management_data"
// }
