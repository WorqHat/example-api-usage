import {
  getWorkflowMetrics,
  getAllWorkflowMetrics,
  client,
} from "../src/endpoints/flowsMetrics";

// Mock the Worqhat client
jest.mock("worqhat", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("Workflow Metrics Operations", () => {
  const mockGetMetrics = jest.fn();
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
      workflows: {
        getMetrics: mockGetMetrics,
      },
    };

    mockWorqhat.mockImplementation(() => mockWorqhatInstance);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.WORQHAT_API_KEY;
    delete process.env.WORQHAT_ENVIRONMENT;
  });

  describe("getWorkflowMetrics", () => {
    it("should throw error when API key is missing", async () => {
      delete process.env.WORQHAT_API_KEY;

      await expect(getWorkflowMetrics()).rejects.toThrow(
        "WORQHAT_API_KEY environment variable is required"
      );

      // Restore for other tests
      process.env.WORQHAT_API_KEY = "test-api-key";
    });

    it("should successfully retrieve workflow metrics with specific parameters", async () => {
      const mockResponse = {
        metrics: {
          totalExecutions: 1256,
          successRate: 94.5,
          averageDuration: 1250.75,
          errorRate: 5.5,
          totalErrors: 69,
        },
        workflowMetrics: [
          {
            id: "flow_12345",
            name: "Document Processing",
            executions: 532,
            successRate: 96.8,
            averageDuration: 980.25,
            errors: 17,
            mostCommonError: "document_parse_failure",
          },
          {
            id: "flow_67890",
            name: "Customer Onboarding",
            executions: 724,
            successRate: 92.8,
            averageDuration: 1450.5,
            errors: 52,
            mostCommonError: "validation_error",
          },
        ],
        period: {
          startDate: "2025-07-01T00:00:00Z",
          endDate: "2025-07-25T00:00:00Z",
        },
      };

      mockGetMetrics.mockResolvedValueOnce(mockResponse);

      const result = await getWorkflowMetrics();

      expect(mockGetMetrics).toHaveBeenCalledWith({
        start_date: "2025-07-01",
        end_date: "2025-07-24",
        status: "completed",
      });

      expect(result).toEqual(mockResponse);
      expect(result.metrics.totalExecutions).toBe(1256);
      expect(result.workflowMetrics).toHaveLength(2);
    });

    it("should handle API errors", async () => {
      const mockError = new Error("API Error: Invalid date format");
      mockGetMetrics.mockRejectedValueOnce(mockError);

      await expect(getWorkflowMetrics()).rejects.toThrow(
        "API Error: Invalid date format"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error getting workflow metrics:",
        mockError.message
      );
    });
  });

  describe("getAllWorkflowMetrics", () => {
    it("should throw error when API key is missing", async () => {
      delete process.env.WORQHAT_API_KEY;

      await expect(getAllWorkflowMetrics()).rejects.toThrow(
        "WORQHAT_API_KEY environment variable is required"
      );

      // Restore for other tests
      process.env.WORQHAT_API_KEY = "test-api-key";
    });

    it("should successfully retrieve workflow metrics with default parameters", async () => {
      const mockResponse = {
        metrics: {
          totalExecutions: 892,
          successRate: 91.2,
          averageDuration: 1100.0,
          errorRate: 8.8,
          totalErrors: 78,
        },
        workflowMetrics: [
          {
            id: "flow_11111",
            name: "Data Sync",
            executions: 892,
            successRate: 91.2,
            averageDuration: 1100.0,
            errors: 78,
            mostCommonError: "network_timeout",
          },
        ],
        period: {
          startDate: "2025-07-01T00:00:00Z",
          endDate: "2025-08-01T00:00:00Z",
        },
      };

      mockGetMetrics.mockResolvedValueOnce(mockResponse);

      const result = await getAllWorkflowMetrics();

      expect(mockGetMetrics).toHaveBeenCalledWith({});
      expect(result).toEqual(mockResponse);
      expect(result.period.startDate).toContain("2025-07-01");
      expect(result.period.endDate).toContain("2025-08-01");
    });

    it("should handle API errors", async () => {
      const mockError = new Error("API Error: Unauthorized");
      mockGetMetrics.mockRejectedValueOnce(mockError);

      await expect(getAllWorkflowMetrics()).rejects.toThrow(
        "API Error: Unauthorized"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error getting workflow metrics:",
        mockError.message
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle network errors", async () => {
      const networkError = new Error("Network Error: Connection timeout");
      mockGetMetrics.mockRejectedValueOnce(networkError);

      await expect(getWorkflowMetrics()).rejects.toThrow(
        "Network Error: Connection timeout"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error getting workflow metrics:",
        networkError.message
      );
    });

    it("should handle authentication errors", async () => {
      const authError = new Error("Authentication Error: Invalid API key");
      mockGetMetrics.mockRejectedValueOnce(authError);

      await expect(getWorkflowMetrics()).rejects.toThrow(
        "Authentication Error: Invalid API key"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error getting workflow metrics:",
        authError.message
      );
    });

    it("should handle invalid date format errors", async () => {
      const dateError = new Error("Invalid date format");
      mockGetMetrics.mockRejectedValueOnce(dateError);

      await expect(getWorkflowMetrics()).rejects.toThrow("Invalid date format");
      expect(console.error).toHaveBeenCalledWith(
        "Error getting workflow metrics:",
        dateError.message
      );
    });

    it("should handle end date before start date errors", async () => {
      const dateOrderError = new Error("End date before start date");
      mockGetMetrics.mockRejectedValueOnce(dateOrderError);

      await expect(getWorkflowMetrics()).rejects.toThrow(
        "End date before start date"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error getting workflow metrics:",
        dateOrderError.message
      );
    });

    it("should handle invalid status parameter errors", async () => {
      const statusError = new Error("Invalid status parameter");
      mockGetMetrics.mockRejectedValueOnce(statusError);

      await expect(getWorkflowMetrics()).rejects.toThrow(
        "Invalid status parameter"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error getting workflow metrics:",
        statusError.message
      );
    });
  });

  describe("Response Validation", () => {
    it("should validate successful workflow metrics response structure", async () => {
      const mockResponse = {
        metrics: {
          totalExecutions: 1256,
          successRate: 94.5,
          averageDuration: 1250.75,
          errorRate: 5.5,
          totalErrors: 69,
        },
        workflowMetrics: [
          {
            id: "flow_12345",
            name: "Document Processing",
            executions: 532,
            successRate: 96.8,
            averageDuration: 980.25,
            errors: 17,
            mostCommonError: "document_parse_failure",
          },
        ],
        period: {
          startDate: "2025-07-01T00:00:00Z",
          endDate: "2025-07-25T00:00:00Z",
        },
      };

      mockGetMetrics.mockResolvedValue(mockResponse);

      const result = await getWorkflowMetrics();

      expect(result.success).toBeUndefined(); // This endpoint doesn't have a success field
      expect(result.metrics).toBeDefined();
      expect(result.metrics).toHaveProperty("totalExecutions");
      expect(result.metrics).toHaveProperty("successRate");
      expect(result.metrics).toHaveProperty("averageDuration");
      expect(result.metrics).toHaveProperty("errorRate");
      expect(result.metrics).toHaveProperty("totalErrors");
      expect(Array.isArray(result.workflowMetrics)).toBe(true);
      expect(result).toHaveProperty("period");
      expect(result.period).toHaveProperty("startDate");
      expect(result.period).toHaveProperty("endDate");
    });

    it("should handle empty workflow metrics results", async () => {
      const mockResponse = {
        metrics: {
          totalExecutions: 0,
          successRate: 0,
          averageDuration: 0,
          errorRate: 0,
          totalErrors: 0,
        },
        workflowMetrics: [],
        period: {
          startDate: "2025-07-01T00:00:00Z",
          endDate: "2025-07-25T00:00:00Z",
        },
      };

      mockGetMetrics.mockResolvedValue(mockResponse);

      const result = await getWorkflowMetrics();

      expect(result.metrics.totalExecutions).toBe(0);
      expect(result.workflowMetrics).toEqual([]);
      expect(result.workflowMetrics).toHaveLength(0);
    });

    it("should validate individual workflow metrics structure", async () => {
      const mockResponse = {
        metrics: {
          totalExecutions: 532,
          successRate: 96.8,
          averageDuration: 980.25,
          errorRate: 3.2,
          totalErrors: 17,
        },
        workflowMetrics: [
          {
            id: "flow_12345",
            name: "Document Processing",
            executions: 532,
            successRate: 96.8,
            averageDuration: 980.25,
            errors: 17,
            mostCommonError: "document_parse_failure",
          },
        ],
        period: {
          startDate: "2025-07-01T00:00:00Z",
          endDate: "2025-07-25T00:00:00Z",
        },
      };

      mockGetMetrics.mockResolvedValue(mockResponse);

      const result = await getWorkflowMetrics();

      expect(result.workflowMetrics).toHaveLength(1);
      const workflow = result.workflowMetrics[0];
      expect(workflow).toHaveProperty("id");
      expect(workflow).toHaveProperty("name");
      expect(workflow).toHaveProperty("executions");
      expect(workflow).toHaveProperty("successRate");
      expect(workflow).toHaveProperty("averageDuration");
      expect(workflow).toHaveProperty("errors");
      expect(workflow).toHaveProperty("mostCommonError");
      expect(typeof workflow.executions).toBe("number");
      expect(typeof workflow.successRate).toBe("number");
      expect(typeof workflow.averageDuration).toBe("number");
    });
  });

  describe("Parameter Validation", () => {
    it("should pass correct parameters for specific date range query", async () => {
      const mockResponse = {
        metrics: {
          totalExecutions: 1256,
          successRate: 94.5,
          averageDuration: 1250.75,
          errorRate: 5.5,
          totalErrors: 69,
        },
        workflowMetrics: [],
        period: {
          startDate: "2025-07-01T00:00:00Z",
          endDate: "2025-07-25T00:00:00Z",
        },
      };

      mockGetMetrics.mockResolvedValue(mockResponse);

      await getWorkflowMetrics();

      const callArgs = mockGetMetrics.mock.calls[0][0];
      expect(callArgs.start_date).toBe("2025-07-01");
      expect(callArgs.end_date).toBe("2025-07-24");
      expect(callArgs.status).toBe("completed");
    });

    it("should pass empty parameters for default date range query", async () => {
      const mockResponse = {
        metrics: {
          totalExecutions: 892,
          successRate: 91.2,
          averageDuration: 1100.0,
          errorRate: 8.8,
          totalErrors: 78,
        },
        workflowMetrics: [],
        period: {
          startDate: "2025-07-01T00:00:00Z",
          endDate: "2025-08-01T00:00:00Z",
        },
      };

      mockGetMetrics.mockResolvedValue(mockResponse);

      await getAllWorkflowMetrics();

      const callArgs = mockGetMetrics.mock.calls[0][0];
      expect(callArgs).toEqual({});
    });
  });

  describe("Metrics Calculations", () => {
    it("should correctly calculate success rates and error rates", async () => {
      const mockResponse = {
        metrics: {
          totalExecutions: 1000,
          successRate: 85.5,
          averageDuration: 1500.0,
          errorRate: 14.5,
          totalErrors: 145,
        },
        workflowMetrics: [],
        period: {
          startDate: "2025-07-01T00:00:00Z",
          endDate: "2025-07-25T00:00:00Z",
        },
      };

      mockGetMetrics.mockResolvedValue(mockResponse);

      const result = await getWorkflowMetrics();

      expect(result.metrics.successRate).toBe(85.5);
      expect(result.metrics.errorRate).toBe(14.5);
      expect(result.metrics.totalErrors).toBe(145);
      expect(result.metrics.totalExecutions).toBe(1000);
    });

    it("should handle workflows with 100% success rate", async () => {
      const mockResponse = {
        metrics: {
          totalExecutions: 500,
          successRate: 100.0,
          averageDuration: 1200.0,
          errorRate: 0.0,
          totalErrors: 0,
        },
        workflowMetrics: [
          {
            id: "flow_perfect",
            name: "Perfect Workflow",
            executions: 500,
            successRate: 100.0,
            averageDuration: 1200.0,
            errors: 0,
            mostCommonError: null,
          },
        ],
        period: {
          startDate: "2025-07-01T00:00:00Z",
          endDate: "2025-07-25T00:00:00Z",
        },
      };

      mockGetMetrics.mockResolvedValue(mockResponse);

      const result = await getWorkflowMetrics();

      expect(result.metrics.successRate).toBe(100.0);
      expect(result.metrics.errorRate).toBe(0.0);
      expect(result.metrics.totalErrors).toBe(0);
      expect(result.workflowMetrics[0].successRate).toBe(100.0);
      expect(result.workflowMetrics[0].mostCommonError).toBeNull();
    });

    it("should handle workflows with 0% success rate", async () => {
      const mockResponse = {
        metrics: {
          totalExecutions: 50,
          successRate: 0.0,
          averageDuration: 0,
          errorRate: 100.0,
          totalErrors: 50,
        },
        workflowMetrics: [
          {
            id: "flow_broken",
            name: "Broken Workflow",
            executions: 50,
            successRate: 0.0,
            averageDuration: 0,
            errors: 50,
            mostCommonError: "system_error",
          },
        ],
        period: {
          startDate: "2025-07-01T00:00:00Z",
          endDate: "2025-07-25T00:00:00Z",
        },
      };

      mockGetMetrics.mockResolvedValue(mockResponse);

      const result = await getWorkflowMetrics();

      expect(result.metrics.successRate).toBe(0.0);
      expect(result.metrics.errorRate).toBe(100.0);
      expect(result.metrics.totalErrors).toBe(50);
      expect(result.workflowMetrics[0].successRate).toBe(0.0);
      expect(result.workflowMetrics[0].mostCommonError).toBe("system_error");
    });
  });

  describe("Period Validation", () => {
    it("should validate period structure and date formats", async () => {
      const mockResponse = {
        metrics: {
          totalExecutions: 1256,
          successRate: 94.5,
          averageDuration: 1250.75,
          errorRate: 5.5,
          totalErrors: 69,
        },
        workflowMetrics: [],
        period: {
          startDate: "2025-07-01T00:00:00Z",
          endDate: "2025-07-25T00:00:00Z",
        },
      };

      mockGetMetrics.mockResolvedValue(mockResponse);

      const result = await getWorkflowMetrics();

      expect(result.period).toBeDefined();
      expect(result.period.startDate).toBe("2025-07-01T00:00:00Z");
      expect(result.period.endDate).toBe("2025-07-25T00:00:00Z");
      expect(result.period.startDate).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
      );
      expect(result.period.endDate).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
      );
    });

    it("should handle default period for current month queries", async () => {
      const mockResponse = {
        metrics: {
          totalExecutions: 892,
          successRate: 91.2,
          averageDuration: 1100.0,
          errorRate: 8.8,
          totalErrors: 78,
        },
        workflowMetrics: [],
        period: {
          startDate: "2025-07-01T00:00:00Z",
          endDate: "2025-08-01T00:00:00Z",
        },
      };

      mockGetMetrics.mockResolvedValue(mockResponse);

      const result = await getAllWorkflowMetrics();

      expect(result.period.startDate).toBe("2025-07-01T00:00:00Z");
      expect(result.period.endDate).toBe("2025-08-01T00:00:00Z");
    });
  });
});
