import Worqhat from "worqhat";

export async function createUser() {
  // Initialize the client with your API key
  const apiKey = process.env.WORQHAT_API_KEY;
  if (!apiKey) {
    throw new Error("WORQHAT_API_KEY environment variable is required");
  }

  const client = new Worqhat({
    apiKey, // Always use environment variables for API keys
  });

  try {
    // Call the insertRecord method
    const response = await client.db.insertRecord({
      table: "users", // The table to insert into
      data: {
        // The data to insert
        name: "John Doe",
        email: "john@example.com",
        role: "user",
        active: true,
      },
    });

    // Handle the successful response
    console.log("User created with ID:", (response.data as any).documentId);
    console.log("Created user:", response.data);
    return response;
  } catch (error) {
    // Handle any errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error creating user:", errorMessage);
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

export async function createMultipleProducts() {
  // Initialize the client with your API key
  const apiKey = process.env.WORQHAT_API_KEY;
  if (!apiKey) {
    throw new Error("WORQHAT_API_KEY environment variable is required");
  }

  const client = new Worqhat({
    apiKey,
  });

  try {
    // Call the insertRecord method with an array of data objects
    const response = await client.db.insertRecord({
      table: "products", // The table to insert into
      data: [
        // Array of data objects to insert
        {
          name: "Basic Widget",
          price: 19.99,
          inStock: true,
          category: "essentials",
        },
        {
          name: "Standard Widget",
          price: 49.99,
          inStock: true,
          category: "essentials",
        },
        {
          name: "Premium Widget",
          price: 99.99,
          inStock: false,
          category: "premium",
        },
      ],
    });

    // Handle the successful response
    console.log(`Inserted ${(response.data as any[]).length} products`);
    console.log("Created products:", response.data);
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error creating products:", errorMessage);
    throw error;
  }
}

// Export a function to run all examples (for backward compatibility)
export async function dbInsert() {
  // Call the function
  await createUser();

  // Call the function
  await createProductWithCustomId();

  // Call the function
  await createMultipleProducts();
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
