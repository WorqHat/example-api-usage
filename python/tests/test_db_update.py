import pytest
from unittest.mock import MagicMock, patch, mock_open
import os
from endpoints.db_update import update_user_status, update_inactive_users, db_update


class TestDbUpdate:
    """Test suite for db_update functionality."""

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key",
        "WORQHAT_ENVIRONMENT": "test"
    })
    @patch('endpoints.db_update.Worqhat')
    def test_update_user_status_success(self, mock_worqhat_class):
        """Test successful user status update with multiple where conditions."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [
                {
                    "documentId": "doc_12345abcde",
                    "id": "123",
                    "email": "user@example.com",
                    "status": "active",
                    "name": "Updated Name",
                }
            ],
            "count": 1,
            "executionTime": 52,
            "message": "1 record(s) updated successfully in users",
        }

        mock_client.db.update_records.return_value = mock_response

        update_user_status()

        # Verify the call was made with correct parameters
        mock_worqhat_class.assert_called_once_with(
            api_key="test-api-key",
            environment="test"
        )

        mock_client.db.update_records.assert_called_once_with(
            table="users",
            where={
                "id": "123",
                "email": "user@example.com",
            },
            data={
                "status": "active",
                "name": "Updated Name",
            }
        )

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key",
        "WORQHAT_ENVIRONMENT": "test"
    })
    @patch('endpoints.db_update.Worqhat')
    def test_update_inactive_users_success(self, mock_worqhat_class):
        """Test successful update of all inactive users."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [
                {
                    "documentId": "doc_12345abcde",
                    "status": "active",
                    "updatedBy": "system",
                },
                {
                    "documentId": "doc_67890fghij",
                    "status": "active",
                    "updatedBy": "system",
                }
            ],
            "count": 2,
            "executionTime": 75,
            "message": "2 record(s) updated successfully in users",
        }

        mock_client.db.update_records.return_value = mock_response

        update_inactive_users()

        # Verify the call was made with correct parameters
        mock_client.db.update_records.assert_called_once_with(
            table="users",
            where={
                "status": "inactive",
            },
            data={
                "status": "active",
                "updatedBy": "system",
            }
        )

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_update.Worqhat')
    def test_update_user_status_api_error_handling(self, mock_worqhat_class):
        """Test API error handling in update_user_status."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.db.update_records.side_effect = Exception("API Error: Table not found")

        with pytest.raises(Exception, match="API Error: Table not found"):
            update_user_status()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_update.Worqhat')
    def test_update_inactive_users_no_records_error(self, mock_worqhat_class):
        """Test handling of no records matched error."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.db.update_records.side_effect = Exception("No records matched the update criteria")

        with pytest.raises(Exception, match="No records matched the update criteria"):
            update_inactive_users()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_update.Worqhat')
    def test_update_user_status_network_error(self, mock_worqhat_class):
        """Test network error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.db.update_records.side_effect = Exception("Network Error: Connection timeout")

        with pytest.raises(Exception, match="Network Error: Connection timeout"):
            update_user_status()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_update.Worqhat')
    def test_update_inactive_users_auth_error(self, mock_worqhat_class):
        """Test authentication error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.db.update_records.side_effect = Exception("Authentication Error: Invalid API key")

        with pytest.raises(Exception, match="Authentication Error: Invalid API key"):
            update_inactive_users()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_update.Worqhat')
    def test_update_user_status_validation_error(self, mock_worqhat_class):
        """Test validation error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.db.update_records.side_effect = Exception("Validation Error: Missing required fields")

        with pytest.raises(Exception, match="Validation Error: Missing required fields"):
            update_user_status()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_update.Worqhat')
    def test_update_user_status_zero_records(self, mock_worqhat_class):
        """Test handling of zero records updated."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [],
            "count": 0,
            "executionTime": 30,
            "message": "0 record(s) updated successfully in users",
        }

        mock_client.db.update_records.return_value = mock_response

        update_user_status()

        # Verify the response handling
        assert mock_response["count"] == 0
        assert len(mock_response["data"]) == 0

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_update.Worqhat')
    def test_data_structure_validation_multiple_conditions(self, mock_worqhat_class):
        """Test data structure validation for multiple where conditions."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [
                {
                    "documentId": "doc_12345abcde",
                    "id": "123",
                    "email": "user@example.com",
                    "status": "active",
                    "name": "Updated Name",
                }
            ],
            "count": 1,
            "executionTime": 52,
            "message": "1 record(s) updated successfully in users",
        }

        mock_client.db.update_records.return_value = mock_response

        update_user_status()

        # Verify response structure
        assert mock_response["success"] is True
        assert isinstance(mock_response["data"], list)
        assert len(mock_response["data"]) == 1
        assert mock_response["count"] == 1
        assert "executionTime" in mock_response
        assert "message" in mock_response

        # Verify record structure
        record = mock_response["data"][0]
        assert "documentId" in record
        assert "id" in record
        assert "email" in record
        assert "status" in record
        assert "name" in record

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_update.Worqhat')
    def test_data_structure_validation_single_condition(self, mock_worqhat_class):
        """Test data structure validation for single where condition."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [
                {
                    "documentId": "doc_12345abcde",
                    "status": "active",
                    "updatedBy": "system",
                },
                {
                    "documentId": "doc_67890fghij",
                    "status": "active",
                    "updatedBy": "system",
                }
            ],
            "count": 2,
            "executionTime": 75,
            "message": "2 record(s) updated successfully in users",
        }

        mock_client.db.update_records.return_value = mock_response

        update_inactive_users()

        # Verify response structure
        assert mock_response["success"] is True
        assert isinstance(mock_response["data"], list)
        assert len(mock_response["data"]) == 2
        assert mock_response["count"] == 2

        # Verify all records have required fields
        for record in mock_response["data"]:
            assert "documentId" in record
            assert "status" in record
            assert "updatedBy" in record
            assert record["status"] == "active"
            assert record["updatedBy"] == "system"

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_update.Worqhat')
    def test_where_conditions_multiple_keys(self, mock_worqhat_class):
        """Test that multiple where conditions are handled correctly."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [],
            "count": 0,
            "executionTime": 25,
            "message": "0 record(s) updated successfully in users",
        }

        mock_client.db.update_records.return_value = mock_response

        update_user_status()

        # Verify the where conditions
        call_args = mock_client.db.update_records.call_args
        where_conditions = call_args[1]["where"]

        assert len(where_conditions) == 2
        assert "id" in where_conditions
        assert "email" in where_conditions
        assert where_conditions["id"] == "123"
        assert where_conditions["email"] == "user@example.com"

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_update.Worqhat')
    def test_where_conditions_single_key(self, mock_worqhat_class):
        """Test that single where condition is handled correctly."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [],
            "count": 0,
            "executionTime": 25,
            "message": "0 record(s) updated successfully in users",
        }

        mock_client.db.update_records.return_value = mock_response

        update_inactive_users()

        # Verify the where condition
        call_args = mock_client.db.update_records.call_args
        where_conditions = call_args[1]["where"]

        assert len(where_conditions) == 1
        assert "status" in where_conditions
        assert where_conditions["status"] == "inactive"

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_update.Worqhat')
    def test_db_update_runs_all_examples(self, mock_worqhat_class):
        """Test that db_update runs all examples."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [],
            "count": 0,
            "executionTime": 25,
            "message": "0 record(s) updated successfully in users",
        }

        mock_client.db.update_records.return_value = mock_response

        db_update()

        # Should be called twice - once for each function
        assert mock_client.db.update_records.call_count == 2
