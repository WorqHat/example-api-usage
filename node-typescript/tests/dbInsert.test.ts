import {
  createUser,
  createProductWithCustomId,
  createMultipleProducts,
} from "../src/endpoints/dbInsert";

// Mock the Worqhat client
jest.mock("worqhat", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("Database Insert Operations", () => {
  const mockInsertRecord = jest.fn();
  const mockWorqhat = require("worqhat").default as jest.Mock;

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
      db: {
        insertRecord: mockInsertRecord,
      },
    };

    mockWorqhat.mockImplementation(() => mockWorqhatInstance);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.WORQHAT_API_KEY;
    delete process.env.WORQHAT_ENVIRONMENT;
  });

  describe("createUser", () => {
    it("should throw error when API key is missing", async () => {
      delete process.env.WORQHAT_API_KEY;

      await expect(createUser()).rejects.toThrow(
        "WORQHAT_API_KEY environment variable is required"
      );

      // Restore for other tests
      process.env.WORQHAT_API_KEY = "test-api-key";
    });

    it("should successfully create a user", async () => {
      const mockResponse = {
        success: true,
        data: {
          documentId: "doc_12345abcde",
          name: "John Doe",
          email: "john@example.com",
          role: "user",
          active: true,
        },
        message: "Record inserted successfully",
      };

      mockInsertRecord.mockResolvedValueOnce(mockResponse);

      const result = await createUser();

      expect(mockInsertRecord).toHaveBeenCalledWith({
        table: "users",
        data: {
          name: "John Doe",
          email: "john@example.com",
          role: "user",
          active: true,
        },
      });

      expect(result).toEqual(mockResponse);
    });

    it("should handle API errors", async () => {
      const mockError = new Error("API Error: Invalid API key");
      mockInsertRecord.mockRejectedValueOnce(mockError);

      await expect(createUser()).rejects.toThrow("API Error: Invalid API key");
      expect(console.error).toHaveBeenCalledWith(
        "Error creating user:",
        mockError.message
      );
    });
  });

  describe("createProductWithCustomId", () => {
    it("should throw error when API key is missing", async () => {
      delete process.env.WORQHAT_API_KEY;

      await expect(createProductWithCustomId()).rejects.toThrow(
        "WORQHAT_API_KEY environment variable is required"
      );

      // Restore for other tests
      process.env.WORQHAT_API_KEY = "test-api-key";
    });

    it("should successfully create a product with custom documentId", async () => {
      const mockResponse = {
        success: true,
        data: {
          documentId: "prod_1627384950",
          name: "Premium Widget",
          price: 99.99,
          inStock: true,
          category: "electronics",
        },
        message: "Record inserted successfully",
      };

      mockInsertRecord.mockResolvedValueOnce(mockResponse);

      const result = await createProductWithCustomId();

      expect(mockInsertRecord).toHaveBeenCalledWith({
        table: "products",
        data: expect.objectContaining({
          documentId: expect.stringMatching(/^prod_\d+$/),
          name: "Premium Widget",
          price: 99.99,
          inStock: true,
          category: "electronics",
        }),
      });

      expect(result).toEqual(mockResponse);
    });

    it("should generate unique custom IDs for products", async () => {
      const mockResponse = {
        success: true,
        data: {
          documentId: "prod_1627384950",
          name: "Premium Widget",
          price: 99.99,
          inStock: true,
          category: "electronics",
        },
        message: "Record inserted successfully",
      };

      mockInsertRecord.mockResolvedValue(mockResponse);

      await createProductWithCustomId();
      await createProductWithCustomId();

      const calls = mockInsertRecord.mock.calls.filter(
        (call) =>
          call[0].table === "products" && call[0].data.name === "Premium Widget"
      );

      expect(calls.length).toBeGreaterThan(0);
      // Each call should have a unique documentId
      const documentIds = calls.map((call) => call[0].data.documentId);
      const uniqueIds = new Set(documentIds);
      expect(uniqueIds.size).toBe(documentIds.length);
    });

    it("should handle API errors", async () => {
      const mockError = new Error("API Error: Table not found");
      mockInsertRecord.mockRejectedValueOnce(mockError);

      await expect(createProductWithCustomId()).rejects.toThrow(
        "API Error: Table not found"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error creating product:",
        mockError.message
      );
    });
  });

  describe("createMultipleProducts", () => {
    it("should throw error when API key is missing", async () => {
      delete process.env.WORQHAT_API_KEY;

      await expect(createMultipleProducts()).rejects.toThrow(
        "WORQHAT_API_KEY environment variable is required"
      );

      // Restore for other tests
      process.env.WORQHAT_API_KEY = "test-api-key";
    });

    it("should successfully insert multiple products in batch", async () => {
      const mockBulkResponse = {
        success: true,
        data: [
          {
            documentId: "doc_12345abcde",
            name: "Basic Widget",
            price: 19.99,
            inStock: true,
            category: "essentials",
          },
          {
            documentId: "doc_67890fghij",
            name: "Standard Widget",
            price: 49.99,
            inStock: true,
            category: "essentials",
          },
          {
            documentId: "doc_54321klmno",
            name: "Premium Widget",
            price: 99.99,
            inStock: false,
            category: "premium",
          },
        ],
        message: "3 records inserted successfully",
      };

      mockInsertRecord.mockResolvedValueOnce(mockBulkResponse);

      const result = await createMultipleProducts();

      expect(mockInsertRecord).toHaveBeenCalledWith({
        table: "products",
        data: [
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

      expect(result).toEqual(mockBulkResponse);
      expect(result.data).toHaveLength(3);
    });

    it("should handle bulk insert API errors", async () => {
      const mockError = new Error("API Error: Table not found");
      mockInsertRecord.mockRejectedValueOnce(mockError);

      await expect(createMultipleProducts()).rejects.toThrow(
        "API Error: Table not found"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error creating products:",
        mockError.message
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle network errors", async () => {
      const networkError = new Error("Network Error: Connection timeout");
      mockInsertRecord.mockRejectedValueOnce(networkError);

      await expect(createUser()).rejects.toThrow(
        "Network Error: Connection timeout"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error creating user:",
        networkError.message
      );
    });

    it("should handle authentication errors", async () => {
      const authError = new Error("Authentication Error: Invalid API key");
      mockInsertRecord.mockRejectedValueOnce(authError);

      await expect(createUser()).rejects.toThrow(
        "Authentication Error: Invalid API key"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error creating user:",
        authError.message
      );
    });

    it("should handle validation errors", async () => {
      const validationError = new Error(
        "Validation Error: Missing required fields"
      );
      mockInsertRecord.mockRejectedValueOnce(validationError);

      await expect(createUser()).rejects.toThrow(
        "Validation Error: Missing required fields"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error creating user:",
        validationError.message
      );
    });
  });

  describe("Data Validation", () => {
    it("should validate user data structure", async () => {
      const mockResponse = {
        success: true,
        data: {
          documentId: "doc_12345abcde",
          name: "John Doe",
          email: "john@example.com",
          role: "user",
          active: true,
        },
        message: "Record inserted successfully",
      };

      mockInsertRecord.mockResolvedValue(mockResponse);

      const result = await createUser();

      expect(result.data).toHaveProperty("documentId");
      expect(result.data).toHaveProperty("name");
      expect(result.data).toHaveProperty("email");
      expect(result.data).toHaveProperty("role");
      expect(result.data).toHaveProperty("active");
    });

    it("should validate product data structure", async () => {
      const mockResponse = {
        success: true,
        data: {
          documentId: "prod_1627384950",
          name: "Premium Widget",
          price: 99.99,
          inStock: true,
          category: "electronics",
        },
        message: "Record inserted successfully",
      };

      mockInsertRecord.mockResolvedValue(mockResponse);

      const result = await createProductWithCustomId();

      expect(result.data).toHaveProperty("documentId");
      expect(result.data).toHaveProperty("name");
      expect(result.data).toHaveProperty("price");
      expect(result.data).toHaveProperty("inStock");
      expect(result.data).toHaveProperty("category");
    });

    it("should validate bulk insert data structure", async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            documentId: "doc_12345abcde",
            name: "Basic Widget",
            price: 19.99,
            inStock: true,
            category: "essentials",
          },
        ],
        message: "1 record inserted successfully",
      };

      mockInsertRecord.mockResolvedValue(mockResponse);

      const result = await createMultipleProducts();

      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach((item) => {
        expect(item).toHaveProperty("documentId");
        expect(item).toHaveProperty("name");
        expect(item).toHaveProperty("price");
        expect(item).toHaveProperty("inStock");
        expect(item).toHaveProperty("category");
      });
    });
  });
});
