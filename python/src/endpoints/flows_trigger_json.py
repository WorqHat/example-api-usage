import os
from worqhat import Worqhat


def onboard_new_customer() -> None:
    """Trigger customer onboarding workflow with customer data."""
    # Initialize the WorqHat client
    client = Worqhat(
        api_key=os.environ.get("WORQHAT_API_KEY"),  # Always use environment variables for security
        environment=os.environ.get("WORQHAT_ENVIRONMENT", "production"),  # Defaults to production
    )

    # Customer data to be processed by the workflow
    customer_data = {
        "name": "Jane Smith",
        "email": "jane.smith@example.com",
        "plan": "premium",
        "company": "Acme Inc.",
        "preferences": {
            "notifications": True,
            "newsletter": False,
            "productUpdates": True,
        },
    }

    try:
        # Trigger the onboarding workflow with customer data
        response = client.flows.trigger_with_payload(
            "workflow-id-for-customer-onboarding",
            body=customer_data,
        )

        print(f"Onboarding workflow started! Tracking ID: {response.analytics_id}")

        # You can store this analytics_id to check the status later
    except Exception as error:
        print(f"Error triggering onboarding workflow: {error}")
        # Handle the error appropriately


def process_ecommerce_order() -> None:
    """Trigger order processing workflow with order data."""
    # Initialize the WorqHat client
    client = Worqhat(
        api_key=os.environ.get("WORQHAT_API_KEY"),
        environment=os.environ.get("WORQHAT_ENVIRONMENT", "production"),  # Defaults to production
    )

    try:
        # Trigger the order processing workflow with order data
        response = client.flows.trigger_with_payload(
            "order-processing-workflow-id",
            body={
                "orderId": "ORD-12345",
                "customer": {
                    "id": "CUST-789",
                    "name": "Alex Johnson",
                    "email": "alex@example.com",
                },
                "items": [
                    {"productId": "PROD-001", "quantity": 2, "price": 29.99},
                    {"productId": "PROD-042", "quantity": 1, "price": 49.99},
                ],
                "shipping": {
                    "method": "express",
                    "address": {
                        "street": "123 Main St",
                        "city": "Boston",
                        "state": "MA",
                        "zip": "02108",
                    },
                },
                "payment": {
                    "method": "credit_card",
                    "transactionId": "TXN-5678",
                },
            },
        )

        print(f"Order processing workflow started! Tracking ID: {response.analytics_id}")
    except Exception as error:
        print(f"Error triggering order processing workflow: {error}")


def trigger_data_analysis() -> None:
    """Trigger data analysis workflow with analysis parameters."""
    # Initialize the WorqHat client
    client = Worqhat(
        api_key=os.environ.get("WORQHAT_API_KEY"),
        environment=os.environ.get("WORQHAT_ENVIRONMENT", "production"),  # Defaults to production
    )

    try:
        # Trigger the data analysis workflow with analysis parameters
        response = client.flows.trigger_with_payload(
            "data-analysis-workflow-id",
            body={
                "datasetId": "DS-456",
                "analysisParameters": {
                    "timeRange": {"start": "2025-01-01", "end": "2025-07-31"},
                    "metrics": ["revenue", "user_growth", "conversion_rate"],
                    "segmentation": ["region", "device_type", "user_tier"],
                    "comparisonPeriod": "previous_quarter",
                },
                "outputFormat": "pdf",
                "notifyEmail": "reports@yourcompany.com",
            },
        )

        print(f"Data analysis workflow started! Tracking ID: {response.analytics_id}")
    except Exception as error:
        print(f"Error triggering data analysis workflow: {error}")


def trigger_flow_json() -> None:
    """Run all workflow trigger examples."""
    onboard_new_customer()
    process_ecommerce_order()
    trigger_data_analysis()

