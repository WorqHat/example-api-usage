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

export async function createProductWithCustomId() {
  // Initialize the client with your API key
  const apiKey = process.env.WORQHAT_API_KEY;
  if (!apiKey) {
    throw new Error("WORQHAT_API_KEY environment variable is required");
  }

  const client = new Worqhat({
    apiKey,
  });

  try {
    // Generate a custom ID
    const customId = `prod_${Date.now()}`;

    // Call the insertRecord method with custom documentId
    const response = await client.db.insertRecord({
      table: "products", // The table to insert into
      data: {
        // The data to insert
        documentId: customId, // Specify your own document ID
        name: "Premium Widget",
        price: 99.99,
        inStock: true,
        category: "electronics",
      },
    });

    // Handle the successful response
    console.log(
      `Product created with custom ID: ${(response.data as any).documentId}`
    );
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error creating product:", errorMessage);
    throw error;
  }
}

// Removed createMultipleProducts to avoid type conflicts - smoke test only uses single inserts

// Export a function to run all examples (for backward compatibility)
export async function dbInsert() {
  // Call the function - matching smoke test
  await createTask();
}

// Sample Response

// Single user insert response:
//  {
//   "success": true,
//   "data": {
//     "documentId": "doc_12345abcde",
//     "name": "John Doe",
//     "email": "john@example.com",
//     "role": "user",
//     "active": true
//   },
//   "message": "Record inserted successfully"
// }

// Product insert with custom ID response:
//  {
//   "success": true,
//   "data": {
//     "documentId": "prod_1627384950",
//     "name": "Premium Widget",
//     "price": 99.99,
//     "inStock": true,
//     "category": "electronics"
//   },
//   "message": "Record inserted successfully"
// }

// Bulk products insert response:
//  {
//   "success": true,
//   "data": [
//     {
//       "documentId": "doc_12345abcde",
//       "name": "Basic Widget",
//       "price": 19.99,
//       "inStock": true,
//       "category": "essentials"
//     },
//     {
//       "documentId": "doc_67890fghij",
//       "name": "Standard Widget",
//       "price": 49.99,
//       "inStock": true,
//       "category": "essentials"
//     },
//     {
//       "documentId": "doc_54321klmno",
//       "name": "Premium Widget",
//       "price": 99.99,
//       "inStock": false,
//       "category": "premium"
//     }
//   ],
//   "message": "3 records inserted successfully"
// }
