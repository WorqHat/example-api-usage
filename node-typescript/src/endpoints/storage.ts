import Worqhat from "worqhat";
import fs from "fs";
import path from "path";

export async function uploadInvoice() {
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
    const filePath = path.resolve(__dirname, "../Invoice.pdf"); // Matching smoke test path
    const fileStream = fs.createReadStream(filePath);

    // Call the uploadFile method - matching smoke test
    const response = await client.storage.uploadFile({
      file: fileStream,
      path: "invoices/", // Matching smoke test path
    });

    // Handle the successful response
    console.log("Invoice uploaded successfully!");
    console.log("File ID:", response.file.id);
    console.log("Download URL:", response.file.url);
    console.log("File path:", response.file.path);
    return response;
  } catch (error) {
    // Handle any errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error uploading invoice:", errorMessage);
    throw error;
  }
}

export async function fetchFileById(fileId: string) {
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
    // Call the retrieveFileByID method
    const response = await client.storage.retrieveFileByID(fileId);

    // Handle the successful response
    console.log("File retrieved successfully!");
    console.log("File name:", response.file.filename);
    console.log("File size:", response.file.size, "bytes");
    console.log("Download URL:", response.file.url);
    console.log("Uploaded at:", response.file.uploadedAt);
    return response;
  } catch (error) {
    // Handle any errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching file:", errorMessage);
    throw error;
  }
}

export async function fetchInvoiceByPath(filename: string = "Invoice.pdf") {
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
    // Call the retrieveFileByPath method - matching smoke test
    const response = await client.storage.retrieveFileByPath({
      filepath: `invoices/${filename}`, // Matching smoke test path
    });

    // Handle the successful response
    console.log("File retrieved successfully!");
    console.log("File name:", response.file.filename);
    console.log("File size:", response.file.size, "bytes");
    console.log("Download URL:", response.file.url);
    console.log("Full path:", response.file.path);
    return response;
  } catch (error) {
    // Handle any errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching file:", errorMessage);
    throw error;
  }
}

export async function deleteFileById(fileId: string) {
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
    // Call the deleteFileByID method
    const response = await client.storage.deleteFileByID(fileId);

    // Handle the successful response
    console.log("File deleted successfully!");
    console.log("Message:", response.message);
    console.log("Deleted at:", response.deletedAt);
    return response;
  } catch (error) {
    // Handle any errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error deleting file:", errorMessage);
    throw error;
  }
}

// Export a function to run all examples (for backward compatibility)
export async function storage() {
  // Call the function - matching smoke test
  await uploadInvoice();
}
