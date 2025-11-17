import {
  fetchActiveUsers,
  generateSalesReport,
  searchUsers,
  client,
} from "../src/endpoints/dbQuery";

// Mock the Worqhat client
jest.mock("worqhat", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("Database Query Operations", () => {
  const mockExecuteQuery = jest.fn();
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
        executeQuery: mockExecuteQuery,
      },
    };

    mockWorqhat.mockImplementation(() => mockWorqhatInstance);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.WORQHAT_API_KEY;
    delete process.env.WORQHAT_ENVIRONMENT;
  });

  describe("fetchActiveUsers", () => {
    it("should throw error when API key is missing", async () => {
      delete process.env.WORQHAT_API_KEY;

      await expect(fetchActiveUsers()).rejects.toThrow(
        "WORQHAT_API_KEY environment variable is required"
      );

      // Restore for other tests
      process.env.WORQHAT_API_KEY = "test-api-key";
    });

    it("should successfully execute query with named parameters", async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            id: "user_123",
            name: "John Doe",
            email: "john@example.com",
            status: "active",
          },
          {
            id: "user_456",
            name: "Jane Smith",
            email: "jane@example.com",
            status: "active",
          },
        ],
        executionTime: 42,
        query: "SELECT * FROM users WHERE status = 'active' LIMIT 10",
      };

      mockExecuteQuery.mockResolvedValueOnce(mockResponse);

      const result = await fetchActiveUsers();

      expect(mockExecuteQuery).toHaveBeenCalledWith({
        query: "SELECT * FROM users WHERE status = {status} LIMIT {limit}",
        params: {
          status: "active",
          limit: 10,
        },
      });

      expect(result).toEqual(mockResponse);
    });

    it("should handle API errors", async () => {
      const mockError = new Error("API Error: Table not found");
      mockExecuteQuery.mockRejectedValueOnce(mockError);

      await expect(fetchActiveUsers()).rejects.toThrow(
        "API Error: Table not found"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error executing query:",
        mockError.message
      );
    });
  });

  describe("generateSalesReport", () => {
    it("should throw error when API key is missing", async () => {
      delete process.env.WORQHAT_API_KEY;

      await expect(generateSalesReport()).rejects.toThrow(
        "WORQHAT_API_KEY environment variable is required"
      );

      // Restore for other tests
      process.env.WORQHAT_API_KEY = "test-api-key";
    });

    it("should successfully execute complex query with positional parameters", async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            category: "electronics",
            order_count: 25,
            total_items: 45,
            total_revenue: 15750.5,
          },
          {
            category: "books",
            order_count: 18,
            total_items: 32,
            total_revenue: 8950.25,
          },
        ],
        executionTime: 125,
        query:
          "SELECT category, COUNT(*) as order_count, SUM(quantity) as total_items, SUM(price * quantity) as total_revenue FROM orders WHERE order_date >= '2025-01-01' GROUP BY category ORDER BY total_revenue DESC",
      };

      mockExecuteQuery.mockResolvedValueOnce(mockResponse);

      const result = await generateSalesReport();

      expect(mockExecuteQuery).toHaveBeenCalledWith({
        query: expect.stringContaining("SELECT"),
        params: ["2025-01-01"],
      });

      expect(result).toEqual(mockResponse);
      expect(result.data).toHaveLength(2);
    });

    it("should handle API errors", async () => {
      const mockError = new Error("API Error: Syntax error in SQL query");
      mockExecuteQuery.mockRejectedValueOnce(mockError);

      await expect(generateSalesReport()).rejects.toThrow(
        "API Error: Syntax error in SQL query"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error generating sales report:",
        mockError.message
      );
    });
  });

  describe("searchUsers", () => {
    it("should throw error when API key is missing", async () => {
      delete process.env.WORQHAT_API_KEY;

      await expect(searchUsers()).rejects.toThrow(
        "WORQHAT_API_KEY environment variable is required"
      );

      // Restore for other tests
      process.env.WORQHAT_API_KEY = "test-api-key";
    });

    it("should successfully execute search query with multiple named parameters", async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            id: "user_123",
            name: "John Doe",
            email: "john@example.com",
            status: "active",
            created_at: "2025-01-15",
          },
        ],
        executionTime: 35,
        query:
          "SELECT * FROM users WHERE status = 'active' AND created_at >= '2025-01-01' ORDER BY created_at LIMIT 50",
      };

      mockExecuteQuery.mockResolvedValueOnce(mockResponse);

      const result = await searchUsers();

      expect(mockExecuteQuery).toHaveBeenCalledWith({
        query:
          "SELECT * FROM users WHERE status = {status} AND created_at >= {created_after} ORDER BY {sort_by} LIMIT {limit}",
        params: {
          status: "active",
          created_after: "2025-01-01",
          sort_by: "created_at",
          limit: 50,
        },
      });

      expect(result).toEqual(mockResponse);
    });

    it("should handle API errors", async () => {
      const mockError = new Error("API Error: Query timeout");
      mockExecuteQuery.mockRejectedValueOnce(mockError);

      await expect(searchUsers()).rejects.toThrow("API Error: Query timeout");
      expect(console.error).toHaveBeenCalledWith(
        "Error searching users:",
        mockError.message
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle network errors", async () => {
      const networkError = new Error("Network Error: Connection timeout");
      mockExecuteQuery.mockRejectedValueOnce(networkError);

      await expect(fetchActiveUsers()).rejects.toThrow(
        "Network Error: Connection timeout"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error executing query:",
        networkError.message
      );
    });

    it("should handle authentication errors", async () => {
      const authError = new Error("Authentication Error: Invalid API key");
      mockExecuteQuery.mockRejectedValueOnce(authError);

      await expect(fetchActiveUsers()).rejects.toThrow(
        "Authentication Error: Invalid API key"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error executing query:",
        authError.message
      );
    });

    it("should handle unauthorized operation errors", async () => {
      const operationError = new Error("Operation not allowed");
      mockExecuteQuery.mockRejectedValueOnce(operationError);

      await expect(fetchActiveUsers()).rejects.toThrow("Operation not allowed");
      expect(console.error).toHaveBeenCalledWith(
        "Error executing query:",
        operationError.message
      );
    });
  });

  describe("Response Validation", () => {
    it("should validate successful query response structure", async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            id: "user_123",
            name: "John Doe",
            email: "john@example.com",
            status: "active",
          },
        ],
        executionTime: 42,
        query: "SELECT * FROM users WHERE status = 'active' LIMIT 10",
      };

      mockExecuteQuery.mockResolvedValue(mockResponse);

      const result = await fetchActiveUsers();

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result).toHaveProperty("executionTime");
      expect(typeof result.executionTime).toBe("number");
      expect(result).toHaveProperty("query");
      expect(typeof result.query).toBe("string");
    });

    it("should handle empty query results", async () => {
      const mockResponse = {
        success: true,
        data: [],
        executionTime: 25,
        query: "SELECT * FROM users WHERE status = 'active' LIMIT 10",
      };

      mockExecuteQuery.mockResolvedValue(mockResponse);

      const result = await fetchActiveUsers();

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
      expect(result.data).toHaveLength(0);
    });

    it("should validate complex query response structure", async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            category: "electronics",
            order_count: 25,
            total_items: 45,
            total_revenue: 15750.5,
          },
        ],
        executionTime: 125,
        query:
          "SELECT category, COUNT(*) as order_count, SUM(quantity) as total_items, SUM(price * quantity) as total_revenue FROM orders WHERE order_date >= '2025-01-01' GROUP BY category ORDER BY total_revenue DESC",
      };

      mockExecuteQuery.mockResolvedValue(mockResponse);

      const result = await generateSalesReport();

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);

      // Validate aggregated data structure
      const record = result.data[0];
      expect(record).toHaveProperty("category");
      expect(record).toHaveProperty("order_count");
      expect(record).toHaveProperty("total_items");
      expect(record).toHaveProperty("total_revenue");
      expect(typeof record.order_count).toBe("number");
      expect(typeof record.total_revenue).toBe("number");
    });
  });

  describe("Parameter Handling", () => {
    it("should handle named parameters correctly", async () => {
      const mockResponse = {
        success: true,
        data: [],
        executionTime: 25,
        query: "SELECT * FROM users WHERE status = 'active' LIMIT 10",
      };

      mockExecuteQuery.mockResolvedValue(mockResponse);

      await fetchActiveUsers();

      const callArgs = mockExecuteQuery.mock.calls[0][0];
      expect(callArgs.params).toEqual({
        status: "active",
        limit: 10,
      });
      expect(typeof callArgs.params).toBe("object");
    });

    it("should handle positional parameters correctly", async () => {
      const mockResponse = {
        success: true,
        data: [],
        executionTime: 25,
        query:
          "SELECT category, COUNT(*) as order_count FROM orders WHERE order_date >= '2025-01-01' GROUP BY category",
      };

      mockExecuteQuery.mockResolvedValue(mockResponse);

      await generateSalesReport();

      const callArgs = mockExecuteQuery.mock.calls[0][0];
      expect(callArgs.params).toEqual(["2025-01-01"]);
      expect(Array.isArray(callArgs.params)).toBe(true);
    });

    it("should handle multiple named parameters correctly", async () => {
      const mockResponse = {
        success: true,
        data: [],
        executionTime: 25,
        query:
          "SELECT * FROM users WHERE status = 'active' AND created_at >= '2025-01-01' ORDER BY created_at LIMIT 50",
      };

      mockExecuteQuery.mockResolvedValue(mockResponse);

      await searchUsers();

      const callArgs = mockExecuteQuery.mock.calls[0][0];
      expect(callArgs.params).toEqual({
        status: "active",
        created_after: "2025-01-01",
        sort_by: "created_at",
        limit: 50,
      });
      expect(Object.keys(callArgs.params)).toHaveLength(4);
    });
  });

  describe("Query Structure", () => {
    it("should include proper SELECT queries", async () => {
      const mockResponse = {
        success: true,
        data: [],
        executionTime: 25,
        query: "SELECT * FROM users WHERE status = 'active' LIMIT 10",
      };

      mockExecuteQuery.mockResolvedValue(mockResponse);

      await fetchActiveUsers();

      const callArgs = mockExecuteQuery.mock.calls[0][0];
      expect(callArgs.query).toContain("SELECT");
      expect(callArgs.query).toContain("FROM users");
      expect(callArgs.query).toContain("{status}");
      expect(callArgs.query).toContain("{limit}");
    });

    it("should include complex SQL queries with aggregations", async () => {
      const mockResponse = {
        success: true,
        data: [],
        executionTime: 25,
        query:
          "SELECT category, COUNT(*) as order_count FROM orders WHERE order_date >= '2025-01-01' GROUP BY category",
      };

      mockExecuteQuery.mockResolvedValue(mockResponse);

      await generateSalesReport();

      const callArgs = mockExecuteQuery.mock.calls[0][0];
      expect(callArgs.query).toContain("SELECT");
      expect(callArgs.query).toContain("COUNT(*)");
      expect(callArgs.query).toContain("SUM(");
      expect(callArgs.query).toContain("GROUP BY");
      expect(callArgs.query).toContain("ORDER BY");
      expect(callArgs.query).toContain("$1");
    });
  });
});
