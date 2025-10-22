import Worqhat from "worqhat";
import fs from "fs";
import path from "path";

export async function processDocument() {
  // Initialize the WorqHat client
  const apiKey = process.env.WORQHAT_API_KEY;
  if (!apiKey) {
    throw new Error("WORQHAT_API_KEY environment variable is required");
  }

  const client = new Worqhat({
    apiKey, // Always use environment variables for API keys
    environment: process.env.WORQHAT_ENVIRONMENT || "production", // Defaults to production
  });

  try {
    // RECOMMENDED: Use a readable stream for efficient file handling
    const filePath = path.resolve("./contract.pdf");
    const fileStream = fs.createReadStream(filePath);

    // Trigger the document processing workflow
    const response = await client.flows.triggerWithFile(
      "document-processing-workflow-id",
      {
        file: fileStream, // Pass the stream directly
        // Additional fields go directly on the payload
        documentType: "contract",
        priority: "high",
        department: "legal",
        requestedBy: "jane.smith@example.com",
      }
    );

    console.log(
      `Document processing started! Tracking ID: ${response.analytics_id}`
    );
    return response;
  } catch (error) {
    // Handle any errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error processing document:", errorMessage);
    throw error;
  }
}

export async function processRemoteImage() {
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
    // Trigger the image analysis workflow with a URL
    const response = await client.flows.triggerWithFile(
      "image-analysis-workflow-id",
      {
        url: "https://storage.example.com/products/laptop-x1.jpg",
        // Additional fields go directly on the payload
        imageType: "product",
        category: "electronics",
        productId: "PROD-12345",
      }
    );

    console.log(
      `Image analysis started! Tracking ID: ${response.analytics_id}`
    );
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error processing remote image:", errorMessage);
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
export async function triggerFlowWithFile() {
  // Call the function
  await processDocument();

  // Call the function
  await processRemoteImage();

  // Call the function
  await processDocumentWithParams();
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
