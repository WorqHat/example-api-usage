import os
from worqhat import Worqhat


def process_document(file_path: str) -> None:
    """Process a document using workflow with file upload."""
    # Initialize the client
    client = Worqhat(
        api_key=os.environ.get("WORQHAT_API_KEY"),
        environment=os.environ.get("WORQHAT_ENVIRONMENT", "production"),  # Defaults to production
    )

    try:
        # Open the file in binary mode
        with open(file_path, 'rb') as file:
            # Trigger the workflow
            response = client.flows.trigger_with_file(
                "document-processing-workflow-id",
                {
                    "file": file,
                    # Additional fields go directly on the payload
                    "documentType": "contract",
                    "priority": "high",
                    "department": "legal",
                },
            )

            print(f"Document processing started! Tracking ID: {response.analytics_id}")
            return response
    except Exception as e:
        print(f"Error processing document: {str(e)}")
        # Handle the error appropriately


def process_remote_image() -> None:
    """Process a remote image using workflow with URL."""
    # Initialize the client
    client = Worqhat(
        api_key=os.environ.get("WORQHAT_API_KEY"),
        environment=os.environ.get("WORQHAT_ENVIRONMENT", "production"),  # Defaults to production
    )

    try:
        # Trigger the workflow with a URL
        response = client.flows.trigger_with_file(
            "image-analysis-workflow-id",
            {
                "url": "https://storage.example.com/products/laptop-x1.jpg",
                # Additional fields go directly on the payload
                "imageType": "product",
                "category": "electronics",
                "productId": "PROD-12345",
            },
        )

        print(f"Image analysis started! Tracking ID: {response.analytics_id}")
        return response
    except Exception as e:
        print(f"Error processing remote image: {str(e)}")
        # Handle the error appropriately


def process_document_with_params(file_path: str) -> None:
    """Process a document with additional parameters."""
    # Initialize the client
    client = Worqhat(
        api_key=os.environ.get("WORQHAT_API_KEY"),
        environment=os.environ.get("WORQHAT_ENVIRONMENT", "production"),  # Defaults to production
    )

    try:
        with open(file_path, 'rb') as file:
            # Trigger the workflow with file and additional parameters
            response = client.flows.trigger_with_file(
                "document-processing-workflow-id",
                {
                    "file": file,
                    # Additional parameters
                    "customerId": "CID-12345",
                    "department": "legal",
                    "requireSignature": True,
                    "processingMode": "detailed",
                    "documentType": "contract",
                    "priority": "high",
                },
            )

            print(f"Document processing started! Tracking ID: {response.analytics_id}")
            return response
    except Exception as e:
        print(f"Error processing document: {str(e)}")


def trigger_flow_with_file() -> None:
    """Run all file-based workflow trigger examples."""
    # Use a sample file path - in real usage, this would be passed as parameter
    sample_file_path = "./contract.pdf"  # This file may not exist, but shows the pattern

    try:
        process_document(sample_file_path)
    except FileNotFoundError:
        print("Sample file not found, skipping document processing example")

    process_remote_image()
    process_document_with_params(sample_file_path)


def trigger_flow_with_url() -> None:
    """Trigger workflow with URL (backward compatibility)."""
    process_remote_image()

