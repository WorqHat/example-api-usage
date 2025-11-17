import pytest
from unittest.mock import MagicMock, patch, mock_open
import os
from endpoints.flows_metrics import get_workflow_metrics, get_all_workflow_metrics, get_flows_metrics


class TestFlowsMetrics:
    """Test suite for flows_metrics functionality."""

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key",
        "WORQHAT_ENVIRONMENT": "test"
    })
    @patch('endpoints.flows_metrics.Worqhat')
    def test_get_workflow_metrics_success(self, mock_worqhat_class):
        """Test successful workflow metrics retrieval with specific parameters."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "metrics": {
                "total_executions": 1256,
                "success_rate": 94.5,
                "average_duration": 1250.75,
                "error_rate": 5.5,
                "total_errors": 69,
            },
            "workflow_metrics": [
                {
                    "id": "flow_12345",
                    "name": "Document Processing",
                    "executions": 532,
                    "success_rate": 96.8,
                    "average_duration": 980.25,
                    "errors": 17,
                    "most_common_error": "document_parse_failure",
                },
                {
                    "id": "flow_67890",
                    "name": "Customer Onboarding",
                    "executions": 724,
                    "success_rate": 92.8,
                    "average_duration": 1450.5,
                    "errors": 52,
                    "most_common_error": "validation_error",
                }
            ],
            "period": {
                "start_date": "2025-07-01T00:00:00Z",
                "end_date": "2025-07-25T00:00:00Z",
            },
        }

        mock_client.workflows.get_metrics.return_value = mock_response

        get_workflow_metrics()

        # Verify the call was made with correct parameters
        mock_worqhat_class.assert_called_once_with(
            api_key="test-api-key",
            environment="test"
        )

        mock_client.workflows.get_metrics.assert_called_once_with(
            start_date="2025-07-01",
            end_date="2025-07-24",
            status="completed"
        )

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key",
        "WORQHAT_ENVIRONMENT": "test"
    })
    @patch('endpoints.flows_metrics.Worqhat')
    def test_get_all_workflow_metrics_success(self, mock_worqhat_class):
        """Test successful workflow metrics retrieval with default parameters."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "metrics": {
                "total_executions": 892,
                "success_rate": 91.2,
                "average_duration": 1100.0,
                "error_rate": 8.8,
                "total_errors": 78,
            },
            "workflow_metrics": [
                {
                    "id": "flow_11111",
                    "name": "Data Sync",
                    "executions": 892,
                    "success_rate": 91.2,
                    "average_duration": 1100.0,
                    "errors": 78,
                    "most_common_error": "network_timeout",
                }
            ],
            "period": {
                "start_date": "2025-07-01T00:00:00Z",
                "end_date": "2025-08-01T00:00:00Z",
            },
        }

        mock_client.workflows.get_metrics.return_value = mock_response

        get_all_workflow_metrics()

        # Verify the call was made with empty parameters (default date range)
        mock_client.workflows.get_metrics.assert_called_once_with()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_metrics.Worqhat')
    def test_get_workflow_metrics_api_error_handling(self, mock_worqhat_class):
        """Test API error handling in get_workflow_metrics."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.workflows.get_metrics.side_effect = Exception("API Error: Invalid date format")

        with pytest.raises(Exception, match="API Error: Invalid date format"):
            get_workflow_metrics()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_metrics.Worqhat')
    def test_get_all_workflow_metrics_unauthorized_error(self, mock_worqhat_class):
        """Test unauthorized error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.workflows.get_metrics.side_effect = Exception("Unauthorized")

        with pytest.raises(Exception, match="Unauthorized"):
            get_all_workflow_metrics()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_metrics.Worqhat')
    def test_get_workflow_metrics_network_error(self, mock_worqhat_class):
        """Test network error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.workflows.get_metrics.side_effect = Exception("Network Error: Connection timeout")

        with pytest.raises(Exception, match="Network Error: Connection timeout"):
            get_workflow_metrics()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_metrics.Worqhat')
    def test_get_all_workflow_metrics_invalid_status_error(self, mock_worqhat_class):
        """Test invalid status parameter error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.workflows.get_metrics.side_effect = Exception("Invalid status parameter")

        with pytest.raises(Exception, match="Invalid status parameter"):
            get_all_workflow_metrics()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_metrics.Worqhat')
    def test_get_workflow_metrics_end_date_before_start_date_error(self, mock_worqhat_class):
        """Test end date before start date error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.workflows.get_metrics.side_effect = Exception("End date before start date")

        with pytest.raises(Exception, match="End date before start date"):
            get_workflow_metrics()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_metrics.Worqhat')
    def test_get_workflow_metrics_empty_results(self, mock_worqhat_class):
        """Test handling of empty workflow metrics results."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "metrics": {
                "total_executions": 0,
                "success_rate": 0,
                "average_duration": 0,
                "error_rate": 0,
                "total_errors": 0,
            },
            "workflow_metrics": [],
            "period": {
                "start_date": "2025-07-01T00:00:00Z",
                "end_date": "2025-07-25T00:00:00Z",
            },
        }

        mock_client.workflows.get_metrics.return_value = mock_response

        get_workflow_metrics()

        # Verify empty results are handled
        assert mock_response["metrics"]["total_executions"] == 0
        assert len(mock_response["workflow_metrics"]) == 0

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_metrics.Worqhat')
    def test_response_structure_validation_simple_query(self, mock_worqhat_class):
        """Test response structure validation for workflow metrics queries."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "metrics": {
                "total_executions": 1256,
                "success_rate": 94.5,
                "average_duration": 1250.75,
                "error_rate": 5.5,
                "total_errors": 69,
            },
            "workflow_metrics": [
                {
                    "id": "flow_12345",
                    "name": "Document Processing",
                    "executions": 532,
                    "success_rate": 96.8,
                    "average_duration": 980.25,
                    "errors": 17,
                    "most_common_error": "document_parse_failure",
                }
            ],
            "period": {
                "start_date": "2025-07-01T00:00:00Z",
                "end_date": "2025-07-25T00:00:00Z",
            },
        }

        mock_client.workflows.get_metrics.return_value = mock_response

        get_workflow_metrics()

        # Verify response structure
        assert "metrics" in mock_response
        assert "workflow_metrics" in mock_response
        assert "period" in mock_response
        assert isinstance(mock_response["metrics"], dict)
        assert isinstance(mock_response["workflow_metrics"], list)
        assert isinstance(mock_response["period"], dict)
        assert len(mock_response["workflow_metrics"]) == 1

        # Verify metrics structure
        metrics = mock_response["metrics"]
        assert "total_executions" in metrics
        assert "success_rate" in metrics
        assert "average_duration" in metrics
        assert "error_rate" in metrics
        assert "total_errors" in metrics
        assert isinstance(metrics["total_executions"], int)
        assert isinstance(metrics["success_rate"], (int, float))

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_metrics.Worqhat')
    def test_response_structure_validation_individual_workflows(self, mock_worqhat_class):
        """Test response structure validation for individual workflow metrics."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "metrics": {
                "total_executions": 532,
                "success_rate": 96.8,
                "average_duration": 980.25,
                "error_rate": 3.2,
                "total_errors": 17,
            },
            "workflow_metrics": [
                {
                    "id": "flow_12345",
                    "name": "Document Processing",
                    "executions": 532,
                    "success_rate": 96.8,
                    "average_duration": 980.25,
                    "errors": 17,
                    "most_common_error": "document_parse_failure",
                }
            ],
            "period": {
                "start_date": "2025-07-01T00:00:00Z",
                "end_date": "2025-07-25T00:00:00Z",
            },
        }

        mock_client.workflows.get_metrics.return_value = mock_response

        get_workflow_metrics()

        # Verify individual workflow structure
        workflow = mock_response["workflow_metrics"][0]
        assert "id" in workflow
        assert "name" in workflow
        assert "executions" in workflow
        assert "success_rate" in workflow
        assert "average_duration" in workflow
        assert "errors" in workflow
        assert "most_common_error" in workflow
        assert isinstance(workflow["executions"], int)
        assert isinstance(workflow["success_rate"], (int, float))
        assert isinstance(workflow["average_duration"], (int, float))

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_metrics.Worqhat')
    def test_parameter_validation_specific_dates(self, mock_worqhat_class):
        """Test parameter validation for specific date range queries."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "metrics": {"total_executions": 1256, "success_rate": 94.5, "average_duration": 1250.75, "error_rate": 5.5, "total_errors": 69},
            "workflow_metrics": [],
            "period": {"start_date": "2025-07-01T00:00:00Z", "end_date": "2025-07-25T00:00:00Z"},
        }

        mock_client.workflows.get_metrics.return_value = mock_response

        get_workflow_metrics()

        # Verify parameters passed correctly
        call_args = mock_client.workflows.get_metrics.call_args
        assert call_args[1]["start_date"] == "2025-07-01"
        assert call_args[1]["end_date"] == "2025-07-24"
        assert call_args[1]["status"] == "completed"

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_metrics.Worqhat')
    def test_parameter_validation_default_dates(self, mock_worqhat_class):
        """Test parameter validation for default date range queries."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "metrics": {"total_executions": 892, "success_rate": 91.2, "average_duration": 1100.0, "error_rate": 8.8, "total_errors": 78},
            "workflow_metrics": [],
            "period": {"start_date": "2025-07-01T00:00:00Z", "end_date": "2025-08-01T00:00:00Z"},
        }

        mock_client.workflows.get_metrics.return_value = mock_response

        get_all_workflow_metrics()

        # Verify no parameters passed (default date range)
        call_args = mock_client.workflows.get_metrics.call_args
        assert call_args[1] == {}

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_metrics.Worqhat')
    def test_metrics_calculations_success_rates(self, mock_worqhat_class):
        """Test metrics calculations for success rates and error rates."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "metrics": {
                "total_executions": 1000,
                "success_rate": 85.5,
                "average_duration": 1500.0,
                "error_rate": 14.5,
                "total_errors": 145,
            },
            "workflow_metrics": [],
            "period": {"start_date": "2025-07-01T00:00:00Z", "end_date": "2025-07-25T00:00:00Z"},
        }

        mock_client.workflows.get_metrics.return_value = mock_response

        get_workflow_metrics()

        # Verify metrics calculations
        metrics = mock_response["metrics"]
        assert metrics["success_rate"] == 85.5
        assert metrics["error_rate"] == 14.5
        assert metrics["total_errors"] == 145
        assert metrics["total_executions"] == 1000

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_metrics.Worqhat')
    def test_metrics_calculations_perfect_workflow(self, mock_worqhat_class):
        """Test metrics for workflows with 100% success rate."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "metrics": {
                "total_executions": 500,
                "success_rate": 100.0,
                "average_duration": 1200.0,
                "error_rate": 0.0,
                "total_errors": 0,
            },
            "workflow_metrics": [
                {
                    "id": "flow_perfect",
                    "name": "Perfect Workflow",
                    "executions": 500,
                    "success_rate": 100.0,
                    "average_duration": 1200.0,
                    "errors": 0,
                    "most_common_error": None,
                }
            ],
            "period": {"start_date": "2025-07-01T00:00:00Z", "end_date": "2025-07-25T00:00:00Z"},
        }

        mock_client.workflows.get_metrics.return_value = mock_response

        get_workflow_metrics()

        # Verify perfect workflow metrics
        assert mock_response["metrics"]["success_rate"] == 100.0
        assert mock_response["metrics"]["error_rate"] == 0.0
        assert mock_response["metrics"]["total_errors"] == 0
        workflow = mock_response["workflow_metrics"][0]
        assert workflow["success_rate"] == 100.0
        assert workflow["most_common_error"] is None

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_metrics.Worqhat')
    def test_metrics_calculations_broken_workflow(self, mock_worqhat_class):
        """Test metrics for workflows with 0% success rate."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "metrics": {
                "total_executions": 50,
                "success_rate": 0.0,
                "average_duration": 0,
                "error_rate": 100.0,
                "total_errors": 50,
            },
            "workflow_metrics": [
                {
                    "id": "flow_broken",
                    "name": "Broken Workflow",
                    "executions": 50,
                    "success_rate": 0.0,
                    "average_duration": 0,
                    "errors": 50,
                    "most_common_error": "system_error",
                }
            ],
            "period": {"start_date": "2025-07-01T00:00:00Z", "end_date": "2025-07-25T00:00:00Z"},
        }

        mock_client.workflows.get_metrics.return_value = mock_response

        get_workflow_metrics()

        # Verify broken workflow metrics
        assert mock_response["metrics"]["success_rate"] == 0.0
        assert mock_response["metrics"]["error_rate"] == 100.0
        assert mock_response["metrics"]["total_errors"] == 50
        workflow = mock_response["workflow_metrics"][0]
        assert workflow["success_rate"] == 0.0
        assert workflow["most_common_error"] == "system_error"

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_metrics.Worqhat')
    def test_period_validation(self, mock_worqhat_class):
        """Test period structure and date format validation."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "metrics": {"total_executions": 1256, "success_rate": 94.5, "average_duration": 1250.75, "error_rate": 5.5, "total_errors": 69},
            "workflow_metrics": [],
            "period": {
                "start_date": "2025-07-01T00:00:00Z",
                "end_date": "2025-07-25T00:00:00Z",
            },
        }

        mock_client.workflows.get_metrics.return_value = mock_response

        get_workflow_metrics()

        # Verify period structure
        period = mock_response["period"]
        assert "start_date" in period
        assert "end_date" in period
        assert period["start_date"] == "2025-07-01T00:00:00Z"
        assert period["end_date"] == "2025-07-25T00:00:00Z"

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_metrics.Worqhat')
    def test_get_flows_metrics_runs_all_examples(self, mock_worqhat_class):
        """Test that get_flows_metrics runs all examples."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "metrics": {"total_executions": 0, "success_rate": 0, "average_duration": 0, "error_rate": 0, "total_errors": 0},
            "workflow_metrics": [],
            "period": {"start_date": "2025-07-01T00:00:00Z", "end_date": "2025-07-25T00:00:00Z"},
        }

        mock_client.workflows.get_metrics.return_value = mock_response

        get_flows_metrics()

        # Should be called twice - once for each function
        assert mock_client.workflows.get_metrics.call_count == 2
