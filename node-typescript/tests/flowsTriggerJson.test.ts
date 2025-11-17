import {
  onboardNewCustomer,
  processEcommerceOrder,
  triggerDataAnalysis,
  client,
} from "../src/endpoints/flowsTriggerJson";

// Mock the Worqhat client
jest.mock("worqhat", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("Workflow Trigger with JSON Payload Operations", () => {
  const mockTriggerWithPayload = jest.fn();
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
      flows: {
        triggerWithPayload: mockTriggerWithPayload,
      },
    };

    mockWorqhat.mockImplementation(() => mockWorqhatInstance);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.WORQHAT_API_KEY;
    delete process.env.WORQHAT_ENVIRONMENT;
  });

  describe("onboardNewCustomer", () => {
    it("should throw error when API key is missing", async () => {
      delete process.env.WORQHAT_API_KEY;

      await expect(onboardNewCustomer()).rejects.toThrow(
        "WORQHAT_API_KEY environment variable is required"
      );

      // Restore for other tests
      process.env.WORQHAT_API_KEY = "test-api-key";
    });

    it("should successfully trigger customer onboarding workflow", async () => {
      const mockResponse = {
        success: true,
        message: "Workflow triggered successfully",
        analytics_id: "wf-exec-12345-abcde-67890",
        timestamp: "2023-07-24T15:30:45Z",
        data: {
          workflow_status: "started",
        },
      };

      mockTriggerWithPayload.mockResolvedValueOnce(mockResponse);

      const result = await onboardNewCustomer();

      expect(mockTriggerWithPayload).toHaveBeenCalledWith(
        "workflow-id-for-customer-onboarding",
        {
          body: {
            name: "Jane Smith",
            email: "jane.smith@example.com",
            plan: "premium",
            company: "Acme Inc.",
            preferences: {
              notifications: true,
              newsletter: false,
              productUpdates: true,
            },
          },
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it("should handle API errors", async () => {
      const mockError = new Error("API Error: Invalid API key provided");
      mockTriggerWithPayload.mockRejectedValueOnce(mockError);

      await expect(onboardNewCustomer()).rejects.toThrow(
        "API Error: Invalid API key provided"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error triggering onboarding workflow:",
        mockError.message
      );
    });
  });

  describe("processEcommerceOrder", () => {
    it("should throw error when API key is missing", async () => {
      delete process.env.WORQHAT_API_KEY;

      await expect(processEcommerceOrder()).rejects.toThrow(
        "WORQHAT_API_KEY environment variable is required"
      );

      // Restore for other tests
      process.env.WORQHAT_API_KEY = "test-api-key";
    });

    it("should successfully trigger order processing workflow", async () => {
      const mockResponse = {
        success: true,
        message: "Workflow triggered successfully",
        analytics_id: "wf-exec-67890-fghij-12345",
        timestamp: "2023-07-24T16:45:30Z",
        data: {
          workflow_status: "started",
        },
      };

      mockTriggerWithPayload.mockResolvedValueOnce(mockResponse);

      const result = await processEcommerceOrder();

      expect(mockTriggerWithPayload).toHaveBeenCalledWith(
        "order-processing-workflow-id",
        {
          body: {
            orderId: "ORD-12345",
            customer: {
              id: "CUST-789",
              name: "Alex Johnson",
              email: "alex@example.com",
            },
            items: [
              { productId: "PROD-001", quantity: 2, price: 29.99 },
              { productId: "PROD-042", quantity: 1, price: 49.99 },
            ],
            shipping: {
              method: "express",
              address: {
                street: "123 Main St",
                city: "Boston",
                state: "MA",
                zip: "02108",
              },
            },
            payment: {
              method: "credit_card",
              transactionId: "TXN-5678",
            },
          },
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it("should handle API errors", async () => {
      const mockError = new Error("API Error: Workflow not found");
      mockTriggerWithPayload.mockRejectedValueOnce(mockError);

      await expect(processEcommerceOrder()).rejects.toThrow(
        "API Error: Workflow not found"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error triggering order processing workflow:",
        mockError.message
      );
    });
  });

  describe("triggerDataAnalysis", () => {
    it("should throw error when API key is missing", async () => {
      delete process.env.WORQHAT_API_KEY;

      await expect(triggerDataAnalysis()).rejects.toThrow(
        "WORQHAT_API_KEY environment variable is required"
      );

      // Restore for other tests
      process.env.WORQHAT_API_KEY = "test-api-key";
    });

    it("should successfully trigger data analysis workflow", async () => {
      const mockResponse = {
        success: true,
        message: "Workflow triggered successfully",
        analytics_id: "wf-exec-99999-xyzab-45678",
        timestamp: "2023-07-24T17:20:15Z",
        data: {
          workflow_status: "started",
        },
      };

      mockTriggerWithPayload.mockResolvedValueOnce(mockResponse);

      const result = await triggerDataAnalysis();

      expect(mockTriggerWithPayload).toHaveBeenCalledWith(
        "data-analysis-workflow-id",
        {
          body: {
            datasetId: "DS-456",
            analysisParameters: {
              timeRange: { start: "2025-01-01", end: "2025-07-31" },
              metrics: ["revenue", "user_growth", "conversion_rate"],
              segmentation: ["region", "device_type", "user_tier"],
              comparisonPeriod: "previous_quarter",
            },
            outputFormat: "pdf",
            notifyEmail: "reports@yourcompany.com",
          },
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it("should handle API errors", async () => {
      const mockError = new Error("API Error: Invalid payload format");
      mockTriggerWithPayload.mockRejectedValueOnce(mockError);

      await expect(triggerDataAnalysis()).rejects.toThrow(
        "API Error: Invalid payload format"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error triggering data analysis workflow:",
        mockError.message
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle network errors", async () => {
      const networkError = new Error("Network Error: Connection timeout");
      mockTriggerWithPayload.mockRejectedValueOnce(networkError);

      await expect(onboardNewCustomer()).rejects.toThrow(
        "Network Error: Connection timeout"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error triggering onboarding workflow:",
        networkError.message
      );
    });

    it("should handle authentication errors", async () => {
      const authError = new Error("Authentication Error: Invalid API key");
      mockTriggerWithPayload.mockRejectedValueOnce(authError);

      await expect(onboardNewCustomer()).rejects.toThrow(
        "Authentication Error: Invalid API key"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error triggering onboarding workflow:",
        authError.message
      );
    });

    it("should handle workflow not found errors", async () => {
      const workflowError = new Error("Workflow not found");
      mockTriggerWithPayload.mockRejectedValueOnce(workflowError);

      await expect(onboardNewCustomer()).rejects.toThrow("Workflow not found");
      expect(console.error).toHaveBeenCalledWith(
        "Error triggering onboarding workflow:",
        workflowError.message
      );
    });

    it("should handle invalid payload errors", async () => {
      const payloadError = new Error("Invalid payload format");
      mockTriggerWithPayload.mockRejectedValueOnce(payloadError);

      await expect(onboardNewCustomer()).rejects.toThrow(
        "Invalid payload format"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error triggering onboarding workflow:",
        payloadError.message
      );
    });

    it("should handle rate limiting errors", async () => {
      const rateLimitError = new Error("Rate limit exceeded");
      mockTriggerWithPayload.mockRejectedValueOnce(rateLimitError);

      await expect(onboardNewCustomer()).rejects.toThrow("Rate limit exceeded");
      expect(console.error).toHaveBeenCalledWith(
        "Error triggering onboarding workflow:",
        rateLimitError.message
      );
    });
  });

  describe("Response Validation", () => {
    it("should validate successful workflow trigger response structure", async () => {
      const mockResponse = {
        success: true,
        message: "Workflow triggered successfully",
        analytics_id: "wf-exec-12345-abcde-67890",
        timestamp: "2023-07-24T15:30:45Z",
        data: {
          workflow_status: "started",
        },
      };

      mockTriggerWithPayload.mockResolvedValue(mockResponse);

      const result = await onboardNewCustomer();

      expect(result.success).toBe(true);
      expect(result).toHaveProperty("message");
      expect(result).toHaveProperty("analytics_id");
      expect(result).toHaveProperty("timestamp");
      expect(result).toHaveProperty("data");
      expect(result.data).toHaveProperty("workflow_status");
      expect(typeof result.analytics_id).toBe("string");
      expect(typeof result.timestamp).toBe("string");
      expect(result.message).toBe("Workflow triggered successfully");
    });

    it("should validate analytics ID format", async () => {
      const mockResponse = {
        success: true,
        message: "Workflow triggered successfully",
        analytics_id: "wf-exec-12345-abcde-67890",
        timestamp: "2023-07-24T15:30:45Z",
        data: {
          workflow_status: "started",
        },
      };

      mockTriggerWithPayload.mockResolvedValue(mockResponse);

      const result = await onboardNewCustomer();

      expect(result.analytics_id).toMatch(/^wf-exec-[a-z0-9-]+$/);
    });

    it("should validate timestamp format", async () => {
      const mockResponse = {
        success: true,
        message: "Workflow triggered successfully",
        analytics_id: "wf-exec-12345-abcde-67890",
        timestamp: "2023-07-24T15:30:45Z",
        data: {
          workflow_status: "started",
        },
      };

      mockTriggerWithPayload.mockResolvedValue(mockResponse);

      const result = await onboardNewCustomer();

      expect(result.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
      );
    });
  });

  describe("Payload Validation", () => {
    it("should pass correct customer onboarding payload", async () => {
      const mockResponse = {
        success: true,
        message: "Workflow triggered successfully",
        analytics_id: "wf-exec-12345-abcde-67890",
        timestamp: "2023-07-24T15:30:45Z",
        data: { workflow_status: "started" },
      };

      mockTriggerWithPayload.mockResolvedValue(mockResponse);

      await onboardNewCustomer();

      const callArgs = mockTriggerWithPayload.mock.calls[0];
      const workflowId = callArgs[0];
      const payload = callArgs[1];

      expect(workflowId).toBe("workflow-id-for-customer-onboarding");
      expect(payload.body).toHaveProperty("name");
      expect(payload.body).toHaveProperty("email");
      expect(payload.body).toHaveProperty("plan");
      expect(payload.body).toHaveProperty("company");
      expect(payload.body).toHaveProperty("preferences");
      expect(payload.body.preferences).toHaveProperty("notifications");
    });

    it("should pass correct e-commerce order payload", async () => {
      const mockResponse = {
        success: true,
        message: "Workflow triggered successfully",
        analytics_id: "wf-exec-67890-fghij-12345",
        timestamp: "2023-07-24T16:45:30Z",
        data: { workflow_status: "started" },
      };

      mockTriggerWithPayload.mockResolvedValue(mockResponse);

      await processEcommerceOrder();

      const callArgs = mockTriggerWithPayload.mock.calls[0];
      const workflowId = callArgs[0];
      const payload = callArgs[1];

      expect(workflowId).toBe("order-processing-workflow-id");
      expect(payload.body).toHaveProperty("orderId");
      expect(payload.body).toHaveProperty("customer");
      expect(payload.body).toHaveProperty("items");
      expect(payload.body).toHaveProperty("shipping");
      expect(payload.body).toHaveProperty("payment");
      expect(Array.isArray(payload.body.items)).toBe(true);
      expect(payload.body.items).toHaveLength(2);
    });

    it("should pass correct data analysis payload", async () => {
      const mockResponse = {
        success: true,
        message: "Workflow triggered successfully",
        analytics_id: "wf-exec-99999-xyzab-45678",
        timestamp: "2023-07-24T17:20:15Z",
        data: { workflow_status: "started" },
      };

      mockTriggerWithPayload.mockResolvedValue(mockResponse);

      await triggerDataAnalysis();

      const callArgs = mockTriggerWithPayload.mock.calls[0];
      const workflowId = callArgs[0];
      const payload = callArgs[1];

      expect(workflowId).toBe("data-analysis-workflow-id");
      expect(payload.body).toHaveProperty("datasetId");
      expect(payload.body).toHaveProperty("analysisParameters");
      expect(payload.body).toHaveProperty("outputFormat");
      expect(payload.body).toHaveProperty("notifyEmail");
      expect(Array.isArray(payload.body.analysisParameters.metrics)).toBe(true);
      expect(Array.isArray(payload.body.analysisParameters.segmentation)).toBe(
        true
      );
    });
  });

  describe("Workflow Status Validation", () => {
    it("should validate workflow status in response", async () => {
      const mockResponse = {
        success: true,
        message: "Workflow triggered successfully",
        analytics_id: "wf-exec-12345-abcde-67890",
        timestamp: "2023-07-24T15:30:45Z",
        data: {
          workflow_status: "started",
        },
      };

      mockTriggerWithPayload.mockResolvedValue(mockResponse);

      const result = await onboardNewCustomer();

      expect(result.data.workflow_status).toBe("started");
    });

    it("should handle different workflow statuses", async () => {
      const mockResponse = {
        success: true,
        message: "Workflow triggered successfully",
        analytics_id: "wf-exec-12345-abcde-67890",
        timestamp: "2023-07-24T15:30:45Z",
        data: {
          workflow_status: "queued",
        },
      };

      mockTriggerWithPayload.mockResolvedValue(mockResponse);

      const result = await onboardNewCustomer();

      expect(result.data.workflow_status).toBe("queued");
    });
  });

  describe("Complex Payload Structures", () => {
    it("should handle nested objects in payload", async () => {
      const mockResponse = {
        success: true,
        message: "Workflow triggered successfully",
        analytics_id: "wf-exec-67890-fghij-12345",
        timestamp: "2023-07-24T16:45:30Z",
        data: { workflow_status: "started" },
      };

      mockTriggerWithPayload.mockResolvedValue(mockResponse);

      await processEcommerceOrder();

      const callArgs = mockTriggerWithPayload.mock.calls[0];
      const payload = callArgs[1];

      // Verify nested object structure
      expect(payload.body.customer).toEqual({
        id: "CUST-789",
        name: "Alex Johnson",
        email: "alex@example.com",
      });

      expect(payload.body.shipping.address).toEqual({
        street: "123 Main St",
        city: "Boston",
        state: "MA",
        zip: "02108",
      });
    });

    it("should handle arrays in payload", async () => {
      const mockResponse = {
        success: true,
        message: "Workflow triggered successfully",
        analytics_id: "wf-exec-67890-fghij-12345",
        timestamp: "2023-07-24T16:45:30Z",
        data: { workflow_status: "started" },
      };

      mockTriggerWithPayload.mockResolvedValue(mockResponse);

      await processEcommerceOrder();

      const callArgs = mockTriggerWithPayload.mock.calls[0];
      const payload = callArgs[1];

      // Verify array structure
      expect(payload.body.items).toHaveLength(2);
      expect(payload.body.items[0]).toEqual({
        productId: "PROD-001",
        quantity: 2,
        price: 29.99,
      });

      expect(payload.body.items[1]).toEqual({
        productId: "PROD-042",
        quantity: 1,
        price: 49.99,
      });
    });

    it("should handle complex analysis parameters", async () => {
      const mockResponse = {
        success: true,
        message: "Workflow triggered successfully",
        analytics_id: "wf-exec-99999-xyzab-45678",
        timestamp: "2023-07-24T17:20:15Z",
        data: { workflow_status: "started" },
      };

      mockTriggerWithPayload.mockResolvedValue(mockResponse);

      await triggerDataAnalysis();

      const callArgs = mockTriggerWithPayload.mock.calls[0];
      const payload = callArgs[1];

      // Verify complex nested structure
      expect(payload.body.analysisParameters.timeRange).toEqual({
        start: "2025-01-01",
        end: "2025-07-31",
      });

      expect(payload.body.analysisParameters.metrics).toEqual([
        "revenue",
        "user_growth",
        "conversion_rate",
      ]);

      expect(payload.body.analysisParameters.segmentation).toEqual([
        "region",
        "device_type",
        "user_tier",
      ]);
    });
  });
});
