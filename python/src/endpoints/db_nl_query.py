import os
from worqhat import Worqhat


def count_active_users() -> None:
    """Count active users using natural language query."""
    # Initialize the client with your API key
    client = Worqhat(
        api_key=os.environ.get("WORQHAT_API_KEY"),  # Using environment variables for security
        environment=os.environ.get("WORQHAT_ENVIRONMENT", "production"),  # Defaults to production
    )

    try:
        response = client.db.process_nl_query(
            question="How many active users do we have?",
            table="users",
        )

        # Handle the successful response
        print(f"Result: {response.data}")
        print(f"Generated SQL: {response.sql}")
        print(f"Query execution time: {response.execution_time} ms")
    except Exception as e:
        # Handle any errors
        print(f"Error executing query: {str(e)}")


def analyze_sales_data() -> None:
    """Analyze sales data using natural language query."""
    # Initialize the client with your API key
    client = Worqhat(
        api_key=os.environ.get("WORQHAT_API_KEY"),
        environment=os.environ.get("WORQHAT_ENVIRONMENT", "production"),  # Defaults to production
    )

    try:
        response = client.db.process_nl_query(
            question="What were the top 3 product categories by revenue last quarter?",
            table="sales",
        )

        # Handle the successful response
        print("Analysis results:")
        print(response.data)
        print(f"Generated SQL: {response.sql}")
    except Exception as e:
        print(f"Error analyzing sales data: {str(e)}")


def db_nl_query() -> None:
    """Run all natural language query examples."""
    count_active_users()
    analyze_sales_data()
