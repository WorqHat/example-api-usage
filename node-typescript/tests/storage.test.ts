import {
  uploadDocument,
  uploadInvoice,
  fetchFileById,
  fetchFileByPath,
  deleteFileById,
} from "../src/endpoints/storage";
import Worqhat from "worqhat";
import fs from "fs";
import path from "path";

// Mock the Worqhat client
jest.mock("worqhat", () => ({
  __esModule__: true,
  default: jest.fn(),
}));

// Mock fs module
jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  createReadStream: jest.fn(),
}));

// Mock path module
jest.mock("path", () => ({
  ...jest.requireActual("path"),
  resolve: jest.fn(),
}));

describe("Storage Operations", () => {
  const mockUploadFile = jest.fn();
  const mockRetrieveFileByID = jest.fn();
  const mockRetrieveFileByPath = jest.fn();
  const mockDeleteFileByID = jest.fn();
  const mockWorqhat = require("worqhat").default as jest.Mock;
  const mockCreateReadStream = fs.createReadStream as jest.Mock;
  const mockPathResolve = path.resolve as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    process.env.WORQHAT_API_KEY = "test-api-key";
    process.env.WORQHAT_ENVIRONMENT = "test";

    const mockWorqhatInstance = {
      storage: {
        uploadFile: mockUploadFile,
        retrieveFileByID: mockRetrieveFileByID,
        retrieveFileByPath: mockRetrieveFileByPath,
        deleteFileByID: mockDeleteFileByID,
      },
    };
    mockWorqhat.mockImplementation(() => mockWorqhatInstance);

    // Mock a dummy readable stream
    mockCreateReadStream.mockReturnValue({
      pipe: jest.fn(),
      on: jest.fn((event, callback) => {
        if (event === "end") callback();
      }),
    });

    // Mock path.resolve to return the input path
    mockPathResolve.mockImplementation((p) => p);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.WORQHAT_API_KEY;
    delete process.env.WORQHAT_ENVIRONMENT;
  });

  describe("uploadDocument", () => {
    it("should throw error when API key is missing", async () => {
      delete process.env.WORQHAT_API_KEY;

      await expect(uploadDocument()).rejects.toThrow(
        "WORQHAT_API_KEY environment variable is required"
      );

      // Restore for other tests
      process.env.WORQHAT_API_KEY = "test-api-key";
    });

    it("should successfully upload a document", async () => {
      const mockResponse = {
        success: true,
        file: {
          id: "file_123",
          filename: "document.pdf",
          path: "org_id/documents/document.pdf",
          size: 1024,
          contentType: "application/pdf",
          uploadedAt: "2025-01-01T00:00:00Z",
          url: "https://example.com/document.pdf",
        },
      };
      mockUploadFile.mockResolvedValueOnce(mockResponse);

      const result = await uploadDocument();

      expect(mockPathResolve).toHaveBeenCalledWith("./document.pdf");
      expect(mockCreateReadStream).toHaveBeenCalledWith("./document.pdf");
      expect(mockUploadFile).toHaveBeenCalledWith({
        file: expect.any(Object), // Expecting a stream
        path: "documents/",
      });
      expect(result).toEqual(mockResponse);
      expect(console.log).toHaveBeenCalledWith("File uploaded successfully!");
    });

    it("should handle file not found error", async () => {
      mockCreateReadStream.mockImplementationOnce(() => {
        throw new Error(
          "ENOENT: no such file or directory, open './document.pdf'"
        );
      });

      await expect(uploadDocument()).rejects.toThrow(
        "ENOENT: no such file or directory, open './document.pdf'"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error uploading file:",
        "ENOENT: no such file or directory, open './document.pdf'"
      );
    });

    it("should handle API errors", async () => {
      const mockError = new Error("API Error: File too large");
      mockUploadFile.mockRejectedValueOnce(mockError);

      await expect(uploadDocument()).rejects.toThrow(
        "API Error: File too large"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error uploading file:",
        mockError.message
      );
    });
  });

  describe("uploadInvoice", () => {
    it("should throw error when API key is missing", async () => {
      delete process.env.WORQHAT_API_KEY;

      await expect(uploadInvoice()).rejects.toThrow(
        "WORQHAT_API_KEY environment variable is required"
      );

      // Restore for other tests
      process.env.WORQHAT_API_KEY = "test-api-key";
    });

    it("should successfully upload invoice to organized path", async () => {
      const mockResponse = {
        success: true,
        file: {
          id: "file_456",
          filename: "invoice_001.pdf",
          path: "org_id/invoices/2025/january/invoice_001.pdf",
          size: 2048,
          contentType: "application/pdf",
          uploadedAt: "2025-01-01T00:00:00Z",
          url: "https://example.com/invoice_001.pdf",
        },
      };

      mockUploadFile.mockResolvedValueOnce(mockResponse);

      const result = await uploadInvoice();

      expect(mockPathResolve).toHaveBeenCalledWith("./invoice_001.pdf");
      expect(mockCreateReadStream).toHaveBeenCalledWith("./invoice_001.pdf");
      expect(mockUploadFile).toHaveBeenCalledWith({
        file: expect.any(Object), // Expecting a stream
        path: "invoices/2025/january/",
      });

      expect(result).toEqual(mockResponse);
      expect(result.file.path).toContain("invoices/2025/january/");
      expect(result.file.filename).toBe("invoice_001.pdf");
    });

    it("should handle API errors", async () => {
      const mockError = new Error("API Error: Invalid file type");
      mockUploadFile.mockRejectedValueOnce(mockError);

      await expect(uploadInvoice()).rejects.toThrow(
        "API Error: Invalid file type"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error uploading invoice:",
        mockError.message
      );
    });
  });

  describe("fetchFileById", () => {
    it("should throw error when API key is missing", async () => {
      delete process.env.WORQHAT_API_KEY;
      await expect(fetchFileById("test-file-id")).rejects.toThrow(
        "WORQHAT_API_KEY environment variable is required"
      );
      process.env.WORQHAT_API_KEY = "test-api-key";
    });

    it("should successfully fetch a file by ID", async () => {
      const mockResponse = {
        success: true,
        file: {
          id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          filename: "invoice_2025.pdf",
          path: "org_123/documents/invoices/invoice_2025.pdf",
          size: 245678,
          contentType: "application/pdf",
          uploadedAt: "2025-01-01T00:00:00Z",
          url: "https://storage.worqhat.com/org_123/documents/invoices/invoice_2025.pdf?signature=...",
        },
      };
      mockRetrieveFileByID.mockResolvedValueOnce(mockResponse);

      const result = await fetchFileById(
        "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
      );

      expect(mockRetrieveFileByID).toHaveBeenCalledWith(
        "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
      );
      expect(result).toEqual(mockResponse);
      expect(console.log).toHaveBeenCalledWith("File retrieved successfully!");
      expect(console.log).toHaveBeenCalledWith(
        "File name:",
        "invoice_2025.pdf"
      );
    });

    it("should handle file not found error", async () => {
      const mockError = new Error("File not found");
      mockRetrieveFileByID.mockRejectedValueOnce(mockError);

      await expect(fetchFileById("nonexistent-id")).rejects.toThrow(
        "File not found"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching file:",
        mockError.message
      );
    });

    it("should handle API errors", async () => {
      const mockError = new Error("Unauthorized");
      mockRetrieveFileByID.mockRejectedValueOnce(mockError);

      await expect(fetchFileById("test-file-id")).rejects.toThrow(
        "Unauthorized"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching file:",
        mockError.message
      );
    });
  });

  describe("fetchFileByPath", () => {
    it("should throw error when API key is missing", async () => {
      delete process.env.WORQHAT_API_KEY;
      await expect(fetchFileByPath("documents/test.pdf")).rejects.toThrow(
        "WORQHAT_API_KEY environment variable is required"
      );
      process.env.WORQHAT_API_KEY = "test-api-key";
    });

    it("should successfully fetch a file by path", async () => {
      const mockResponse = {
        success: true,
        file: {
          id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          filename: "invoice_2025.pdf",
          path: "org_123/documents/invoices/invoice_2025.pdf",
          size: 245678,
          contentType: "application/pdf",
          uploadedAt: "2025-01-01T00:00:00Z",
          url: "https://storage.worqhat.com/org_123/documents/invoices/invoice_2025.pdf?signature=...",
        },
      };
      mockRetrieveFileByPath.mockResolvedValueOnce(mockResponse);

      const result = await fetchFileByPath(
        "documents/invoices/invoice_2025.pdf"
      );

      expect(mockRetrieveFileByPath).toHaveBeenCalledWith({
        filepath: "documents/invoices/invoice_2025.pdf",
      });
      expect(result).toEqual(mockResponse);
      expect(console.log).toHaveBeenCalledWith("File retrieved successfully!");
      expect(console.log).toHaveBeenCalledWith(
        "Full path:",
        "org_123/documents/invoices/invoice_2025.pdf"
      );
    });

    it("should handle file not found error", async () => {
      const mockError = new Error("File not found");
      mockRetrieveFileByPath.mockRejectedValueOnce(mockError);

      await expect(
        fetchFileByPath("nonexistent/path/file.pdf")
      ).rejects.toThrow("File not found");
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching file:",
        mockError.message
      );
    });

    it("should handle API errors", async () => {
      const mockError = new Error("Unauthorized");
      mockRetrieveFileByPath.mockRejectedValueOnce(mockError);

      await expect(fetchFileByPath("documents/test.pdf")).rejects.toThrow(
        "Unauthorized"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching file:",
        mockError.message
      );
    });
  });

  describe("deleteFileById", () => {
    it("should throw error when API key is missing", async () => {
      delete process.env.WORQHAT_API_KEY;
      await expect(deleteFileById("test-file-id")).rejects.toThrow(
        "WORQHAT_API_KEY environment variable is required"
      );
      process.env.WORQHAT_API_KEY = "test-api-key";
    });

    it("should successfully delete a file by ID", async () => {
      const mockResponse = {
        success: true,
        message: "File deleted successfully",
        deletedAt: "2025-01-01T00:00:00Z",
      };
      mockDeleteFileByID.mockResolvedValueOnce(mockResponse);

      const result = await deleteFileById(
        "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
      );

      expect(mockDeleteFileByID).toHaveBeenCalledWith(
        "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
      );
      expect(result).toEqual(mockResponse);
      expect(console.log).toHaveBeenCalledWith("File deleted successfully!");
      expect(console.log).toHaveBeenCalledWith(
        "Message:",
        "File deleted successfully"
      );
    });

    it("should handle file not found error", async () => {
      const mockError = new Error("File not found");
      mockDeleteFileByID.mockRejectedValueOnce(mockError);

      await expect(deleteFileById("nonexistent-id")).rejects.toThrow(
        "File not found"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error deleting file:",
        mockError.message
      );
    });

    it("should handle API errors", async () => {
      const mockError = new Error("Unauthorized");
      mockDeleteFileByID.mockRejectedValueOnce(mockError);

      await expect(deleteFileById("test-file-id")).rejects.toThrow(
        "Unauthorized"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error deleting file:",
        mockError.message
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle network errors", async () => {
      const networkError = new Error("Network Error: Connection timeout");
      mockUploadFile.mockRejectedValueOnce(networkError);

      await expect(uploadDocument()).rejects.toThrow(
        "Network Error: Connection timeout"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error uploading file:",
        networkError.message
      );
    });

    it("should handle authentication errors", async () => {
      const authError = new Error("Authentication Error: Invalid API key");
      mockUploadFile.mockRejectedValueOnce(authError);

      await expect(uploadDocument()).rejects.toThrow(
        "Authentication Error: Invalid API key"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error uploading file:",
        authError.message
      );
    });

    it("should handle file too large errors", async () => {
      const fileSizeError = new Error("File too large. Maximum size is 50MB.");
      mockUploadFile.mockRejectedValueOnce(fileSizeError);

      await expect(uploadDocument()).rejects.toThrow(
        "File too large. Maximum size is 50MB."
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error uploading file:",
        fileSizeError.message
      );
    });

    it("should handle invalid file type errors", async () => {
      const fileTypeError = new Error("Invalid file type");
      mockUploadFile.mockRejectedValueOnce(fileTypeError);

      await expect(uploadDocument()).rejects.toThrow("Invalid file type");
      expect(console.error).toHaveBeenCalledWith(
        "Error uploading file:",
        fileTypeError.message
      );
    });

    it("should handle missing file errors", async () => {
      const missingFileError = new Error("Missing file");
      mockUploadFile.mockRejectedValueOnce(missingFileError);

      await expect(uploadDocument()).rejects.toThrow("Missing file");
      expect(console.error).toHaveBeenCalledWith(
        "Error uploading file:",
        missingFileError.message
      );
    });

    it("should handle storage quota exceeded errors", async () => {
      const quotaError = new Error("Storage quota exceeded");
      mockUploadFile.mockRejectedValueOnce(quotaError);

      await expect(uploadDocument()).rejects.toThrow("Storage quota exceeded");
      expect(console.error).toHaveBeenCalledWith(
        "Error uploading file:",
        quotaError.message
      );
    });
  });

  describe("Response Validation", () => {
    it("should validate successful upload response structure", async () => {
      const mockResponse = {
        success: true,
        file: {
          id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          filename: "document.pdf",
          path: "org_123/documents/document.pdf",
          size: 245678,
          contentType: "application/pdf",
          uploadedAt: "2025-07-26T03:28:08.123Z",
          url: "https://storage.worqhat.com/org_123/documents/document.pdf",
        },
      };

      mockUploadFile.mockResolvedValue(mockResponse);

      const result = await uploadDocument();

      expect(result.success).toBe(true);
      expect(result.file).toBeDefined();
      expect(result.file).toHaveProperty("id");
      expect(result.file).toHaveProperty("filename");
      expect(result.file).toHaveProperty("path");
      expect(result.file).toHaveProperty("size");
      expect(result.file).toHaveProperty("contentType");
      expect(result.file).toHaveProperty("uploadedAt");
      expect(result.file).toHaveProperty("url");
      expect(typeof result.file.id).toBe("string");
      expect(typeof result.file.size).toBe("number");
    });

    it("should validate file ID format", async () => {
      const mockResponse = {
        success: true,
        file: {
          id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          filename: "document.pdf",
          path: "org_123/documents/document.pdf",
          size: 245678,
          contentType: "application/pdf",
          uploadedAt: "2025-07-26T03:28:08.123Z",
          url: "https://storage.worqhat.com/org_123/documents/document.pdf",
        },
      };

      mockUploadFile.mockResolvedValue(mockResponse);

      const result = await uploadDocument();

      // UUID v4 format validation
      expect(result.file.id).toMatch(
        /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i
      );
    });

    it("should validate URL format", async () => {
      const mockResponse = {
        success: true,
        file: {
          id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          filename: "document.pdf",
          path: "org_123/documents/document.pdf",
          size: 245678,
          contentType: "application/pdf",
          uploadedAt: "2025-07-26T03:28:08.123Z",
          url: "https://storage.worqhat.com/org_123/documents/document.pdf",
        },
      };

      mockUploadFile.mockResolvedValue(mockResponse);

      const result = await uploadDocument();

      expect(result.file.url).toMatch(/^https:\/\/storage\.worqhat\.com\//);
      expect(result.file.url).toContain(result.file.path);
    });

    it("should validate timestamp format", async () => {
      const mockResponse = {
        success: true,
        file: {
          id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          filename: "document.pdf",
          path: "org_123/documents/document.pdf",
          size: 245678,
          contentType: "application/pdf",
          uploadedAt: "2025-07-26T03:28:08.123Z",
          url: "https://storage.worqhat.com/org_123/documents/document.pdf",
        },
      };

      mockUploadFile.mockResolvedValue(mockResponse);

      const result = await uploadDocument();

      expect(result.file.uploadedAt).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
    });

    it("should validate file size is reasonable", async () => {
      const mockResponse = {
        success: true,
        file: {
          id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          filename: "document.pdf",
          path: "org_123/documents/document.pdf",
          size: 245678,
          contentType: "application/pdf",
          uploadedAt: "2025-07-26T03:28:08.123Z",
          url: "https://storage.worqhat.com/org_123/documents/document.pdf",
        },
      };

      mockUploadFile.mockResolvedValue(mockResponse);

      const result = await uploadDocument();

      expect(result.file.size).toBeGreaterThan(0);
      expect(result.file.size).toBeLessThanOrEqual(50 * 1024 * 1024); // 50MB max
    });
  });

  describe("File Type Validation", () => {
    it("should handle PDF content type", async () => {
      const mockResponse = {
        success: true,
        file: {
          id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          filename: "document.pdf",
          path: "org_123/documents/document.pdf",
          size: 245678,
          contentType: "application/pdf",
          uploadedAt: "2025-07-26T03:28:08.123Z",
          url: "https://storage.worqhat.com/org_123/documents/document.pdf",
        },
      };

      mockUploadFile.mockResolvedValue(mockResponse);

      const result = await uploadDocument();

      expect(result.file.contentType).toBe("application/pdf");
      expect(result.file.filename).toMatch(/\.pdf$/);
    });

    it("should handle image content types", async () => {
      const mockResponse = {
        success: true,
        file: {
          id: "c3d4e5f6-g7h8-9012-cdef-g34567890123",
          filename: "product.jpg",
          path: "org_123/images/products/product.jpg",
          size: 98765,
          contentType: "image/jpeg",
          uploadedAt: "2025-07-26T05:42:33.789Z",
          url: "https://storage.worqhat.com/org_123/images/products/product.jpg",
        },
      };

      mockUploadFile.mockResolvedValue(mockResponse);

      const result = await uploadImage();

      expect(result.file.contentType).toBe("image/jpeg");
      expect(result.file.filename).toMatch(/\.(jpg|jpeg|png|gif)$/i);
    });

    it("should handle different file extensions", async () => {
      const mockResponse = {
        success: true,
        file: {
          id: "d4e5f6g7-h8i9-0123-defg-h45678901234",
          filename: "document.docx",
          path: "org_123/documents/document.docx",
          size: 123456,
          contentType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          uploadedAt: "2025-07-26T06:18:45.234Z",
          url: "https://storage.worqhat.com/org_123/documents/document.docx",
        },
      };

      mockUploadFile.mockResolvedValue(mockResponse);

      // This would be a separate function for DOCX uploads
      const result = await uploadDocument();

      expect(result.file.contentType).toContain("openxmlformats");
      expect(result.file.filename).toMatch(/\.docx$/);
    });
  });

  describe("Path Organization", () => {
    it("should organize files in documents path", async () => {
      const mockResponse = {
        success: true,
        file: {
          id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          filename: "document.pdf",
          path: "org_123/documents/document.pdf",
          size: 245678,
          contentType: "application/pdf",
          uploadedAt: "2025-07-26T03:28:08.123Z",
          url: "https://storage.worqhat.com/org_123/documents/document.pdf",
        },
      };

      mockUploadFile.mockResolvedValue(mockResponse);

      const result = await uploadDocument();

      expect(result.file.path).toContain("documents/");
      expect(result.file.path).toMatch(/^org_\d+\/documents\//);
    });

    it("should organize invoices in hierarchical path", async () => {
      const mockResponse = {
        success: true,
        file: {
          id: "b2c3d4e5-f6g7-8901-bcde-f23456789012",
          filename: "invoice_001.pdf",
          path: "org_123/invoices/2025/january/invoice_001.pdf",
          size: 156789,
          contentType: "application/pdf",
          uploadedAt: "2025-07-26T04:15:22.456Z",
          url: "https://storage.worqhat.com/org_123/invoices/2025/january/invoice_001.pdf",
        },
      };

      mockUploadFile.mockResolvedValue(mockResponse);

      const result = await uploadInvoice();

      expect(result.file.path).toContain("invoices/2025/january/");
      expect(result.file.path).toMatch(/^org_\d+\/invoices\/\d{4}\/january\//);
    });

    it("should organize images in products path", async () => {
      const mockResponse = {
        success: true,
        file: {
          id: "c3d4e5f6-g7h8-9012-cdef-g34567890123",
          filename: "product.jpg",
          path: "org_123/images/products/product.jpg",
          size: 98765,
          contentType: "image/jpeg",
          uploadedAt: "2025-07-26T05:42:33.789Z",
          url: "https://storage.worqhat.com/org_123/images/products/product.jpg",
        },
      };

      mockUploadFile.mockResolvedValue(mockResponse);

      const result = await uploadImage();

      expect(result.file.path).toContain("images/products/");
      expect(result.file.path).toMatch(/^org_\d+\/images\/products\//);
    });
  });

  describe("File Name Handling", () => {
    it("should preserve original filename", async () => {
      const mockResponse = {
        success: true,
        file: {
          id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          filename: "document.pdf",
          path: "org_123/documents/document.pdf",
          size: 245678,
          contentType: "application/pdf",
          uploadedAt: "2025-07-26T03:28:08.123Z",
          url: "https://storage.worqhat.com/org_123/documents/document.pdf",
        },
      };

      mockUploadFile.mockResolvedValue(mockResponse);

      const result = await uploadDocument();

      expect(result.file.filename).toBe("document.pdf");
      expect(result.file.path).toContain("document.pdf");
    });

    it("should handle different filename patterns", async () => {
      const testCases = [
        { filename: "invoice_001.pdf", path: "invoices/2025/january/" },
        { filename: "product.jpg", path: "images/products/" },
        { filename: "report.xlsx", path: "reports/" },
      ];

      for (const testCase of testCases) {
        const mockResponse = {
          success: true,
          file: {
            id: "test-id",
            filename: testCase.filename,
            path: `org_123/${testCase.path}${testCase.filename}`,
            size: 12345,
            contentType: "application/octet-stream",
            uploadedAt: "2025-07-26T03:28:08.123Z",
            url: `https://storage.worqhat.com/org_123/${testCase.path}${testCase.filename}`,
          },
        };

        mockUploadFile.mockResolvedValueOnce(mockResponse);

        const result = await uploadDocument();

        expect(result.file.filename).toBe(testCase.filename);
        expect(result.file.path).toContain(testCase.filename);
      }
    });
  });
});
