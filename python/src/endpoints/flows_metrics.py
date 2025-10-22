import os
from worqhat import Worqhat


def get_workflow_metrics() -> None:
    """Get workflow metrics with specific date range and status filter."""
    # Initialize the client with your API key
    client = Worqhat(
        api_key=os.environ.get("WORQHAT_API_KEY"),  # Using environment variables for security
        environment=os.environ.get("WORQHAT_ENVIRONMENT", "production"),  # Defaults to production
    )

    try:
        response = client.workflows.get_metrics(
            start_date="2025-07-01",    # Start date in YYYY-MM-DD format
            end_date="2025-07-24",      # End date in YYYY-MM-DD format
            status="completed"          # Only include completed workflows
        )

        # Handle the successful response
        print(f"Total Executions: {response.metrics.total_executions}")
        print(f"Success Rate: {response.metrics.success_rate}%")
        print(f"Average Duration: {response.metrics.average_duration}ms")

        # Print metrics for individual workflows
        for workflow in response.workflow_metrics:
            print(f"\nWorkflow: {workflow.name} ({workflow.id})")
            print(f"  Executions: {workflow.executions}")
            print(f"  Success Rate: {workflow.success_rate}%")
            print(f"  Most Common Error: {workflow.most_common_error or 'None'}")
    except Exception as e:
        # Handle any errors
        print(f"Error getting workflow metrics: {str(e)}")


def get_all_workflow_metrics() -> None:
    """Get workflow metrics with default date range."""
    # Initialize the client with your API key
    client = Worqhat(
        api_key=os.environ.get("WORQHAT_API_KEY"),
        environment=os.environ.get("WORQHAT_ENVIRONMENT", "production"),  # Defaults to production
    )

    try:
        # No parameters means use the default date range (current month)
        response = client.workflows.get_metrics()

        # Handle the successful response
        print(f"Period: {response.period.start_date} to {response.period.end_date}")
        print(f"Total Executions: {response.metrics.total_executions}")
        print(f"Success Rate: {response.metrics.success_rate}%")
        print(f"Error Rate: {response.metrics.error_rate}%")
    except Exception as e:
        print(f"Error getting workflow metrics: {str(e)}")


def get_flows_metrics() -> None:
    """Run all workflow metrics examples."""
    get_workflow_metrics()
    get_all_workflow_metrics()

