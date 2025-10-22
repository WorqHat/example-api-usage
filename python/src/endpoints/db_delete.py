import os
from worqhat import Worqhat


def delete_inactive_users() -> None:
    """Delete inactive users."""
    # Initialize the client with your API key
    client = Worqhat(
        api_key=os.environ.get("WORQHAT_API_KEY"),  # Using environment variables for security
        environment=os.environ.get("WORQHAT_ENVIRONMENT", "production"),  # Defaults to production
    )

    try:
        response = client.db.delete_records(
            table="users",  # The table to delete from
            where={
                # The condition to match records
                "status": "inactive",
            },
        )

        # Handle the successful response
        print(f"Deleted {response.deleted_count} inactive users")
        print(f"Message: {response.message}")
    except Exception as e:
        # Handle any errors
        print(f"Error deleting users: {str(e)}")


def delete_old_completed_tasks() -> None:
    """Delete old completed tasks with multiple conditions."""
    # Initialize the client with your API key
    client = Worqhat(
        api_key=os.environ.get("WORQHAT_API_KEY"),
        environment=os.environ.get("WORQHAT_ENVIRONMENT", "production"),  # Defaults to production
    )

    try:
        # Get date from 30 days ago
        from datetime import datetime, timedelta
        thirty_days_ago = (datetime.now() - timedelta(days=30)).isoformat()

        response = client.db.delete_records(
            table="tasks",  # The table to delete from
            where={
                # Multiple conditions to match records
                "status": "completed",
                "priority": "low",
            },
        )

        # Handle the successful response
        print(f"Deleted {response.deleted_count} old completed tasks")
        print(f"Message: {response.message}")
    except Exception as e:
        print(f"Error deleting tasks: {str(e)}")


def db_delete() -> None:
    """Run all delete examples."""
    delete_inactive_users()
    delete_old_completed_tasks()

