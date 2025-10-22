import {
  countActiveUsers,
  analyzeSalesData,
  client,
} from "../src/endpoints/dbNlQuery";

// Mock the Worqhat client
jest.mock("worqhat", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("Database Natural Language Query Operations", () => {
  const mockProcessNlQuery = jest.fn();
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
        processNlQuery: mockProcessNlQuery,
      },
    };

    mockWorqhat.mockImplementation(() => mockWorqhatInstance);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.WORQHAT_API_KEY;
    delete process.env.WORQHAT_ENVIRONMENT;
  });

  describe("countActiveUsers", () => {
    it("should throw error when API key is missing", async () => {
      delete process.env.WORQHAT_API_KEY;

      await expect(countActiveUsers()).rejects.toThrow(
        "WORQHAT_API_KEY environment variable is required"
      );

      // Restore for other tests
      process.env.WORQHAT_API_KEY = "test-api-key";
    });

    it("should successfully process natural language query for counting users", async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            count: 157,
          },
        ],
        sql: "SELECT COUNT(*) as count FROM users WHERE status = 'active'",
        executionTime: 38,
        message: "Query processed successfully",
      };

      mockProcessNlQuery.mockResolvedValueOnce(mockResponse);

      const result = await countActiveUsers();

      expect(mockProcessNlQuery).toHaveBeenCalledWith({
        question: "How many active users do we have?",
        table: "users",
      });

      expect(result).toEqual(mockResponse);
    });

    it("should handle API errors", async () => {
      const mockError = new Error("API Error: Could not understand question");
      mockProcessNlQuery.mockRejectedValueOnce(mockError);

      await expect(countActiveUsers()).rejects.toThrow(
        "API Error: Could not understand question"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error executing query:",
        mockError.message
      );
    });
  });

  describe("analyzeSalesData", () => {
    it("should throw error when API key is missing", async () => {
      delete process.env.WORQHAT_API_KEY;

      await expect(analyzeSalesData()).rejects.toThrow(
        "WORQHAT_API_KEY environment variable is required"
      );

      // Restore for other tests
      process.env.WORQHAT_API_KEY = "test-api-key";
    });

    it("should successfully process complex natural language query for sales analysis", async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            category: "electronics",
            total_revenue: 125000.5,
            order_count: 450,
          },
          {
            category: "books",
            total_revenue: 89000.25,
            order_count: 320,
          },
          {
            category: "clothing",
            total_revenue: 67500.75,
            order_count: 280,
          },
        ],
        sql: "SELECT category, SUM(revenue) as total_revenue, COUNT(*) as order_count FROM sales WHERE quarter = 'Q4' AND year = 2024 GROUP BY category ORDER BY total_revenue DESC LIMIT 3",
        executionTime: 125,
        message: "Query processed successfully",
      };

      mockProcessNlQuery.mockResolvedValueOnce(mockResponse);

      const result = await analyzeSalesData();

      expect(mockProcessNlQuery).toHaveBeenCalledWith({
        question:
          "What were the top 3 product categories by revenue last quarter?",
        table: "sales",
      });

      expect(result).toEqual(mockResponse);
      expect(result.data).toHaveLength(3);
    });

    it("should handle API errors", async () => {
      const mockError = new Error("API Error: Table not found");
      mockProcessNlQuery.mockRejectedValueOnce(mockError);

      await expect(analyzeSalesData()).rejects.toThrow(
        "API Error: Table not found"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error analyzing sales data:",
        mockError.message
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle network errors", async () => {
      const networkError = new Error("Network Error: Connection timeout");
      mockProcessNlQuery.mockRejectedValueOnce(networkError);

      await expect(countActiveUsers()).rejects.toThrow(
        "Network Error: Connection timeout"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error executing query:",
        networkError.message
      );
    });

    it("should handle authentication errors", async () => {
      const authError = new Error("Authentication Error: Invalid API key");
      mockProcessNlQuery.mockRejectedValueOnce(authError);

      await expect(countActiveUsers()).rejects.toThrow(
        "Authentication Error: Invalid API key"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error executing query:",
        authError.message
      );
    });

    it("should handle question understanding errors", async () => {
      const understandingError = new Error("Could not understand question");
      mockProcessNlQuery.mockRejectedValueOnce(understandingError);

      await expect(countActiveUsers()).rejects.toThrow(
        "Could not understand question"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error executing query:",
        understandingError.message
      );
    });

    it("should handle table not found errors", async () => {
      const tableError = new Error("Table not found");
      mockProcessNlQuery.mockRejectedValueOnce(tableError);

      await expect(countActiveUsers()).rejects.toThrow("Table not found");
      expect(console.error).toHaveBeenCalledWith(
        "Error executing query:",
        tableError.message
      );
    });
  });

  describe("Response Validation", () => {
    it("should validate successful NL query response structure", async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            count: 157,
          },
        ],
        sql: "SELECT COUNT(*) as count FROM users WHERE status = 'active'",
        executionTime: 38,
        message: "Query processed successfully",
      };

      mockProcessNlQuery.mockResolvedValue(mockResponse);

      const result = await countActiveUsers();

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result).toHaveProperty("sql");
      expect(result).toHaveProperty("executionTime");
      expect(result).toHaveProperty("message");
      expect(typeof result.executionTime).toBe("number");
      expect(typeof result.sql).toBe("string");
      expect(typeof result.message).toBe("string");
    });

    it("should handle empty query results", async () => {
      const mockResponse = {
        success: true,
        data: [],
        sql: "SELECT * FROM users WHERE status = 'nonexistent'",
        executionTime: 25,
        message: "Query processed successfully",
      };

      mockProcessNlQuery.mockResolvedValue(mockResponse);

      const result = await countActiveUsers();

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
      expect(result.data).toHaveLength(0);
    });

    it("should validate complex analysis response structure", async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            category: "electronics",
            total_revenue: 125000.5,
            order_count: 450,
          },
        ],
        sql: "SELECT category, SUM(revenue) as total_revenue, COUNT(*) as order_count FROM sales WHERE quarter = 'Q4' GROUP BY category",
        executionTime: 125,
        message: "Query processed successfully",
      };

      mockProcessNlQuery.mockResolvedValue(mockResponse);

      const result = await analyzeSalesData();

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);

      // Validate analysis data structure
      const record = result.data[0];
      expect(record).toHaveProperty("category");
      expect(record).toHaveProperty("total_revenue");
      expect(record).toHaveProperty("order_count");
      expect(typeof record.total_revenue).toBe("number");
      expect(typeof record.order_count).toBe("number");
    });
  });

  describe("Query Parameters", () => {
    it("should pass correct question and table parameters for user count", async () => {
      const mockResponse = {
        success: true,
        data: [{ count: 157 }],
        sql: "SELECT COUNT(*) as count FROM users WHERE status = 'active'",
        executionTime: 38,
        message: "Query processed successfully",
      };

      mockProcessNlQuery.mockResolvedValue(mockResponse);

      await countActiveUsers();

      const callArgs = mockProcessNlQuery.mock.calls[0][0];
      expect(callArgs.question).toBe("How many active users do we have?");
      expect(callArgs.table).toBe("users");
    });

    it("should pass correct question and table parameters for sales analysis", async () => {
      const mockResponse = {
        success: true,
        data: [{ category: "electronics", total_revenue: 125000.5 }],
        sql: "SELECT category, SUM(revenue) as total_revenue FROM sales GROUP BY category",
        executionTime: 125,
        message: "Query processed successfully",
      };

      mockProcessNlQuery.mockResolvedValue(mockResponse);

      await analyzeSalesData();

      const callArgs = mockProcessNlQuery.mock.calls[0][0];
      expect(callArgs.question).toBe(
        "What were the top 3 product categories by revenue last quarter?"
      );
      expect(callArgs.table).toBe("sales");
    });
  });

  describe("SQL Generation Transparency", () => {
    it("should include generated SQL in response for transparency", async () => {
      const expectedSql =
        "SELECT COUNT(*) as count FROM users WHERE status = 'active'";
      const mockResponse = {
        success: true,
        data: [{ count: 157 }],
        sql: expectedSql,
        executionTime: 38,
        message: "Query processed successfully",
      };

      mockProcessNlQuery.mockResolvedValue(mockResponse);

      const result = await countActiveUsers();

      expect(result.sql).toBe(expectedSql);
      expect(result.sql).toContain("SELECT");
      expect(result.sql).toContain("FROM users");
      expect(result.sql).toContain("WHERE status = 'active'");
    });

    it("should include complex generated SQL for analysis queries", async () => {
      const expectedSql =
        "SELECT category, SUM(revenue) as total_revenue, COUNT(*) as order_count FROM sales WHERE quarter = 'Q4' AND year = 2024 GROUP BY category ORDER BY total_revenue DESC LIMIT 3";
      const mockResponse = {
        success: true,
        data: [
          {
            category: "electronics",
            total_revenue: 125000.5,
            order_count: 450,
          },
        ],
        sql: expectedSql,
        executionTime: 125,
        message: "Query processed successfully",
      };

      mockProcessNlQuery.mockResolvedValue(mockResponse);

      const result = await analyzeSalesData();

      expect(result.sql).toBe(expectedSql);
      expect(result.sql).toContain("SELECT");
      expect(result.sql).toContain("SUM(");
      expect(result.sql).toContain("GROUP BY");
      expect(result.sql).toContain("ORDER BY");
      expect(result.sql).toContain("LIMIT 3");
    });
  });

  describe("Execution Time Tracking", () => {
    it("should include execution time in response", async () => {
      const mockResponse = {
        success: true,
        data: [{ count: 157 }],
        sql: "SELECT COUNT(*) as count FROM users WHERE status = 'active'",
        executionTime: 42,
        message: "Query processed successfully",
      };

      mockProcessNlQuery.mockResolvedValue(mockResponse);

      const result = await countActiveUsers();

      expect(result.executionTime).toBe(42);
      expect(typeof result.executionTime).toBe("number");
      expect(result.executionTime).toBeGreaterThan(0);
    });

    it("should handle different execution times for complex queries", async () => {
      const mockResponse = {
        success: true,
        data: [{ category: "electronics", total_revenue: 125000.5 }],
        sql: "SELECT category, SUM(revenue) as total_revenue FROM sales WHERE quarter = 'Q4' GROUP BY category",
        executionTime: 125,
        message: "Query processed successfully",
      };

      mockProcessNlQuery.mockResolvedValue(mockResponse);

      const result = await analyzeSalesData();

      expect(result.executionTime).toBe(125);
      expect(typeof result.executionTime).toBe("number");
      // Complex queries should generally take longer
      expect(result.executionTime).toBeGreaterThan(40);
    });
  });
});
