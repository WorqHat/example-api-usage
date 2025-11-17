import pytest
from unittest.mock import MagicMock, patch, mock_open
import os
from endpoints.db_delete import delete_inactive_users, delete_old_completed_tasks, db_delete


class TestDbDelete:
    """Test suite for db_delete functionality."""

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key",
        "WORQHAT_ENVIRONMENT": "test"
    })
    @patch('endpoints.db_delete.Worqhat')
    def test_delete_inactive_users_success(self, mock_worqhat_class):
        """Test successful deletion of inactive users."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "deleted_count": 5,
            "message": "5 record(s) deleted successfully from users",
        }

        mock_client.db.delete_records.return_value = mock_response

        delete_inactive_users()

        # Verify the call was made with correct parameters
        mock_worqhat_class.assert_called_once_with(
            api_key="test-api-key",
            environment="test"
        )

        mock_client.db.delete_records.assert_called_once_with(
            table="users",
            where={
                "status": "inactive",
            }
        )

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key",
        "WORQHAT_ENVIRONMENT": "test"
    })
    @patch('endpoints.db_delete.Worqhat')
    def test_delete_old_completed_tasks_success(self, mock_worqhat_class):
        """Test successful deletion of old completed tasks."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "deleted_count": 3,
            "message": "3 record(s) deleted successfully from tasks",
        }

        mock_client.db.delete_records.return_value = mock_response

        delete_old_completed_tasks()

        # Verify the call was made with correct parameters
        mock_client.db.delete_records.assert_called_once_with(
            table="tasks",
            where={
                "status": "completed",
                "priority": "low",
            }
        )

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_delete.Worqhat')
    def test_delete_inactive_users_api_error_handling(self, mock_worqhat_class):
        """Test API error handling in delete_inactive_users."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.db.delete_records.side_effect = Exception("API Error: Table not found")

        with pytest.raises(Exception, match="API Error: Table not found"):
            delete_inactive_users()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_delete.Worqhat')
    def test_delete_old_completed_tasks_no_records_error(self, mock_worqhat_class):
        """Test handling of no records matched error."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.db.delete_records.side_effect = Exception("No records match the conditions")

        with pytest.raises(Exception, match="No records match the conditions"):
            delete_old_completed_tasks()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_delete.Worqhat')
    def test_delete_inactive_users_network_error(self, mock_worqhat_class):
        """Test network error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.db.delete_records.side_effect = Exception("Network Error: Connection timeout")

        with pytest.raises(Exception, match="Network Error: Connection timeout"):
            delete_inactive_users()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_delete.Worqhat')
    def test_delete_old_completed_tasks_auth_error(self, mock_worqhat_class):
        """Test authentication error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.db.delete_records.side_effect = Exception("Authentication Error: Invalid API key")

        with pytest.raises(Exception, match="Authentication Error: Invalid API key"):
            delete_old_completed_tasks()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_delete.Worqhat')
    def test_delete_inactive_users_validation_error(self, mock_worqhat_class):
        """Test validation error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.db.delete_records.side_effect = Exception("Validation Error: Missing where conditions")

        with pytest.raises(Exception, match="Validation Error: Missing where conditions"):
            delete_inactive_users()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_delete.Worqhat')
    def test_delete_inactive_users_zero_records(self, mock_worqhat_class):
        """Test handling of zero records deleted."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "deleted_count": 0,
            "message": "0 record(s) deleted successfully from users",
        }

        mock_client.db.delete_records.return_value = mock_response

        delete_inactive_users()

        # Verify the response handling
        assert mock_response["deleted_count"] == 0
        assert mock_response["success"] is True

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_delete.Worqhat')
    def test_response_structure_validation_single_condition(self, mock_worqhat_class):
        """Test response structure validation for single where condition."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "deleted_count": 5,
            "message": "5 record(s) deleted successfully from users",
        }

        mock_client.db.delete_records.return_value = mock_response

        delete_inactive_users()

        # Verify response structure
        assert mock_response["success"] is True
        assert mock_response["deleted_count"] == 5
        assert "message" in mock_response
        assert isinstance(mock_response["deleted_count"], int)
        assert isinstance(mock_response["message"], str)

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_delete.Worqhat')
    def test_response_structure_validation_multiple_conditions(self, mock_worqhat_class):
        """Test response structure validation for multiple where conditions."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "deleted_count": 3,
            "message": "3 record(s) deleted successfully from tasks",
        }

        mock_client.db.delete_records.return_value = mock_response

        delete_old_completed_tasks()

        # Verify response structure
        assert mock_response["success"] is True
        assert mock_response["deleted_count"] == 3
        assert "message" in mock_response
        assert isinstance(mock_response["deleted_count"], int)
        assert isinstance(mock_response["message"], str)

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_delete.Worqhat')
    def test_where_conditions_single_key(self, mock_worqhat_class):
        """Test that single where condition is handled correctly."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "deleted_count": 5,
            "message": "5 record(s) deleted successfully from users",
        }

        mock_client.db.delete_records.return_value = mock_response

        delete_inactive_users()

        # Verify the where condition
        call_args = mock_client.db.delete_records.call_args
        where_conditions = call_args[1]["where"]

        assert len(where_conditions) == 1
        assert "status" in where_conditions
        assert where_conditions["status"] == "inactive"

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_delete.Worqhat')
    def test_where_conditions_multiple_keys(self, mock_worqhat_class):
        """Test that multiple where conditions are handled correctly."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "deleted_count": 3,
            "message": "3 record(s) deleted successfully from tasks",
        }

        mock_client.db.delete_records.return_value = mock_response

        delete_old_completed_tasks()

        # Verify the where conditions
        call_args = mock_client.db.delete_records.call_args
        where_conditions = call_args[1]["where"]

        assert len(where_conditions) == 2
        assert "status" in where_conditions
        assert "priority" in where_conditions
        assert where_conditions["status"] == "completed"
        assert where_conditions["priority"] == "low"

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_delete.Worqhat')
    def test_table_targeting(self, mock_worqhat_class):
        """Test that correct tables are targeted."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response_users = {
            "success": True,
            "deleted_count": 5,
            "message": "5 record(s) deleted successfully from users",
        }

        mock_response_tasks = {
            "success": True,
            "deleted_count": 3,
            "message": "3 record(s) deleted successfully from tasks",
        }

        mock_client.db.delete_records.side_effect = [mock_response_users, mock_response_tasks]

        delete_inactive_users()
        delete_old_completed_tasks()

        # Verify table targeting
        calls = mock_client.db.delete_records.call_args_list
        assert len(calls) == 2

        # First call should target users table
        assert calls[0][1]["table"] == "users"

        # Second call should target tasks table
        assert calls[1][1]["table"] == "tasks"

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_delete.Worqhat')
    def test_db_delete_runs_all_examples(self, mock_worqhat_class):
        """Test that db_delete runs all examples."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "deleted_count": 0,
            "message": "0 record(s) deleted successfully",
        }

        mock_client.db.delete_records.return_value = mock_response

        db_delete()

        # Should be called twice - once for each function
        assert mock_client.db.delete_records.call_count == 2
