import Worqhat from "worqhat";

export async function fetchTaskById(taskId: number) {
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

export async function generateSalesReport() {
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
    // Complex SQL query with positional parameters
    const query = `
      SELECT
        category,
        COUNT(*) as order_count,
        SUM(quantity) as total_items,
        SUM(price * quantity) as total_revenue
      FROM orders
      WHERE order_date >= $1
      GROUP BY category
      ORDER BY total_revenue DESC
    `;

    // Execute the query with positional parameters
    const response = await client.db.executeQuery({
      query,
      params: ["2025-01-01"],
    });

    // Handle the successful response
    console.log("Sales report generated successfully");
    console.log("Report data:", response.data);
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error generating sales report:", errorMessage);
    throw error;
  }
}

export async function searchUsers() {
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
    // Query using named parameters for all values
    const response = await client.db.executeQuery({
      query:
        "SELECT * FROM users WHERE status = {status} AND created_at >= {created_after} ORDER BY {sort_by} LIMIT {limit}",
      params: {
        status: "active",
        created_after: "2025-01-01",
        sort_by: "created_at",
        limit: 50,
      },
    });

    console.log("Search completed successfully");
    console.log("Results:", response.data);
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error searching users:", errorMessage);
    throw error;
  }
}

// Export a function to run all examples (for backward compatibility)
export async function dbQuery(taskId: number) {
  // Call the function - matching smoke test
  await fetchTaskById(taskId);
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
