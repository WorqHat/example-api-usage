import pytest
from unittest.mock import MagicMock, patch, mock_open
import os
from endpoints.storage import upload_document, upload_invoice, fetch_file_by_id, fetch_file_by_path, delete_file_by_id


class TestStorage:
    """Test suite for storage file upload functionality."""

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key",
        "WORQHAT_ENVIRONMENT": "test"
    })
    @patch('endpoints.storage.Worqhat')
    @patch('builtins.open', new_callable=mock_open, read_data=b"fake file content")
    def test_upload_document_success(self, mock_file_open, mock_worqhat_class):
        """Test successful document upload."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "file": {
                "id": "file_123",
                "filename": "document.pdf",
                "path": "org_id/documents/document.pdf",
                "size": 1024,
                "content_type": "application/pdf",
                "uploaded_at": "2025-01-01T00:00:00Z",
                "url": "https://example.com/document.pdf"
            }
        }

        mock_client.storage.upload_file.return_value = mock_response

        result = upload_document()

        # Verify the file was opened with the correct hardcoded path
        mock_file_open.assert_called_once_with('document.pdf', 'rb')

        # Verify the call was made with correct parameters
        mock_worqhat_class.assert_called_once_with(
            api_key="test-api-key",
            environment="test"
        )

        mock_client.storage.upload_file.assert_called_once()
        call_args = mock_client.storage.upload_file.call_args
        assert call_args[1]["path"] == "documents/"

        assert result == mock_response

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key",
        "WORQHAT_ENVIRONMENT": "test"
    })
    @patch('endpoints.storage.Worqhat')
    @patch('builtins.open', new_callable=mock_open, read_data=b"fake invoice content")
    def test_upload_invoice_success(self, mock_file_open, mock_worqhat_class):
        """Test successful invoice upload to organized path."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "file": {
                "id": "file_456",
                "filename": "invoice_001.pdf",
                "path": "org_id/invoices/2025/january/invoice_001.pdf",
                "size": 2048,
                "content_type": "application/pdf",
                "uploaded_at": "2025-01-01T00:00:00Z",
                "url": "https://example.com/invoice_001.pdf"
            }
        }

        mock_client.storage.upload_file.return_value = mock_response

        result = upload_invoice()

        # Verify the file was opened with the correct hardcoded path
        mock_file_open.assert_called_once_with('invoice_001.pdf', 'rb')

        # Verify the call was made with correct parameters
        mock_client.storage.upload_file.assert_called_once()
        call_args = mock_client.storage.upload_file.call_args
        assert call_args[1]["path"] == "invoices/2025/january/"

        assert result == mock_response

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key",
        "WORQHAT_ENVIRONMENT": "test"
    })
    @patch('endpoints.storage.Worqhat')
    def test_fetch_file_by_id_success(self, mock_worqhat_class):
        """Test successful file retrieval by ID."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "file": {
                "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                "filename": "invoice_2025.pdf",
                "path": "org_123/documents/invoices/invoice_2025.pdf",
                "size": 245678,
                "content_type": "application/pdf",
                "uploaded_at": "2025-01-01T00:00:00Z",
                "url": "https://storage.worqhat.com/org_123/documents/invoices/invoice_2025.pdf?signature=..."
            }
        }

        mock_client.storage.retrieve_file_by_id.return_value = mock_response

        fetch_file_by_id("a1b2c3d4-e5f6-7890-abcd-ef1234567890")

        # Verify the call was made with correct parameters
        mock_worqhat_class.assert_called_once_with(
            api_key="test-api-key",
            environment="test"
        )

        mock_client.storage.retrieve_file_by_id.assert_called_once_with("a1b2c3d4-e5f6-7890-abcd-ef1234567890")

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.storage.Worqhat')
    def test_fetch_file_by_id_file_not_found_error(self, mock_worqhat_class):
        """Test file not found error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.storage.retrieve_file_by_id.side_effect = Exception("File not found")

        fetch_file_by_id("nonexistent-id")

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.storage.Worqhat')
    def test_fetch_file_by_id_api_error_handling(self, mock_worqhat_class):
        """Test API error handling in fetch_file_by_id."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.storage.retrieve_file_by_id.side_effect = Exception("Unauthorized")

        fetch_file_by_id("test-file-id")

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key",
        "WORQHAT_ENVIRONMENT": "test"
    })
    @patch('endpoints.storage.Worqhat')
    def test_fetch_file_by_path_success(self, mock_worqhat_class):
        """Test successful file retrieval by path."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "file": {
                "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                "filename": "invoice_2025.pdf",
                "path": "org_123/documents/invoices/invoice_2025.pdf",
                "size": 245678,
                "content_type": "application/pdf",
                "uploaded_at": "2025-01-01T00:00:00Z",
                "url": "https://storage.worqhat.com/org_123/documents/invoices/invoice_2025.pdf?signature=..."
            }
        }

        mock_client.storage.retrieve_file_by_path.return_value = mock_response

        fetch_file_by_path("documents/invoices/invoice_2025.pdf")

        # Verify the call was made with correct parameters
        mock_worqhat_class.assert_called_once_with(
            api_key="test-api-key",
            environment="test"
        )

        mock_client.storage.retrieve_file_by_path.assert_called_once_with(filepath="documents/invoices/invoice_2025.pdf")

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.storage.Worqhat')
    def test_fetch_file_by_path_file_not_found_error(self, mock_worqhat_class):
        """Test file not found error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.storage.retrieve_file_by_path.side_effect = Exception("File not found")

        fetch_file_by_path("nonexistent/path/file.pdf")

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.storage.Worqhat')
    def test_fetch_file_by_path_api_error_handling(self, mock_worqhat_class):
        """Test API error handling in fetch_file_by_path."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.storage.retrieve_file_by_path.side_effect = Exception("Unauthorized")

        fetch_file_by_path("documents/test.pdf")

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key",
        "WORQHAT_ENVIRONMENT": "test"
    })
    @patch('endpoints.storage.Worqhat')
    def test_delete_file_by_id_success(self, mock_worqhat_class):
        """Test successful file deletion by ID."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "message": "File deleted successfully",
            "deleted_at": "2025-01-01T00:00:00Z"
        }

        mock_client.storage.delete_file_by_id.return_value = mock_response

        delete_file_by_id("a1b2c3d4-e5f6-7890-abcd-ef1234567890")

        # Verify the call was made with correct parameters
        mock_worqhat_class.assert_called_once_with(
            api_key="test-api-key",
            environment="test"
        )

        mock_client.storage.delete_file_by_id.assert_called_once_with("a1b2c3d4-e5f6-7890-abcd-ef1234567890")

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.storage.Worqhat')
    def test_delete_file_by_id_file_not_found_error(self, mock_worqhat_class):
        """Test file not found error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.storage.delete_file_by_id.side_effect = Exception("File not found")

        delete_file_by_id("nonexistent-id")

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.storage.Worqhat')
    def test_delete_file_by_id_api_error_handling(self, mock_worqhat_class):
        """Test API error handling in delete_file_by_id."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.storage.delete_file_by_id.side_effect = Exception("Unauthorized")

        delete_file_by_id("test-file-id")

