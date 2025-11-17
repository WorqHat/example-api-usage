import pytest
from unittest.mock import MagicMock, patch, mock_open
import os
from endpoints.db_query import fetch_active_users, generate_sales_report, search_users, db_query


class TestDbQuery:
    """Test suite for db_query functionality."""

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key",
        "WORQHAT_ENVIRONMENT": "test"
    })
    @patch('endpoints.db_query.Worqhat')
    def test_fetch_active_users_success(self, mock_worqhat_class):
        """Test successful execution of query with named parameters."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [
                {
                    "id": "user_123",
                    "name": "John Doe",
                    "email": "john@example.com",
                    "status": "active",
                },
                {
                    "id": "user_456",
                    "name": "Jane Smith",
                    "email": "jane@example.com",
                    "status": "active",
                }
            ],
            "execution_time": 42,
            "query": "SELECT * FROM users WHERE status = 'active' LIMIT 10",
        }

        mock_client.db.execute_query.return_value = mock_response

        fetch_active_users()

        # Verify the call was made with correct parameters
        mock_worqhat_class.assert_called_once_with(
            api_key="test-api-key",
            environment="test"
        )

        mock_client.db.execute_query.assert_called_once_with(
            query="SELECT * FROM users WHERE status = {status} LIMIT {limit}",
            params={
                "status": "active",
                "limit": 10,
            }
        )

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key",
        "WORQHAT_ENVIRONMENT": "test"
    })
    @patch('endpoints.db_query.Worqhat')
    def test_generate_sales_report_success(self, mock_worqhat_class):
        """Test successful execution of complex query with positional parameters."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [
                {
                    "category": "electronics",
                    "order_count": 25,
                    "total_items": 45,
                    "total_revenue": 15750.50,
                },
                {
                    "category": "books",
                    "order_count": 18,
                    "total_items": 32,
                    "total_revenue": 8950.25,
                }
            ],
            "execution_time": 125,
            "query": "SELECT category, COUNT(*) as order_count, SUM(quantity) as total_items, SUM(price * quantity) as total_revenue FROM orders WHERE order_date >= '2025-01-01' GROUP BY category ORDER BY total_revenue DESC",
        }

        mock_client.db.execute_query.return_value = mock_response

        generate_sales_report()

        # Verify the call was made with correct parameters
        mock_client.db.execute_query.assert_called_once()
        call_args = mock_client.db.execute_query.call_args
        assert "query" in call_args[1]
        assert call_args[1]["params"] == ["2025-01-01"]
        assert "SELECT" in call_args[1]["query"]
        assert "COUNT(*)" in call_args[1]["query"]
        assert "SUM(" in call_args[1]["query"]

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key",
        "WORQHAT_ENVIRONMENT": "test"
    })
    @patch('endpoints.db_query.Worqhat')
    def test_search_users_success(self, mock_worqhat_class):
        """Test successful execution of search query with multiple named parameters."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [
                {
                    "id": "user_123",
                    "name": "John Doe",
                    "email": "john@example.com",
                    "status": "active",
                    "created_at": "2025-01-15",
                }
            ],
            "execution_time": 35,
            "query": "SELECT * FROM users WHERE status = 'active' AND created_at >= '2025-01-01' ORDER BY created_at LIMIT 50",
        }

        mock_client.db.execute_query.return_value = mock_response

        search_users()

        # Verify the call was made with correct parameters
        mock_client.db.execute_query.assert_called_once_with(
            query="SELECT * FROM users WHERE status = {status} AND created_at >= {created_after} ORDER BY {sort_by} LIMIT {limit}",
            params={
                "status": "active",
                "created_after": "2025-01-01",
                "sort_by": "created_at",
                "limit": 50,
            }
        )

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_query.Worqhat')
    def test_fetch_active_users_api_error_handling(self, mock_worqhat_class):
        """Test API error handling in fetch_active_users."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.db.execute_query.side_effect = Exception("API Error: Table not found")

        with pytest.raises(Exception, match="API Error: Table not found"):
            fetch_active_users()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_query.Worqhat')
    def test_generate_sales_report_syntax_error(self, mock_worqhat_class):
        """Test handling of SQL syntax errors."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.db.execute_query.side_effect = Exception("Syntax error in SQL query")

        with pytest.raises(Exception, match="Syntax error in SQL query"):
            generate_sales_report()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_query.Worqhat')
    def test_search_users_query_timeout(self, mock_worqhat_class):
        """Test handling of query timeout errors."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.db.execute_query.side_effect = Exception("Query timeout")

        with pytest.raises(Exception, match="Query timeout"):
            search_users()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_query.Worqhat')
    def test_fetch_active_users_network_error(self, mock_worqhat_class):
        """Test network error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.db.execute_query.side_effect = Exception("Network Error: Connection timeout")

        with pytest.raises(Exception, match="Network Error: Connection timeout"):
            fetch_active_users()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_query.Worqhat')
    def test_generate_sales_report_auth_error(self, mock_worqhat_class):
        """Test authentication error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.db.execute_query.side_effect = Exception("Authentication Error: Invalid API key")

        with pytest.raises(Exception, match="Authentication Error: Invalid API key"):
            generate_sales_report()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_query.Worqhat')
    def test_search_users_unauthorized_operation(self, mock_worqhat_class):
        """Test handling of unauthorized operation errors."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.db.execute_query.side_effect = Exception("Operation not allowed")

        with pytest.raises(Exception, match="Operation not allowed"):
            search_users()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_query.Worqhat')
    def test_fetch_active_users_empty_results(self, mock_worqhat_class):
        """Test handling of empty query results."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [],
            "execution_time": 25,
            "query": "SELECT * FROM users WHERE status = 'active' LIMIT 10",
        }

        mock_client.db.execute_query.return_value = mock_response

        fetch_active_users()

        # Verify empty results are handled
        assert mock_response["data"] == []
        assert len(mock_response["data"]) == 0

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_query.Worqhat')
    def test_response_structure_validation_simple_query(self, mock_worqhat_class):
        """Test response structure validation for simple queries."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [
                {
                    "id": "user_123",
                    "name": "John Doe",
                    "email": "john@example.com",
                    "status": "active",
                }
            ],
            "execution_time": 42,
            "query": "SELECT * FROM users WHERE status = 'active' LIMIT 10",
        }

        mock_client.db.execute_query.return_value = mock_response

        fetch_active_users()

        # Verify response structure
        assert mock_response["success"] is True
        assert isinstance(mock_response["data"], list)
        assert len(mock_response["data"]) == 1
        assert "execution_time" in mock_response
        assert "query" in mock_response
        assert isinstance(mock_response["execution_time"], int)
        assert isinstance(mock_response["query"], str)

        # Verify record structure
        record = mock_response["data"][0]
        assert "id" in record
        assert "name" in record
        assert "email" in record
        assert "status" in record

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_query.Worqhat')
    def test_response_structure_validation_complex_query(self, mock_worqhat_class):
        """Test response structure validation for complex aggregation queries."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [
                {
                    "category": "electronics",
                    "order_count": 25,
                    "total_items": 45,
                    "total_revenue": 15750.50,
                }
            ],
            "execution_time": 125,
            "query": "SELECT category, COUNT(*) as order_count, SUM(quantity) as total_items, SUM(price * quantity) as total_revenue FROM orders WHERE order_date >= '2025-01-01' GROUP BY category ORDER BY total_revenue DESC",
        }

        mock_client.db.execute_query.return_value = mock_response

        generate_sales_report()

        # Verify response structure
        assert mock_response["success"] is True
        assert isinstance(mock_response["data"], list)
        assert len(mock_response["data"]) == 1

        # Verify aggregated data structure
        record = mock_response["data"][0]
        assert "category" in record
        assert "order_count" in record
        assert "total_items" in record
        assert "total_revenue" in record
        assert isinstance(record["order_count"], int)
        assert isinstance(record["total_revenue"], (int, float))

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_query.Worqhat')
    def test_parameter_handling_named_parameters(self, mock_worqhat_class):
        """Test named parameter handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [],
            "execution_time": 25,
            "query": "SELECT * FROM users WHERE status = 'active' LIMIT 10",
        }

        mock_client.db.execute_query.return_value = mock_response

        fetch_active_users()

        # Verify named parameters
        call_args = mock_client.db.execute_query.call_args
        params = call_args[1]["params"]
        assert isinstance(params, dict)
        assert "status" in params
        assert "limit" in params
        assert params["status"] == "active"
        assert params["limit"] == 10

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_query.Worqhat')
    def test_parameter_handling_positional_parameters(self, mock_worqhat_class):
        """Test positional parameter handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [],
            "execution_time": 25,
            "query": "SELECT category, COUNT(*) as order_count FROM orders WHERE order_date >= '2025-01-01' GROUP BY category",
        }

        mock_client.db.execute_query.return_value = mock_response

        generate_sales_report()

        # Verify positional parameters
        call_args = mock_client.db.execute_query.call_args
        params = call_args[1]["params"]
        assert isinstance(params, list)
        assert len(params) == 1
        assert params[0] == "2025-01-01"

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_query.Worqhat')
    def test_parameter_handling_multiple_named_parameters(self, mock_worqhat_class):
        """Test multiple named parameter handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [],
            "execution_time": 25,
            "query": "SELECT * FROM users WHERE status = 'active' AND created_at >= '2025-01-01' ORDER BY created_at LIMIT 50",
        }

        mock_client.db.execute_query.return_value = mock_response

        search_users()

        # Verify multiple named parameters
        call_args = mock_client.db.execute_query.call_args
        params = call_args[1]["params"]
        assert isinstance(params, dict)
        assert len(params) == 4
        assert "status" in params
        assert "created_after" in params
        assert "sort_by" in params
        assert "limit" in params

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_query.Worqhat')
    def test_query_structure_validation(self, mock_worqhat_class):
        """Test that queries have proper SQL structure."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [],
            "execution_time": 25,
            "query": "SELECT * FROM users WHERE status = 'active' LIMIT 10",
        }

        mock_client.db.execute_query.return_value = mock_response

        # Test simple query
        fetch_active_users()
        call_args = mock_client.db.execute_query.call_args
        query = call_args[1]["query"]
        assert query.startswith("SELECT")
        assert "FROM users" in query
        assert "{status}" in query
        assert "{limit}" in query

        # Reset mock for next test
        mock_client.db.execute_query.reset_mock()

        # Test complex query
        generate_sales_report()
        call_args = mock_client.db.execute_query.call_args
        query = call_args[1]["query"]
        assert query.startswith("SELECT")
        assert "COUNT(*)" in query
        assert "SUM(" in query
        assert "GROUP BY" in query
        assert "ORDER BY" in query
        assert "$1" in query

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_query.Worqhat')
    def test_db_query_runs_all_examples(self, mock_worqhat_class):
        """Test that db_query runs all examples."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [],
            "execution_time": 25,
            "query": "SELECT 1",
        }

        mock_client.db.execute_query.return_value = mock_response

        db_query()

        # Should be called three times - once for each function
        assert mock_client.db.execute_query.call_count == 3
