import {
  deleteInactiveUsers,
  deleteOldCompletedTasks,
  client,
} from "../src/endpoints/dbDelete";

// Mock the Worqhat client
jest.mock("worqhat", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("Database Delete Operations", () => {
  const mockDeleteRecord = jest.fn();
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
        deleteRecords: mockDeleteRecord,
      },
    };

    mockWorqhat.mockImplementation(() => mockWorqhatInstance);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.WORQHAT_API_KEY;
    delete process.env.WORQHAT_ENVIRONMENT;
  });

  describe("deleteInactiveUsers", () => {
    it("should throw error when API key is missing", async () => {
      delete process.env.WORQHAT_API_KEY;

      await expect(deleteInactiveUsers()).rejects.toThrow(
        "WORQHAT_API_KEY environment variable is required"
      );

      // Restore for other tests
      process.env.WORQHAT_API_KEY = "test-api-key";
    });

    it("should successfully delete inactive users", async () => {
      const mockResponse = {
        success: true,
        deletedCount: 5,
        message: "5 record(s) deleted successfully from users",
      };

      mockDeleteRecord.mockResolvedValueOnce(mockResponse);

      const result = await deleteInactiveUsers();

      expect(mockDeleteRecord).toHaveBeenCalledWith({
        table: "users",
        where: {
          status: "inactive",
        },
      });

      expect(result).toEqual(mockResponse);
    });

    it("should handle API errors", async () => {
      const mockError = new Error("API Error: Table not found");
      mockDeleteRecord.mockRejectedValueOnce(mockError);

      await expect(deleteInactiveUsers()).rejects.toThrow(
        "API Error: Table not found"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error deleting users:",
        mockError.message
      );
    });

    it("should handle zero records deleted", async () => {
      const mockResponse = {
        success: true,
        deletedCount: 0,
        message: "0 record(s) deleted successfully from users",
      };

      mockDeleteRecord.mockResolvedValueOnce(mockResponse);

      const result = await deleteInactiveUsers();

      expect(result.deletedCount).toBe(0);
      expect(result.success).toBe(true);
    });
  });

  describe("deleteOldCompletedTasks", () => {
    it("should throw error when API key is missing", async () => {
      delete process.env.WORQHAT_API_KEY;

      await expect(deleteOldCompletedTasks()).rejects.toThrow(
        "WORQHAT_API_KEY environment variable is required"
      );

      // Restore for other tests
      process.env.WORQHAT_API_KEY = "test-api-key";
    });

    it("should successfully delete old completed tasks with multiple conditions", async () => {
      const mockResponse = {
        success: true,
        deletedCount: 3,
        message: "3 record(s) deleted successfully from tasks",
      };

      mockDeleteRecord.mockResolvedValueOnce(mockResponse);

      const result = await deleteOldCompletedTasks();

      expect(mockDeleteRecord).toHaveBeenCalledWith({
        table: "tasks",
        where: {
          status: "completed",
          priority: "low",
        },
      });

      expect(result).toEqual(mockResponse);
      expect(result.deletedCount).toBe(3);
    });

    it("should handle API errors", async () => {
      const mockError = new Error("API Error: No records match the conditions");
      mockDeleteRecord.mockRejectedValueOnce(mockError);

      await expect(deleteOldCompletedTasks()).rejects.toThrow(
        "API Error: No records match the conditions"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error deleting tasks:",
        mockError.message
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle network errors", async () => {
      const networkError = new Error("Network Error: Connection timeout");
      mockDeleteRecord.mockRejectedValueOnce(networkError);

      await expect(deleteInactiveUsers()).rejects.toThrow(
        "Network Error: Connection timeout"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error deleting users:",
        networkError.message
      );
    });

    it("should handle authentication errors", async () => {
      const authError = new Error("Authentication Error: Invalid API key");
      mockDeleteRecord.mockRejectedValueOnce(authError);

      await expect(deleteInactiveUsers()).rejects.toThrow(
        "Authentication Error: Invalid API key"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error deleting users:",
        authError.message
      );
    });

    it("should handle missing where conditions error", async () => {
      const validationError = new Error(
        "Validation Error: Missing where conditions"
      );
      mockDeleteRecord.mockRejectedValueOnce(validationError);

      await expect(deleteInactiveUsers()).rejects.toThrow(
        "Validation Error: Missing where conditions"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error deleting users:",
        validationError.message
      );
    });
  });

  describe("Response Validation", () => {
    it("should validate successful delete response structure", async () => {
      const mockResponse = {
        success: true,
        deletedCount: 5,
        message: "5 record(s) deleted successfully from users",
      };

      mockDeleteRecord.mockResolvedValue(mockResponse);

      const result = await deleteInactiveUsers();

      expect(result.success).toBe(true);
      expect(result).toHaveProperty("deletedCount");
      expect(result).toHaveProperty("message");
      expect(typeof result.deletedCount).toBe("number");
      expect(typeof result.message).toBe("string");
    });

    it("should handle empty delete results", async () => {
      const mockResponse = {
        success: true,
        deletedCount: 0,
        message: "0 record(s) deleted successfully from users",
      };

      mockDeleteRecord.mockResolvedValue(mockResponse);

      const result = await deleteInactiveUsers();

      expect(result.success).toBe(true);
      expect(result.deletedCount).toBe(0);
      expect(result.message).toContain("0 record(s)");
    });
  });

  describe("Where Conditions", () => {
    it("should handle single where condition correctly", async () => {
      const mockResponse = {
        success: true,
        deletedCount: 5,
        message: "5 record(s) deleted successfully from users",
      };

      mockDeleteRecord.mockResolvedValue(mockResponse);

      await deleteInactiveUsers();

      const callArgs = mockDeleteRecord.mock.calls[0][0];
      expect(callArgs.where).toEqual({
        status: "inactive",
      });
      expect(Object.keys(callArgs.where)).toHaveLength(1);
    });

    it("should handle multiple where conditions correctly", async () => {
      const mockResponse = {
        success: true,
        deletedCount: 3,
        message: "3 record(s) deleted successfully from tasks",
      };

      mockDeleteRecord.mockResolvedValue(mockResponse);

      await deleteOldCompletedTasks();

      const callArgs = mockDeleteRecord.mock.calls[0][0];
      expect(callArgs.where).toEqual({
        status: "completed",
        priority: "low",
      });
      expect(Object.keys(callArgs.where)).toHaveLength(2);
    });
  });

  describe("Table Targeting", () => {
    it("should target correct table for user deletion", async () => {
      const mockResponse = {
        success: true,
        deletedCount: 5,
        message: "5 record(s) deleted successfully from users",
      };

      mockDeleteRecord.mockResolvedValue(mockResponse);

      await deleteInactiveUsers();

      const callArgs = mockDeleteRecord.mock.calls[0][0];
      expect(callArgs.table).toBe("users");
    });

    it("should target correct table for task deletion", async () => {
      const mockResponse = {
        success: true,
        deletedCount: 3,
        message: "3 record(s) deleted successfully from tasks",
      };

      mockDeleteRecord.mockResolvedValue(mockResponse);

      await deleteOldCompletedTasks();

      const callArgs = mockDeleteRecord.mock.calls[0][0];
      expect(callArgs.table).toBe("tasks");
    });
  });
});
