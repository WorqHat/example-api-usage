import Worqhat from "worqhat";
import fs from "fs";
import path from "path";

export async function uploadDocument() {
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
    const filePath = path.resolve("./document.pdf"); // Assuming document.pdf exists
    const fileStream = fs.createReadStream(filePath);

    // Call the uploadFile method
    const response = await client.storage.uploadFile({
      file: fileStream,
      path: "documents/", // Optional custom path
    });

    // Handle the successful response
    console.log("File uploaded successfully!");
    console.log("File ID:", response.file.id);
    console.log("Download URL:", response.file.url);
    console.log("File size:", response.file.size, "bytes");
    return response;
  } catch (error) {
    // Handle any errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error uploading file:", errorMessage);
    throw error;
  }
}

export async function uploadInvoice() {
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
    const filePath = path.resolve("./invoice_001.pdf"); // Assuming invoice_001.pdf exists
    const fileStream = fs.createReadStream(filePath);

    // Upload invoice to organized path
    const response = await client.storage.uploadFile({
      file: fileStream,
      path: "invoices/2025/january/", // Organized path structure
    });

    // Handle the successful response
    console.log(`Invoice uploaded to: ${response.file.path}`);
    console.log("File ID:", response.file.id);
    return response;
  } catch (error) {
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

export async function fetchFileByPath(filepath: string) {
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
    // Call the retrieveFileByPath method
    const response = await client.storage.retrieveFileByPath({
      filepath,
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
