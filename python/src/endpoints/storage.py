import os
from worqhat import Worqhat


def upload_document() -> None:
    """Upload a file with an auto-generated path."""
    client = Worqhat(
        api_key=os.environ.get("WORQHAT_API_KEY"),
        environment=os.environ.get("WORQHAT_ENVIRONMENT", "production"),
    )
    try:
        # Assuming 'document.pdf' exists in the current directory for testing
        with open('document.pdf', 'rb') as file:
            response = client.storage.upload_file(
                file=file,
                path='documents/'
            )

        print("File uploaded successfully!")
        print(f"File ID: {response.file.id}")
        print(f"Download URL: {response.file.url}")
        print(f"File size: {response.file.size} bytes")
    except FileNotFoundError:
        print("Error: 'document.pdf' not found. Please create it for testing.")
    except Exception as e:
        print(f"Error uploading file: {str(e)}")


def upload_invoice() -> None:
    """Upload an invoice to an organized path structure."""
    client = Worqhat(
        api_key=os.environ.get("WORQHAT_API_KEY"),
        environment=os.environ.get("WORQHAT_ENVIRONMENT", "production"),
    )
    try:
        # Assuming 'invoice_001.pdf' exists in the current directory for testing
        with open('invoice_001.pdf', 'rb') as file:
            response = client.storage.upload_file(
                file=file,
                path='invoices/2025/january/'
            )

        print(f"Invoice uploaded to: {response.file.path}")
        print(f"File ID: {response.file.id}")
    except FileNotFoundError:
        print("Error: 'invoice_001.pdf' not found. Please create it for testing.")
    except Exception as e:
        print(f"Error uploading invoice: {str(e)}")


def fetch_file_by_id(file_id: str) -> None:
    """Fetch a file from storage using its unique ID."""
    client = Worqhat(
        api_key=os.environ.get("WORQHAT_API_KEY"),
        environment=os.environ.get("WORQHAT_ENVIRONMENT", "production"),
    )
    try:
        response = client.storage.retrieve_file_by_id(file_id)

        # Handle the successful response
        print("File retrieved successfully!")
        print(f"File name: {response.file.filename}")
        print(f"File size: {response.file.size} bytes")
        print(f"Download URL: {response.file.url}")
        print(f"Uploaded at: {response.file.uploaded_at}")
    except Exception as e:
        # Handle any errors
        print(f"Error fetching file: {str(e)}")


def fetch_file_by_path(filepath: str) -> None:
    """Fetch a file from storage using its path."""
    client = Worqhat(
        api_key=os.environ.get("WORQHAT_API_KEY"),
        environment=os.environ.get("WORQHAT_ENVIRONMENT", "production"),
    )
    try:
        response = client.storage.retrieve_file_by_path(filepath=filepath)

        # Handle the successful response
        print("File retrieved successfully!")
        print(f"File name: {response.file.filename}")
        print(f"File size: {response.file.size} bytes")
        print(f"Download URL: {response.file.url}")
        print(f"Full path: {response.file.path}")
    except Exception as e:
        # Handle any errors
        print(f"Error fetching file: {str(e)}")


def delete_file_by_id(file_id: str) -> None:
    """Delete a file from storage using its unique ID."""
    client = Worqhat(
        api_key=os.environ.get("WORQHAT_API_KEY"),
        environment=os.environ.get("WORQHAT_ENVIRONMENT", "production"),
    )
    try:
        response = client.storage.delete_file_by_id(file_id)

        # Handle the successful response
        print("File deleted successfully!")
        print(f"Message: {response.message}")
        print(f"Deleted at: {response.deleted_at}")
    except Exception as e:
        # Handle any errors
        print(f"Error deleting file: {str(e)}")
