import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";

export async function uploadInvoice() {
  const apiKey = process.env.WORQHAT_API_KEY;
  if (!apiKey) {
    throw new Error("WORQHAT_API_KEY environment variable is required");
  }

  try {
    const filePath = path.resolve(__dirname, "../Invoice.pdf");
    if (!fs.existsSync(filePath)) {
      throw new Error(`Invoice file not found at ${filePath}`);
    }
    const fileStream = fs.createReadStream(filePath);

    const form = new FormData();
    form.append("file", fileStream);
    form.append("path", "invoices/");

    const response = await axios.post(
      "https://api.worqhat.com/storage/upload",
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    console.log("Invoice uploaded successfully!");
    console.log("File ID:", response.data.file.id);
    console.log("Download URL:", response.data.file.url);
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error uploading invoice:", errorMessage);
    throw error;
  }
}

export async function fetchFileById(fileId: string) {
  const apiKey = process.env.WORQHAT_API_KEY;
  if (!apiKey) {
    throw new Error("WORQHAT_API_KEY environment variable is required");
  }

  try {
    const response = await axios.get(
      `https://api.worqhat.com/storage/fetch/${fileId}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      }
    );

    console.log("File retrieved successfully!");
    console.log("File name:", response.data.file.filename);
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching file:", errorMessage);
    throw error;
  }
}

export async function fetchInvoiceByPath(filename: string = "Invoice.pdf") {
  const apiKey = process.env.WORQHAT_API_KEY;
  if (!apiKey) {
    throw new Error("WORQHAT_API_KEY environment variable is required");
  }

  try {
    const response = await axios.get(
      "https://api.worqhat.com/storage/fetch-by-path",
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        params: { filepath: `invoices/${filename}` },
      }
    );

    console.log("File retrieved successfully!");
    console.log("File name:", response.data.file.filename);
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching file:", errorMessage);
    throw error;
  }
}

export async function deleteFileById(fileId: string) {
  const apiKey = process.env.WORQHAT_API_KEY;
  if (!apiKey) {
    throw new Error("WORQHAT_API_KEY environment variable is required");
  }

  try {
    const response = await axios.delete(
      `https://api.worqhat.com/storage/delete/${fileId}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      }
    );

    console.log("File deleted successfully!");
    console.log("Message:", response.data.message);
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error deleting file:", errorMessage);
    throw error;
  }
}

export async function storage() {
  console.log("Running storage examples...");
  const uploadResponse = await uploadInvoice();
  if (uploadResponse?.file?.id) {
    await fetchFileById(uploadResponse.file.id);
    await fetchInvoiceByPath(uploadResponse.file.filename);
    await deleteFileById(uploadResponse.file.id);
  }
}
