import os
from worqhat import Worqhat


def create_user() -> None:
    """Create a new user record."""
    # Initialize the client with your API key
    client = Worqhat(
        api_key=os.environ.get("WORQHAT_API_KEY"),  # Using environment variables for security
        environment=os.environ.get("WORQHAT_ENVIRONMENT", "production"),  # Defaults to production
    )

    try:
        response = client.db.insert_record(
            table="users",          # The table to insert into
            data={                  # The data to insert
                "name": "John Doe",
                "email": "john@example.com",
                "role": "user",
                "active": True
            }
        )

        # Handle the successful response
        print(f"User created with ID: {response.data.get('documentId')}")
        print(f"Created user: {response.data}")
    except Exception as e:
        # Handle any errors
        print(f"Error creating user: {str(e)}")


def create_product_with_custom_id() -> None:
    """Create a product with custom document ID."""
    import time

    # Initialize the client with your API key
    client = Worqhat(
        api_key=os.environ.get("WORQHAT_API_KEY"),
        environment=os.environ.get("WORQHAT_ENVIRONMENT", "production"),  # Defaults to production
    )

    # Generate a custom ID
    custom_id = f"prod_{int(time.time())}"  # Using timestamp for unique ID

    try:
        response = client.db.insert_record(
            table="products",       # The table to insert into
            data={                  # The data to insert
                "documentId": custom_id,  # Specify your own document ID
                "name": "Premium Widget",
                "price": 99.99,
                "inStock": True,
                "category": "electronics"
            }
        )

        # Handle the successful response
        print(f"Product created with custom ID: {response.data.get('documentId')}")
        print(f"Created product: {response.data}")
    except Exception as e:
        print(f"Error creating product: {str(e)}")


def create_multiple_products() -> None:
    """Create multiple products in batch."""
    # Initialize the client with your API key
    client = Worqhat(
        api_key=os.environ.get("WORQHAT_API_KEY"),
        environment=os.environ.get("WORQHAT_ENVIRONMENT", "production"),  # Defaults to production
    )

    try:
        response = client.db.insert_record(
            table="products",       # The table to insert into
            data=[                  # Array of data objects to insert
                {
                    "name": "Basic Widget",
                    "price": 19.99,
                    "inStock": True,
                    "category": "essentials"
                },
                {
                    "name": "Standard Widget",
                    "price": 49.99,
                    "inStock": True,
                    "category": "essentials"
                },
                {
                    "name": "Premium Widget",
                    "price": 99.99,
                    "inStock": False,
                    "category": "premium"
                }
            ]
        )

        # Handle the successful response
        print(f"Inserted {len(response.data)} products")
        print(f"Created products: {response.data}")
    except Exception as e:
        print(f"Error creating products: {str(e)}")


def db_insert() -> None:
    """Run all insert examples."""
    create_user()
    create_product_with_custom_id()
    create_multiple_products()

