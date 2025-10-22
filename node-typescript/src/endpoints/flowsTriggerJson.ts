import Worqhat from "worqhat";

export async function onboardNewCustomer() {
  // Initialize the WorqHat client
  const apiKey = process.env.WORQHAT_API_KEY;
  if (!apiKey) {
    throw new Error("WORQHAT_API_KEY environment variable is required");
  }

  const client = new Worqhat({
    apiKey, // Always use environment variables for API keys
    environment: process.env.WORQHAT_ENVIRONMENT || "production", // Defaults to production
  });

  // Customer data to be processed by the workflow
  const customerData = {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    plan: "premium",
    company: "Acme Inc.",
    preferences: {
      notifications: true,
      newsletter: false,
      productUpdates: true,
    },
  };

  try {
    // Trigger the onboarding workflow with customer data
    const response = await client.flows.triggerWithPayload(
      "workflow-id-for-customer-onboarding",
      { body: customerData }
    );

    console.log(
      `Onboarding workflow started! Tracking ID: ${response.analytics_id}`
    );

    // You can store this analytics_id to check the status later
    return response;
  } catch (error) {
    // Handle any errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error triggering onboarding workflow:", errorMessage);
    throw error;
  }
}

export async function processEcommerceOrder() {
  // Initialize the WorqHat client
  const apiKey = process.env.WORQHAT_API_KEY;
  if (!apiKey) {
    throw new Error("WORQHAT_API_KEY environment variable is required");
  }

  const client = new Worqhat({
    apiKey,
    environment: process.env.WORQHAT_ENVIRONMENT || "production", // Defaults to production
  });

  try {
    // Trigger the order processing workflow with order data
    const response = await client.flows.triggerWithPayload(
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

    console.log(
      `Order processing workflow started! Tracking ID: ${response.analytics_id}`
    );
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error triggering order processing workflow:", errorMessage);
    throw error;
  }
}

export async function triggerDataAnalysis() {
  // Initialize the WorqHat client
  const apiKey = process.env.WORQHAT_API_KEY;
  if (!apiKey) {
    throw new Error("WORQHAT_API_KEY environment variable is required");
  }

  const client = new Worqhat({
    apiKey,
    environment: process.env.WORQHAT_ENVIRONMENT || "production", // Defaults to production
  });

  try {
    // Trigger the data analysis workflow with analysis parameters
    const response = await client.flows.triggerWithPayload(
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

    console.log(
      `Data analysis workflow started! Tracking ID: ${response.analytics_id}`
    );
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error triggering data analysis workflow:", errorMessage);
    throw error;
  }
}

// Export a function to run all examples (for backward compatibility)
export async function triggerFlowJson() {
  // Call the function
  await onboardNewCustomer();

  // Call the function
  await processEcommerceOrder();

  // Call the function
  await triggerDataAnalysis();
}

// Sample Response

// {
//   success: true,
//   message: 'Workflow a4a0053f-adec-4a3d-abf6-87ccac03b391 triggered successfully',
//   timestamp: '2025-08-12T13:02:52.973Z',
//   data: {
//     success: true,
//     statusCode: '200',
//     data: { output1: 'value1', output2: 'value2' }
//   }
// }
