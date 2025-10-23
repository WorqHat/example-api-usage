import Worqhat from "worqhat";
import fs from "fs";
import path from "path";

export async function processInvoiceFile() {
  // Initialize the WorqHat client - matching smoke test
  const apiKey = process.env.WORQHAT_API_KEY;
  if (!apiKey) {
    throw new Error("WORQHAT_API_KEY environment variable is required");
  }

  const client = new Worqhat({
    apiKey, // Always use environment variables for API keys
    environment: process.env.WORQHAT_ENVIRONMENT || "production", // Defaults to production
  });

  try {
    // RECOMMENDED: Use a readable stream for efficient file handling - matching smoke test
    const filePath = path.resolve(__dirname, "../Invoice.pdf");
    const fileStream = fs.createReadStream(filePath);

    // Trigger the file workflow - matching smoke test
    const response = await client.flows.triggerWithFile(
      "fdd76a77-8906-403a-850c-d9eed906c47a", // File workflow ID from smoke test
      {
        file: fileStream, // Pass the stream directly
        prompt: "value1", // Matching smoke test payload
      }
    );

    console.log(
      `Invoice processing started! Tracking ID: ${response.analytics_id}`
    );
    return response;
  } catch (error) {
    // Handle any errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error processing invoice:", errorMessage);
    throw error;
  }
}

export async function processInvoiceUrl(url: string) {
  // Initialize the WorqHat client - matching smoke test
  const apiKey = process.env.WORQHAT_API_KEY;
  if (!apiKey) {
    throw new Error("WORQHAT_API_KEY environment variable is required");
  }

  const client = new Worqhat({
    apiKey,
    environment: process.env.WORQHAT_ENVIRONMENT || "production", // Defaults to production
  });

  try {
    // Trigger the file workflow with URL - matching smoke test
    const response = await client.flows.triggerWithFile(
      "fdd76a77-8906-403a-850c-d9eed906c47a", // File workflow ID from smoke test
      {
        url: url, // Use provided URL
        prompt: "value1", // Matching smoke test payload
      }
    );

    console.log(
      `Invoice URL processing started! Tracking ID: ${response.analytics_id}`
    );
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error processing invoice URL:", errorMessage);
    throw error;
  }
}

export async function processDocumentWithParams() {
  // Initialize the WorqHat client
  const apiKey = process.env.WORQHAT_API_KEY;
  if (!apiKey) {
    throw new Error("WORQHAT_API_KEY environment variable is required");
  }

  const client = new Worqhat({
    apiKey,
    environment: process.env.WORQHAT_ENVIRONMENT || "production", // Defaults to production
  });

  try {
    const fileStream = fs.createReadStream("./contract.pdf");

    // Pass additional parameters directly in the payload
    const response = await client.flows.triggerWithFile(
      "document-processing-workflow-id",
      {
        file: fileStream,
        // Additional parameters
        customerId: "CID-12345",
        department: "legal",
        requireSignature: true,
        processingMode: "detailed",
      }
    );

    console.log(
      `Document processing started! Tracking ID: ${response.analytics_id}`
    );
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error processing document:", errorMessage);
    throw error;
  }
}

// Export a function to run all examples (for backward compatibility)
export async function triggerFlowWithFile(url?: string) {
  // Call the function - matching smoke test
  await processInvoiceFile();

  // Call the function with URL if provided - matching smoke test
  if (url) {
    await processInvoiceUrl(url);
  }
}

// Sample Response

// {
//   success: true,
//   statusCode: '200',
//   data: {
//     output: `In the picture, I see a cute cartoon cat wearing a Santa hat. It's holding a sign that says "Hi" along with a paw print. The cat is also wearing a red collar with a round charm on it. The overall style is cheerful and festive.\n`,
//     data1: 'value1',
//     data2: 'value2'
//   },
//   message: 'Workflow triggered successfully with file upload'
// }
