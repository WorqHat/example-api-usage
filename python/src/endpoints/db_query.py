import os
from worqhat import Worqhat


def fetch_active_users() -> None:
    """Execute SQL query with named parameters."""
    # Initialize the client with your API key
    client = Worqhat(
        api_key=os.environ.get("WORQHAT_API_KEY"),  # Using environment variables for security
        environment=os.environ.get("WORQHAT_ENVIRONMENT", "production"),  # Defaults to production
    )

    try:
        response = client.db.execute_query(
            query="SELECT * FROM users WHERE status = {status} LIMIT {limit}",
            params={
                "status": "active",
                "limit": 10,
            },
        )

        # Handle the successful response
        print(f"Found {len(response.data)} active users")
        print(f"Query execution time: {response.execution_time} ms")
        print(f"Results: {response.data}")
    except Exception as e:
        # Handle any errors
        print(f"Error executing query: {str(e)}")


def generate_sales_report() -> None:
    """Execute complex SQL query with positional parameters."""
    # Initialize the client with your API key
    client = Worqhat(
        api_key=os.environ.get("WORQHAT_API_KEY"),
        environment=os.environ.get("WORQHAT_ENVIRONMENT", "production"),  # Defaults to production
    )

    # Complex SQL query with positional parameters
    query = """
        SELECT
            category,
            COUNT(*) as order_count,
            SUM(quantity) as total_items,
            SUM(price * quantity) as total_revenue
        FROM orders
        WHERE order_date >= $1
        GROUP BY category
        ORDER BY total_revenue DESC
    """

    # Execute the query with positional parameters
    try:
        response = client.db.execute_query(
            query=query,
            params=["2025-01-01"],
        )

        # Handle the successful response
        print("Sales report generated successfully")
        print(f"Report data: {response.data}")
    except Exception as e:
        print(f"Error generating sales report: {str(e)}")


def search_users() -> None:
    """Search users with named parameters."""
    # Initialize the client with your API key
    client = Worqhat(
        api_key=os.environ.get("WORQHAT_API_KEY"),
        environment=os.environ.get("WORQHAT_ENVIRONMENT", "production"),  # Defaults to production
    )

    try:
        response = client.db.execute_query(
            query="SELECT * FROM users WHERE status = {status} AND created_at >= {created_after} ORDER BY {sort_by} LIMIT {limit}",
            params={
                "status": "active",
                "created_after": "2025-01-01",
                "sort_by": "created_at",
                "limit": 50,
            },
        )

        print("Search completed successfully")
        print(f"Results: {response.data}")
    except Exception as e:
        print(f"Error searching users: {str(e)}")


def db_query() -> None:
    """Run all query examples."""
    fetch_active_users()
    generate_sales_report()
    search_users()

