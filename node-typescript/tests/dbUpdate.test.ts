import {
  updateUserStatus,
  updateInactiveUsers,
  client,
} from "../src/endpoints/dbUpdate";

// Mock the Worqhat client
jest.mock("worqhat", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("Database Update Operations", () => {
  const mockUpdateRecord = jest.fn();
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
        updateRecords: mockUpdateRecord,
      },
    };

    mockWorqhat.mockImplementation(() => mockWorqhatInstance);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.WORQHAT_API_KEY;
    delete process.env.WORQHAT_ENVIRONMENT;
  });

  describe("updateUserStatus", () => {
    it("should throw error when API key is missing", async () => {
      delete process.env.WORQHAT_API_KEY;

      await expect(updateUserStatus()).rejects.toThrow(
        "WORQHAT_API_KEY environment variable is required"
      );

      // Restore for other tests
      process.env.WORQHAT_API_KEY = "test-api-key";
    });

    it("should successfully update user status with multiple where conditions", async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            documentId: "doc_12345abcde",
            id: "123",
            email: "user@example.com",
            status: "active",
            name: "Updated Name",
          },
        ],
        count: 1,
        executionTime: 52,
        message: "1 record(s) updated successfully in users",
      };

      mockUpdateRecord.mockResolvedValueOnce(mockResponse);

      const result = await updateUserStatus();

      expect(mockUpdateRecord).toHaveBeenCalledWith({
        table: "users",
        where: {
          id: "123",
          email: "user@example.com",
        },
        data: {
          status: "active",
          name: "Updated Name",
        },
      });

      expect(result).toEqual(mockResponse);
    });

    it("should handle API errors", async () => {
      const mockError = new Error("API Error: Table not found");
      mockUpdateRecord.mockRejectedValueOnce(mockError);

      await expect(updateUserStatus()).rejects.toThrow(
        "API Error: Table not found"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error updating records:",
        mockError.message
      );
    });
  });

  describe("updateInactiveUsers", () => {
    it("should throw error when API key is missing", async () => {
      delete process.env.WORQHAT_API_KEY;

      await expect(updateInactiveUsers()).rejects.toThrow(
        "WORQHAT_API_KEY environment variable is required"
      );

      // Restore for other tests
      process.env.WORQHAT_API_KEY = "test-api-key";
    });

    it("should successfully update all inactive users to active", async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            documentId: "doc_12345abcde",
            status: "active",
            updatedBy: "system",
          },
          {
            documentId: "doc_67890fghij",
            status: "active",
            updatedBy: "system",
          },
        ],
        count: 2,
        executionTime: 75,
        message: "2 record(s) updated successfully in users",
      };

      mockUpdateRecord.mockResolvedValueOnce(mockResponse);

      const result = await updateInactiveUsers();

      expect(mockUpdateRecord).toHaveBeenCalledWith({
        table: "users",
        where: {
          status: "inactive",
        },
        data: {
          status: "active",
          updatedBy: "system",
        },
      });

      expect(result).toEqual(mockResponse);
      expect(result.count).toBe(2);
    });

    it("should handle API errors", async () => {
      const mockError = new Error(
        "API Error: No records matched the update criteria"
      );
      mockUpdateRecord.mockRejectedValueOnce(mockError);

      await expect(updateInactiveUsers()).rejects.toThrow(
        "API Error: No records matched the update criteria"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error updating users:",
        mockError.message
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle network errors", async () => {
      const networkError = new Error("Network Error: Connection timeout");
      mockUpdateRecord.mockRejectedValueOnce(networkError);

      await expect(updateUserStatus()).rejects.toThrow(
        "Network Error: Connection timeout"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error updating records:",
        networkError.message
      );
    });

    it("should handle authentication errors", async () => {
      const authError = new Error("Authentication Error: Invalid API key");
      mockUpdateRecord.mockRejectedValueOnce(authError);

      await expect(updateUserStatus()).rejects.toThrow(
        "Authentication Error: Invalid API key"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error updating records:",
        authError.message
      );
    });

    it("should handle validation errors", async () => {
      const validationError = new Error(
        "Validation Error: Missing required fields"
      );
      mockUpdateRecord.mockRejectedValueOnce(validationError);

      await expect(updateUserStatus()).rejects.toThrow(
        "Validation Error: Missing required fields"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error updating records:",
        validationError.message
      );
    });
  });

  describe("Data Validation", () => {
    it("should validate response structure for multiple where conditions", async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            documentId: "doc_12345abcde",
            id: "123",
            email: "user@example.com",
            status: "active",
            name: "Updated Name",
          },
        ],
        count: 1,
        executionTime: 52,
        message: "1 record(s) updated successfully in users",
      };

      mockUpdateRecord.mockResolvedValue(mockResponse);

      const result = await updateUserStatus();

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
      expect(result).toHaveProperty("count");
      expect(result).toHaveProperty("executionTime");
      expect(result).toHaveProperty("message");

      // Validate each updated record
      result.data.forEach((record: any) => {
        expect(record).toHaveProperty("documentId");
        expect(record).toHaveProperty("id");
        expect(record).toHaveProperty("email");
        expect(record).toHaveProperty("status");
        expect(record).toHaveProperty("name");
      });
    });

    it("should validate response structure for single where condition", async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            documentId: "doc_12345abcde",
            status: "active",
            updatedBy: "system",
          },
        ],
        count: 1,
        executionTime: 45,
        message: "1 record(s) updated successfully in users",
      };

      mockUpdateRecord.mockResolvedValue(mockResponse);

      const result = await updateInactiveUsers();

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.count).toBe(1);
      expect(result.data.length).toBe(1);

      // Validate updated record
      const record = result.data[0];
      expect(record).toHaveProperty("documentId");
      expect(record).toHaveProperty("status");
      expect(record).toHaveProperty("updatedBy");
      expect(record.status).toBe("active");
      expect(record.updatedBy).toBe("system");
    });

    it("should handle zero records updated", async () => {
      const mockResponse = {
        success: true,
        data: [],
        count: 0,
        executionTime: 30,
        message: "0 record(s) updated successfully in users",
      };

      mockUpdateRecord.mockResolvedValue(mockResponse);

      const result = await updateUserStatus();

      expect(result.success).toBe(true);
      expect(result.count).toBe(0);
      expect(result.data).toEqual([]);
    });
  });

  describe("Where Conditions", () => {
    it("should handle multiple where conditions correctly", async () => {
      const mockResponse = {
        success: true,
        data: [],
        count: 0,
        executionTime: 25,
        message: "0 record(s) updated successfully in users",
      };

      mockUpdateRecord.mockResolvedValue(mockResponse);

      await updateUserStatus();

      const callArgs = mockUpdateRecord.mock.calls[0][0];
      expect(callArgs.where).toEqual({
        id: "123",
        email: "user@example.com",
      });
      expect(Object.keys(callArgs.where)).toHaveLength(2);
    });

    it("should handle single where condition correctly", async () => {
      const mockResponse = {
        success: true,
        data: [],
        count: 0,
        executionTime: 25,
        message: "0 record(s) updated successfully in users",
      };

      mockUpdateRecord.mockResolvedValue(mockResponse);

      await updateInactiveUsers();

      const callArgs = mockUpdateRecord.mock.calls[0][0];
      expect(callArgs.where).toEqual({
        status: "inactive",
      });
      expect(Object.keys(callArgs.where)).toHaveLength(1);
    });
  });
});
