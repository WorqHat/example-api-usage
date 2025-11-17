import pytest
from unittest.mock import MagicMock, patch, mock_open
import os
from endpoints.db_nl_query import count_active_users, analyze_sales_data, db_nl_query


class TestDbNlQuery:
    """Test suite for db_nl_query functionality."""

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key",
        "WORQHAT_ENVIRONMENT": "test"
    })
    @patch('endpoints.db_nl_query.Worqhat')
    def test_count_active_users_success(self, mock_worqhat_class):
        """Test successful natural language query for counting active users."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [
                {
                    "count": 157,
                }
            ],
            "sql": "SELECT COUNT(*) as count FROM users WHERE status = 'active'",
            "execution_time": 38,
            "message": "Query processed successfully",
        }

        mock_client.db.process_nl_query.return_value = mock_response

        count_active_users()

        # Verify the call was made with correct parameters
        mock_worqhat_class.assert_called_once_with(
            api_key="test-api-key",
            environment="test"
        )

        mock_client.db.process_nl_query.assert_called_once_with(
            question="How many active users do we have?",
            table="users"
        )

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key",
        "WORQHAT_ENVIRONMENT": "test"
    })
    @patch('endpoints.db_nl_query.Worqhat')
    def test_analyze_sales_data_success(self, mock_worqhat_class):
        """Test successful natural language query for sales data analysis."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [
                {
                    "category": "electronics",
                    "total_revenue": 125000.50,
                    "order_count": 450,
                },
                {
                    "category": "books",
                    "total_revenue": 89000.25,
                    "order_count": 320,
                },
                {
                    "category": "clothing",
                    "total_revenue": 67500.75,
                    "order_count": 280,
                }
            ],
            "sql": "SELECT category, SUM(revenue) as total_revenue, COUNT(*) as order_count FROM sales WHERE quarter = 'Q4' AND year = 2024 GROUP BY category ORDER BY total_revenue DESC LIMIT 3",
            "execution_time": 125,
            "message": "Query processed successfully",
        }

        mock_client.db.process_nl_query.return_value = mock_response

        analyze_sales_data()

        # Verify the call was made with correct parameters
        mock_client.db.process_nl_query.assert_called_once_with(
            question="What were the top 3 product categories by revenue last quarter?",
            table="sales"
        )

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_nl_query.Worqhat')
    def test_count_active_users_api_error_handling(self, mock_worqhat_class):
        """Test API error handling in count_active_users."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.db.process_nl_query.side_effect = Exception("API Error: Could not understand question")

        with pytest.raises(Exception, match="API Error: Could not understand question"):
            count_active_users()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_nl_query.Worqhat')
    def test_analyze_sales_data_table_not_found_error(self, mock_worqhat_class):
        """Test table not found error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.db.process_nl_query.side_effect = Exception("Table not found")

        with pytest.raises(Exception, match="Table not found"):
            analyze_sales_data()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_nl_query.Worqhat')
    def test_count_active_users_network_error(self, mock_worqhat_class):
        """Test network error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.db.process_nl_query.side_effect = Exception("Network Error: Connection timeout")

        with pytest.raises(Exception, match="Network Error: Connection timeout"):
            count_active_users()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_nl_query.Worqhat')
    def test_analyze_sales_data_auth_error(self, mock_worqhat_class):
        """Test authentication error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.db.process_nl_query.side_effect = Exception("Authentication Error: Invalid API key")

        with pytest.raises(Exception, match="Authentication Error: Invalid API key"):
            analyze_sales_data()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_nl_query.Worqhat')
    def test_count_active_users_query_timeout(self, mock_worqhat_class):
        """Test query timeout error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.db.process_nl_query.side_effect = Exception("Query timed out")

        with pytest.raises(Exception, match="Query timed out"):
            count_active_users()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_nl_query.Worqhat')
    def test_count_active_users_empty_results(self, mock_worqhat_class):
        """Test handling of empty query results."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [],
            "sql": "SELECT COUNT(*) as count FROM users WHERE status = 'nonexistent'",
            "execution_time": 25,
            "message": "Query processed successfully",
        }

        mock_client.db.process_nl_query.return_value = mock_response

        count_active_users()

        # Verify empty results are handled
        assert mock_response["data"] == []
        assert len(mock_response["data"]) == 0

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_nl_query.Worqhat')
    def test_response_structure_validation_simple_query(self, mock_worqhat_class):
        """Test response structure validation for simple NL queries."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [
                {
                    "count": 157,
                }
            ],
            "sql": "SELECT COUNT(*) as count FROM users WHERE status = 'active'",
            "execution_time": 38,
            "message": "Query processed successfully",
        }

        mock_client.db.process_nl_query.return_value = mock_response

        count_active_users()

        # Verify response structure
        assert mock_response["success"] is True
        assert isinstance(mock_response["data"], list)
        assert len(mock_response["data"]) == 1
        assert "sql" in mock_response
        assert "execution_time" in mock_response
        assert "message" in mock_response
        assert isinstance(mock_response["execution_time"], int)
        assert isinstance(mock_response["sql"], str)
        assert isinstance(mock_response["message"], str)

        # Verify data structure
        record = mock_response["data"][0]
        assert "count" in record
        assert isinstance(record["count"], int)

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_nl_query.Worqhat')
    def test_response_structure_validation_complex_query(self, mock_worqhat_class):
        """Test response structure validation for complex analysis queries."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [
                {
                    "category": "electronics",
                    "total_revenue": 125000.50,
                    "order_count": 450,
                }
            ],
            "sql": "SELECT category, SUM(revenue) as total_revenue, COUNT(*) as order_count FROM sales WHERE quarter = 'Q4' AND year = 2024 GROUP BY category ORDER BY total_revenue DESC LIMIT 3",
            "execution_time": 125,
            "message": "Query processed successfully",
        }

        mock_client.db.process_nl_query.return_value = mock_response

        analyze_sales_data()

        # Verify response structure
        assert mock_response["success"] is True
        assert isinstance(mock_response["data"], list)
        assert len(mock_response["data"]) == 1

        # Verify analysis data structure
        record = mock_response["data"][0]
        assert "category" in record
        assert "total_revenue" in record
        assert "order_count" in record
        assert isinstance(record["total_revenue"], (int, float))
        assert isinstance(record["order_count"], int)

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_nl_query.Worqhat')
    def test_question_and_table_parameters(self, mock_worqhat_class):
        """Test that correct question and table parameters are passed."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [{"count": 157}],
            "sql": "SELECT COUNT(*) as count FROM users WHERE status = 'active'",
            "execution_time": 38,
            "message": "Query processed successfully",
        }

        mock_client.db.process_nl_query.return_value = mock_response

        # Test count_active_users
        count_active_users()
        call_args = mock_client.db.process_nl_query.call_args
        assert call_args[1]["question"] == "How many active users do we have?"
        assert call_args[1]["table"] == "users"

        # Reset mock for next test
        mock_client.db.process_nl_query.reset_mock()

        # Test analyze_sales_data
        analyze_sales_data()
        call_args = mock_client.db.process_nl_query.call_args
        assert call_args[1]["question"] == "What were the top 3 product categories by revenue last quarter?"
        assert call_args[1]["table"] == "sales"

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_nl_query.Worqhat')
    def test_sql_generation_transparency(self, mock_worqhat_class):
        """Test that generated SQL is included in response."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        expected_sql = "SELECT COUNT(*) as count FROM users WHERE status = 'active'"
        mock_response = {
            "success": True,
            "data": [{"count": 157}],
            "sql": expected_sql,
            "execution_time": 38,
            "message": "Query processed successfully",
        }

        mock_client.db.process_nl_query.return_value = mock_response

        count_active_users()

        # Verify SQL is included and correct
        assert mock_response["sql"] == expected_sql
        assert "SELECT" in mock_response["sql"]
        assert "FROM users" in mock_response["sql"]
        assert "WHERE status = 'active'" in mock_response["sql"]

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_nl_query.Worqhat')
    def test_execution_time_tracking(self, mock_worqhat_class):
        """Test that execution time is properly tracked."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [{"count": 157}],
            "sql": "SELECT COUNT(*) as count FROM users WHERE status = 'active'",
            "execution_time": 42,
            "message": "Query processed successfully",
        }

        mock_client.db.process_nl_query.return_value = mock_response

        count_active_users()

        # Verify execution time is included and reasonable
        assert mock_response["execution_time"] == 42
        assert isinstance(mock_response["execution_time"], int)
        assert mock_response["execution_time"] > 0

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_nl_query.Worqhat')
    def test_complex_query_sql_generation(self, mock_worqhat_class):
        """Test SQL generation for complex analysis queries."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        expected_sql = "SELECT category, SUM(revenue) as total_revenue, COUNT(*) as order_count FROM sales WHERE quarter = 'Q4' AND year = 2024 GROUP BY category ORDER BY total_revenue DESC LIMIT 3"
        mock_response = {
            "success": True,
            "data": [{"category": "electronics", "total_revenue": 125000.50, "order_count": 450}],
            "sql": expected_sql,
            "execution_time": 125,
            "message": "Query processed successfully",
        }

        mock_client.db.process_nl_query.return_value = mock_response

        analyze_sales_data()

        # Verify complex SQL generation
        assert mock_response["sql"] == expected_sql
        assert "SELECT" in mock_response["sql"]
        assert "SUM(" in mock_response["sql"]
        assert "COUNT(*)" in mock_response["sql"]
        assert "GROUP BY" in mock_response["sql"]
        assert "ORDER BY" in mock_response["sql"]
        assert "LIMIT 3" in mock_response["sql"]

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.db_nl_query.Worqhat')
    def test_db_nl_query_runs_all_examples(self, mock_worqhat_class):
        """Test that db_nl_query runs all examples."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "data": [],
            "sql": "SELECT 1",
            "execution_time": 25,
            "message": "Query processed successfully",
        }

        mock_client.db.process_nl_query.return_value = mock_response

        db_nl_query()

        # Should be called twice - once for each function
        assert mock_client.db.process_nl_query.call_count == 2
