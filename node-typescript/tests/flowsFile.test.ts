import {
  processDocument,
  processRemoteImage,
  processDocumentWithParams,
  client,
} from "../src/endpoints/flowsFile";

// Mock the Worqhat client
jest.mock("worqhat", () => ({
  __esModule__: true,
  default: jest.fn(),
}));

// Mock fs module
jest.mock("fs", () => ({
  createReadStream: jest.fn(),
}));

// Mock path module
jest.mock("path", () => ({
  resolve: jest.fn(),
}));

describe("File-Based Workflow Trigger Operations", () => {
  const mockTriggerWithFile = jest.fn();
  const mockWorqhat = require("worqhat").default as jest.Mock;
  const mockCreateReadStream = require("fs").createReadStream as jest.Mock;
  const mockPathResolve = require("path").resolve as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console methods to avoid cluttering test output
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Mock environment variables
    process.env.WORQHAT_API_KEY = "test-api-key";
    process.env.WORQHAT_ENVIRONMENT = "test";

    // Mock the Worqhat constructor
    const mockWorqhatInstance = {
      flows: {
        triggerWithFile: mockTriggerWithFile,
      },
    };

    mockWorqhat.mockImplementation(() => mockWorqhatInstance);

    // Mock fs and path
    mockCreateReadStream.mockReturnValue({} as any);
    mockPathResolve.mockImplementation((path) => path);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.WORQHAT_API_KEY;
    delete process.env.WORQHAT_ENVIRONMENT;
  });

  describe("processDocument", () => {
    it("should throw error when API key is missing", async () => {
      delete process.env.WORQHAT_API_KEY;

      await expect(processDocument()).rejects.toThrow(
        "WORQHAT_API_KEY environment variable is required"
      );

      // Restore for other tests
      process.env.WORQHAT_API_KEY = "test-api-key";
    });

    it("should successfully trigger document processing workflow", async () => {
      const mockResponse = {
        success: true,
        statusCode: "200",
        data: {
          output: "Document processed successfully",
          extractedText: "This is a sample contract...",
          confidence: 0.95,
        },
        analytics_id: "wf-exec-12345-abcde-67890",
        message: "Workflow triggered successfully with file upload",
      };

      mockTriggerWithFile.mockResolvedValueOnce(mockResponse);

      const result = await processDocument();

      expect(mockTriggerWithFile).toHaveBeenCalledWith(
        "document-processing-workflow-id",
        {
          file: {},
          documentType: "contract",
          priority: "high",
          department: "legal",
          requestedBy: "jane.smith@example.com",
        }
      );

      expect(result).toEqual(mockResponse);
      expect(mockCreateReadStream).toHaveBeenCalledWith("./contract.pdf");
    });

    it("should handle API errors", async () => {
      const mockError = new Error("API Error: Workflow not found");
      mockTriggerWithFile.mockRejectedValueOnce(mockError);

      await expect(processDocument()).rejects.toThrow(
        "API Error: Workflow not found"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error processing document:",
        mockError.message
      );
    });

    it("should handle file system errors", async () => {
      const fileError = new Error("ENOENT: no such file or directory");
      mockCreateReadStream.mockImplementationOnce(() => {
        throw fileError;
      });

      await expect(processDocument()).rejects.toThrow(
        "ENOENT: no such file or directory"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error processing document:",
        fileError.message
      );
    });
  });

  describe("processRemoteImage", () => {
    it("should throw error when API key is missing", async () => {
      delete process.env.WORQHAT_API_KEY;

      await expect(processRemoteImage()).rejects.toThrow(
        "WORQHAT_API_KEY environment variable is required"
      );

      // Restore for other tests
      process.env.WORQHAT_API_KEY = "test-api-key";
    });

    it("should successfully trigger image analysis workflow with URL", async () => {
      const mockResponse = {
        success: true,
        statusCode: "200",
        data: {
          description: "A laptop computer on a desk",
          objects: ["laptop", "desk", "chair"],
          colors: ["black", "silver"],
          confidence: 0.89,
        },
        analytics_id: "wf-exec-67890-fghij-12345",
        message: "Workflow triggered successfully with URL processing",
      };

      mockTriggerWithFile.mockResolvedValueOnce(mockResponse);

      const result = await processRemoteImage();

      expect(mockTriggerWithFile).toHaveBeenCalledWith(
        "image-analysis-workflow-id",
        {
          url: "https://storage.example.com/products/laptop-x1.jpg",
          imageType: "product",
          category: "electronics",
          productId: "PROD-12345",
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it("should handle API errors", async () => {
      const mockError = new Error("API Error: Invalid URL format");
      mockTriggerWithFile.mockRejectedValueOnce(mockError);

      await expect(processRemoteImage()).rejects.toThrow(
        "API Error: Invalid URL format"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error processing remote image:",
        mockError.message
      );
    });
  });

  describe("processDocumentWithParams", () => {
    it("should throw error when API key is missing", async () => {
      delete process.env.WORQHAT_API_KEY;

      await expect(processDocumentWithParams()).rejects.toThrow(
        "WORQHAT_API_KEY environment variable is required"
      );

      // Restore for other tests
      process.env.WORQHAT_API_KEY = "test-api-key";
    });

    it("should successfully trigger document processing with complex parameters", async () => {
      const mockResponse = {
        success: true,
        statusCode: "200",
        data: {
          processed: true,
          pages: 5,
          signatures: 2,
          validationPassed: true,
          extractedData: {
            contractValue: 50000,
            parties: ["Company A", "Company B"],
            effectiveDate: "2025-01-01",
          },
        },
        analytics_id: "wf-exec-99999-xyzab-45678",
        message: "Workflow triggered successfully with file upload",
      };

      mockTriggerWithFile.mockResolvedValueOnce(mockResponse);

      const result = await processDocumentWithParams();

      expect(mockTriggerWithFile).toHaveBeenCalledWith(
        "document-processing-workflow-id",
        {
          file: {},
          customerId: "CID-12345",
          department: "legal",
          requireSignature: true,
          processingMode: "detailed",
        }
      );

      expect(result).toEqual(mockResponse);
      expect(mockCreateReadStream).toHaveBeenCalledWith("./contract.pdf");
    });

    it("should handle API errors", async () => {
      const mockError = new Error("API Error: File too large");
      mockTriggerWithFile.mockRejectedValueOnce(mockError);

      await expect(processDocumentWithParams()).rejects.toThrow(
        "API Error: File too large"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error processing document:",
        mockError.message
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle network errors", async () => {
      const networkError = new Error("Network Error: Connection timeout");
      mockTriggerWithFile.mockRejectedValueOnce(networkError);

      await expect(processDocument()).rejects.toThrow(
        "Network Error: Connection timeout"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error processing document:",
        networkError.message
      );
    });

    it("should handle authentication errors", async () => {
      const authError = new Error("Authentication Error: Invalid API key");
      mockTriggerWithFile.mockRejectedValueOnce(authError);

      await expect(processDocument()).rejects.toThrow(
        "Authentication Error: Invalid API key"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error processing document:",
        authError.message
      );
    });

    it("should handle workflow not found errors", async () => {
      const workflowError = new Error("Workflow not found");
      mockTriggerWithFile.mockRejectedValueOnce(workflowError);

      await expect(processDocument()).rejects.toThrow("Workflow not found");
      expect(console.error).toHaveBeenCalledWith(
        "Error processing document:",
        workflowError.message
      );
    });

    it("should handle file too large errors", async () => {
      const fileSizeError = new Error("File too large. Maximum size is 100MB.");
      mockTriggerWithFile.mockRejectedValueOnce(fileSizeError);

      await expect(processDocument()).rejects.toThrow(
        "File too large. Maximum size is 100MB."
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error processing document:",
        fileSizeError.message
      );
    });

    it("should handle unsupported file type errors", async () => {
      const fileTypeError = new Error("Unsupported file type.");
      mockTriggerWithFile.mockRejectedValueOnce(fileTypeError);

      await expect(processDocument()).rejects.toThrow("Unsupported file type.");
      expect(console.error).toHaveBeenCalledWith(
        "Error processing document:",
        fileTypeError.message
      );
    });

    it("should handle rate limiting errors", async () => {
      const rateLimitError = new Error(
        "Rate limit exceeded. Please try again later."
      );
      mockTriggerWithFile.mockRejectedValueOnce(rateLimitError);

      await expect(processDocument()).rejects.toThrow(
        "Rate limit exceeded. Please try again later."
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error processing document:",
        rateLimitError.message
      );
    });
  });

  describe("Response Validation", () => {
    it("should validate successful file processing response structure", async () => {
      const mockResponse = {
        success: true,
        statusCode: "200",
        data: {
          output: "Document processed successfully",
          extractedText: "Sample contract text...",
          confidence: 0.95,
        },
        analytics_id: "wf-exec-12345-abcde-67890",
        message: "Workflow triggered successfully with file upload",
      };

      mockTriggerWithFile.mockResolvedValue(mockResponse);

      const result = await processDocument();

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe("200");
      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("analytics_id");
      expect(result).toHaveProperty("message");
      expect(typeof result.analytics_id).toBe("string");
      expect(typeof result.message).toBe("string");
    });

    it("should validate analytics ID format", async () => {
      const mockResponse = {
        success: true,
        statusCode: "200",
        data: { output: "Processed" },
        analytics_id: "wf-exec-12345-abcde-67890",
        message: "Workflow triggered successfully with file upload",
      };

      mockTriggerWithFile.mockResolvedValue(mockResponse);

      const result = await processDocument();

      expect(result.analytics_id).toMatch(/^wf-exec-[a-z0-9-]+$/);
    });

    it("should handle responses with processed data", async () => {
      const mockResponse = {
        success: true,
        statusCode: "200",
        data: {
          processedPages: 5,
          extractedEntities: ["John Doe", "Acme Corp"],
          sentiment: "neutral",
          language: "en",
          processingTime: 2.5,
        },
        analytics_id: "wf-exec-67890-fghij-12345",
        message: "Workflow triggered successfully with URL processing",
      };

      mockTriggerWithFile.mockResolvedValue(mockResponse);

      const result = await processRemoteImage();

      expect(result.data.processedPages).toBe(5);
      expect(Array.isArray(result.data.extractedEntities)).toBe(true);
      expect(result.data.extractedEntities).toHaveLength(2);
      expect(typeof result.data.processingTime).toBe("number");
    });
  });

  describe("Parameter Validation", () => {
    it("should pass correct parameters for document processing", async () => {
      const mockResponse = {
        success: true,
        statusCode: "200",
        data: { output: "Processed" },
        analytics_id: "wf-exec-12345-abcde-67890",
        message: "Workflow triggered successfully with file upload",
      };

      mockTriggerWithFile.mockResolvedValue(mockResponse);

      await processDocument();

      const callArgs = mockTriggerWithPayload.mock.calls[0];
      const workflowId = callArgs[0];
      const payload = callArgs[1];

      expect(workflowId).toBe("document-processing-workflow-id");
      expect(payload.file).toBeDefined();
      expect(payload.documentType).toBe("contract");
      expect(payload.priority).toBe("high");
      expect(payload.department).toBe("legal");
      expect(payload.requestedBy).toBe("jane.smith@example.com");
    });

    it("should pass correct parameters for image analysis", async () => {
      const mockResponse = {
        success: true,
        statusCode: "200",
        data: { output: "Analyzed" },
        analytics_id: "wf-exec-67890-fghij-12345",
        message: "Workflow triggered successfully with URL processing",
      };

      mockTriggerWithFile.mockResolvedValue(mockResponse);

      await processRemoteImage();

      const callArgs = mockTriggerWithPayload.mock.calls[0];
      const workflowId = callArgs[0];
      const payload = callArgs[1];

      expect(workflowId).toBe("image-analysis-workflow-id");
      expect(payload.url).toBe(
        "https://storage.example.com/products/laptop-x1.jpg"
      );
      expect(payload.imageType).toBe("product");
      expect(payload.category).toBe("electronics");
      expect(payload.productId).toBe("PROD-12345");
    });

    it("should pass complex parameters for advanced processing", async () => {
      const mockResponse = {
        success: true,
        statusCode: "200",
        data: { output: "Processed with params" },
        analytics_id: "wf-exec-99999-xyzab-45678",
        message: "Workflow triggered successfully with file upload",
      };

      mockTriggerWithFile.mockResolvedValue(mockResponse);

      await processDocumentWithParams();

      const callArgs = mockTriggerWithPayload.mock.calls[0];
      const workflowId = callArgs[0];
      const payload = callArgs[1];

      expect(workflowId).toBe("document-processing-workflow-id");
      expect(payload.file).toBeDefined();
      expect(payload.customerId).toBe("CID-12345");
      expect(payload.department).toBe("legal");
      expect(payload.requireSignature).toBe(true);
      expect(payload.processingMode).toBe("detailed");
    });
  });

  describe("File Stream Handling", () => {
    it("should create read stream for file processing", async () => {
      const mockResponse = {
        success: true,
        statusCode: "200",
        data: { output: "Processed" },
        analytics_id: "wf-exec-12345-abcde-67890",
        message: "Workflow triggered successfully with file upload",
      };

      mockTriggerWithFile.mockResolvedValue(mockResponse);

      await processDocument();

      expect(mockCreateReadStream).toHaveBeenCalledWith("./contract.pdf");
      expect(mockPathResolve).toHaveBeenCalledWith("./contract.pdf");
    });

    it("should create read stream for document with parameters", async () => {
      const mockResponse = {
        success: true,
        statusCode: "200",
        data: { output: "Processed with params" },
        analytics_id: "wf-exec-99999-xyzab-45678",
        message: "Workflow triggered successfully with file upload",
      };

      mockTriggerWithFile.mockResolvedValue(mockResponse);

      await processDocumentWithParams();

      expect(mockCreateReadStream).toHaveBeenCalledWith("./contract.pdf");
    });

    it("should handle file stream errors", async () => {
      const streamError = new Error("Stream error: file corrupted");
      mockCreateReadStream.mockImplementationOnce(() => {
        throw streamError;
      });

      await expect(processDocument()).rejects.toThrow(
        "Stream error: file corrupted"
      );
    });
  });

  describe("URL Processing", () => {
    it("should pass URL correctly for remote image processing", async () => {
      const mockResponse = {
        success: true,
        statusCode: "200",
        data: { description: "Image analyzed" },
        analytics_id: "wf-exec-67890-fghij-12345",
        message: "Workflow triggered successfully with URL processing",
      };

      mockTriggerWithFile.mockResolvedValue(mockResponse);

      await processRemoteImage();

      const callArgs = mockTriggerWithPayload.mock.calls[0];
      const payload = callArgs[1];

      expect(payload.url).toBe(
        "https://storage.example.com/products/laptop-x1.jpg"
      );
      expect(payload.file).toBeUndefined(); // Should not have file when using URL
    });

    it("should validate URL format", async () => {
      const mockResponse = {
        success: true,
        statusCode: "200",
        data: { output: "Processed" },
        analytics_id: "wf-exec-67890-fghij-12345",
        message: "Workflow triggered successfully with URL processing",
      };

      mockTriggerWithFile.mockResolvedValue(mockResponse);

      await processRemoteImage();

      const callArgs = mockTriggerWithPayload.mock.calls[0];
      const url = callArgs[1].url;

      expect(url).toMatch(/^https?:\/\/.+/);
      expect(url).toContain("storage.example.com");
    });
  });

  describe("Workflow Status Validation", () => {
    it("should validate workflow trigger success", async () => {
      const mockResponse = {
        success: true,
        statusCode: "200",
        data: { output: "Processed successfully" },
        analytics_id: "wf-exec-12345-abcde-67890",
        message: "Workflow triggered successfully with file upload",
      };

      mockTriggerWithFile.mockResolvedValue(mockResponse);

      const result = await processDocument();

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe("200");
      expect(result.message).toContain("triggered successfully");
    });

    it("should handle different response messages", async () => {
      const mockResponse = {
        success: true,
        statusCode: "200",
        data: { output: "URL processed successfully" },
        analytics_id: "wf-exec-67890-fghij-12345",
        message: "Workflow triggered successfully with URL processing",
      };

      mockTriggerWithFile.mockResolvedValue(mockResponse);

      const result = await processRemoteImage();

      expect(result.success).toBe(true);
      expect(result.message).toContain("URL processing");
    });
  });

  describe("Data Processing Validation", () => {
    it("should handle structured data in response", async () => {
      const mockResponse = {
        success: true,
        statusCode: "200",
        data: {
          extractedData: {
            entities: ["John Doe", "Jane Smith"],
            dates: ["2025-01-15", "2025-02-20"],
            amounts: [1500.0, 2500.5],
            categories: ["contract", "agreement"],
          },
          metadata: {
            processingTime: 3.2,
            confidence: 0.87,
            pagesProcessed: 5,
          },
        },
        analytics_id: "wf-exec-12345-abcde-67890",
        message: "Workflow triggered successfully with file upload",
      };

      mockTriggerWithFile.mockResolvedValue(mockResponse);

      const result = await processDocument();

      expect(result.data.extractedData.entities).toHaveLength(2);
      expect(result.data.extractedData.amounts).toEqual([1500.0, 2500.5]);
      expect(result.data.metadata.processingTime).toBe(3.2);
      expect(result.data.metadata.pagesProcessed).toBe(5);
    });

    it("should handle array data in response", async () => {
      const mockResponse = {
        success: true,
        statusCode: "200",
        data: {
          analysis: [
            { type: "text", content: "Contract terms", confidence: 0.95 },
            {
              type: "signature",
              content: "John Doe signature",
              confidence: 0.89,
            },
            { type: "date", content: "2025-01-15", confidence: 0.97 },
          ],
          summary: {
            totalItems: 3,
            averageConfidence: 0.937,
          },
        },
        analytics_id: "wf-exec-67890-fghij-12345",
        message: "Workflow triggered successfully with URL processing",
      };

      mockTriggerWithFile.mockResolvedValue(mockResponse);

      const result = await processRemoteImage();

      expect(Array.isArray(result.data.analysis)).toBe(true);
      expect(result.data.analysis).toHaveLength(3);
      expect(result.data.analysis[0].type).toBe("text");
      expect(result.data.analysis[0].confidence).toBe(0.95);
      expect(result.data.summary.totalItems).toBe(3);
      expect(result.data.summary.averageConfidence).toBe(0.937);
    });
  });
});
