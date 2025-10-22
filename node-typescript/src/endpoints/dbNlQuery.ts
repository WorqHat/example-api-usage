import Worqhat from "worqhat";

export async function countActiveUsers() {
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
    // Call the processNlQuery method
    const response = await client.db.processNlQuery({
      question: "How many active users do we have?",
      table: "users",
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

export async function analyzeSalesData() {
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
    // More complex natural language query
    const response = await client.db.processNlQuery({
      question:
        "What were the top 3 product categories by revenue last quarter?",
      table: "sales",
    });

    // Handle the successful response
    console.log("Analysis results:", response.data);
    console.log("Generated SQL:", response.sql);
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error analyzing sales data:", errorMessage);
    throw error;
  }
}

// Export a function to run all examples (for backward compatibility)
export async function dbNlQuery() {
  // Call the function
  await countActiveUsers();

  // Call the function
  await analyzeSalesData();
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
//   "message": "7 record(s) fetched successfully from customer_management_data"
// }
