import os
from worqhat import Worqhat


def update_user_status() -> None:
    """Update user status with multiple where conditions."""
    # Initialize the client with your API key
    client = Worqhat(
        api_key=os.environ.get("WORQHAT_API_KEY"),  # Using environment variables for security
        environment=os.environ.get("WORQHAT_ENVIRONMENT", "production"),  # Defaults to production
    )

    try:
        response = client.db.update_records(
            table="users",  # The table to update
            where={
                # Which records to update
                "id": "123",  # Find records with id = 123
                "email": "user@example.com",  # AND email = user@example.com
            },
            data={
                # New values to set
                "status": "active",  # Change status to active
                "name": "Updated Name",  # Update the name
            },
        )

        # Handle the successful response
        print(f"Updated {response.count} records")
        print(f"Updated records: {response.data}")
    except Exception as e:
        # Handle any errors
        print(f"Error updating records: {str(e)}")


def update_inactive_users() -> None:
    """Update all inactive users to active."""
    # Initialize the client with your API key
    client = Worqhat(
        api_key=os.environ.get("WORQHAT_API_KEY"),
        environment=os.environ.get("WORQHAT_ENVIRONMENT", "production"),  # Defaults to production
    )

    try:
        response = client.db.update_records(
            table="users",  # The table to update
            where={
                # Which records to update
                "status": "inactive",  # Find ALL records with status = inactive
            },
            data={
                # New values to set
                "status": "active",  # Change status to active
                "updatedBy": "system",  # Add audit information
            },
        )

        # Handle the successful response
        print(f"Updated {response.count} inactive users to active status")
        print(f"First few updated records: {response.data[:3] if response.data else []}")
    except Exception as e:
        print(f"Error updating users: {str(e)}")


def db_update() -> None:
    """Run all update examples."""
    update_user_status()
    update_inactive_users()

