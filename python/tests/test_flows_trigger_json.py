import pytest
from unittest.mock import MagicMock, patch, mock_open
import os
from endpoints.flows_trigger_json import onboard_new_customer, process_ecommerce_order, trigger_data_analysis, trigger_flow_json


class TestFlowsTriggerJson:
    """Test suite for flows_trigger_json functionality."""

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key",
        "WORQHAT_ENVIRONMENT": "test"
    })
    @patch('endpoints.flows_trigger_json.Worqhat')
    def test_onboard_new_customer_success(self, mock_worqhat_class):
        """Test successful customer onboarding workflow trigger."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "message": "Workflow triggered successfully",
            "analytics_id": "wf-exec-12345-abcde-67890",
            "timestamp": "2023-07-24T15:30:45Z",
            "data": {
                "workflow_status": "started",
            },
        }

        mock_client.flows.trigger_with_payload.return_value = mock_response

        onboard_new_customer()

        # Verify the call was made with correct parameters
        mock_worqhat_class.assert_called_once_with(
            api_key="test-api-key",
            environment="test"
        )

        mock_client.flows.trigger_with_payload.assert_called_once()
        call_args = mock_client.flows.trigger_with_payload.call_args
        assert call_args[0][0] == "workflow-id-for-customer-onboarding"
        assert "body" in call_args[1]
        assert call_args[1]["body"]["name"] == "Jane Smith"
        assert call_args[1]["body"]["email"] == "jane.smith@example.com"

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key",
        "WORQHAT_ENVIRONMENT": "test"
    })
    @patch('endpoints.flows_trigger_json.Worqhat')
    def test_process_ecommerce_order_success(self, mock_worqhat_class):
        """Test successful e-commerce order processing workflow trigger."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "message": "Workflow triggered successfully",
            "analytics_id": "wf-exec-67890-fghij-12345",
            "timestamp": "2023-07-24T16:45:30Z",
            "data": {
                "workflow_status": "started",
            },
        }

        mock_client.flows.trigger_with_payload.return_value = mock_response

        process_ecommerce_order()

        # Verify the call was made with correct parameters
        mock_client.flows.trigger_with_payload.assert_called_once()
        call_args = mock_client.flows.trigger_with_payload.call_args
        assert call_args[0][0] == "order-processing-workflow-id"
        assert "body" in call_args[1]
        assert call_args[1]["body"]["orderId"] == "ORD-12345"
        assert "customer" in call_args[1]["body"]
        assert "items" in call_args[1]["body"]
        assert len(call_args[1]["body"]["items"]) == 2

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key",
        "WORQHAT_ENVIRONMENT": "test"
    })
    @patch('endpoints.flows_trigger_json.Worqhat')
    def test_trigger_data_analysis_success(self, mock_worqhat_class):
        """Test successful data analysis workflow trigger."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "message": "Workflow triggered successfully",
            "analytics_id": "wf-exec-99999-xyzab-45678",
            "timestamp": "2023-07-24T17:20:15Z",
            "data": {
                "workflow_status": "started",
            },
        }

        mock_client.flows.trigger_with_payload.return_value = mock_response

        trigger_data_analysis()

        # Verify the call was made with correct parameters
        mock_client.flows.trigger_with_payload.assert_called_once()
        call_args = mock_client.flows.trigger_with_payload.call_args
        assert call_args[0][0] == "data-analysis-workflow-id"
        assert "body" in call_args[1]
        assert call_args[1]["body"]["datasetId"] == "DS-456"
        assert "analysisParameters" in call_args[1]["body"]
        assert "outputFormat" in call_args[1]["body"]

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_trigger_json.Worqhat')
    def test_onboard_new_customer_api_error_handling(self, mock_worqhat_class):
        """Test API error handling in onboard_new_customer."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.flows.trigger_with_payload.side_effect = Exception("API Error: Invalid API key provided")

        with pytest.raises(Exception, match="API Error: Invalid API key provided"):
            onboard_new_customer()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_trigger_json.Worqhat')
    def test_process_ecommerce_order_workflow_not_found_error(self, mock_worqhat_class):
        """Test workflow not found error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.flows.trigger_with_payload.side_effect = Exception("Workflow not found")

        with pytest.raises(Exception, match="Workflow not found"):
            process_ecommerce_order()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_trigger_json.Worqhat')
    def test_trigger_data_analysis_invalid_payload_error(self, mock_worqhat_class):
        """Test invalid payload error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.flows.trigger_with_payload.side_effect = Exception("Invalid payload format")

        with pytest.raises(Exception, match="Invalid payload format"):
            trigger_data_analysis()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_trigger_json.Worqhat')
    def test_onboard_new_customer_network_error(self, mock_worqhat_class):
        """Test network error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.flows.trigger_with_payload.side_effect = Exception("Network Error: Connection timeout")

        with pytest.raises(Exception, match="Network Error: Connection timeout"):
            onboard_new_customer()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_trigger_json.Worqhat')
    def test_process_ecommerce_order_rate_limit_error(self, mock_worqhat_class):
        """Test rate limit error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.flows.trigger_with_payload.side_effect = Exception("Rate limit exceeded")

        with pytest.raises(Exception, match="Rate limit exceeded"):
            process_ecommerce_order()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_trigger_json.Worqhat')
    def test_response_structure_validation_simple_customer_onboarding(self, mock_worqhat_class):
        """Test response structure validation for customer onboarding."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "message": "Workflow triggered successfully",
            "analytics_id": "wf-exec-12345-abcde-67890",
            "timestamp": "2023-07-24T15:30:45Z",
            "data": {
                "workflow_status": "started",
            },
        }

        mock_client.flows.trigger_with_payload.return_value = mock_response

        onboard_new_customer()

        # Verify response structure
        assert mock_response["success"] is True
        assert "message" in mock_response
        assert "analytics_id" in mock_response
        assert "timestamp" in mock_response
        assert "data" in mock_response
        assert "workflow_status" in mock_response["data"]
        assert mock_response["message"] == "Workflow triggered successfully"

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_trigger_json.Worqhat')
    def test_response_structure_validation_ecommerce_order(self, mock_worqhat_class):
        """Test response structure validation for e-commerce order processing."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "message": "Workflow triggered successfully",
            "analytics_id": "wf-exec-67890-fghij-12345",
            "timestamp": "2023-07-24T16:45:30Z",
            "data": {
                "workflow_status": "started",
            },
        }

        mock_client.flows.trigger_with_payload.return_value = mock_response

        process_ecommerce_order()

        # Verify response structure
        assert mock_response["success"] is True
        assert mock_response["analytics_id"] == "wf-exec-67890-fghij-12345"
        assert mock_response["data"]["workflow_status"] == "started"

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_trigger_json.Worqhat')
    def test_payload_structure_validation_customer_data(self, mock_worqhat_class):
        """Test payload structure validation for customer onboarding."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "message": "Workflow triggered successfully",
            "analytics_id": "wf-exec-12345-abcde-67890",
            "timestamp": "2023-07-24T15:30:45Z",
            "data": {"workflow_status": "started"},
        }

        mock_client.flows.trigger_with_payload.return_value = mock_response

        onboard_new_customer()

        # Verify payload structure
        call_args = mock_client.flows.trigger_with_payload.call_args
        payload = call_args[1]["body"]

        assert "name" in payload
        assert "email" in payload
        assert "plan" in payload
        assert "company" in payload
        assert "preferences" in payload
        assert isinstance(payload["preferences"], dict)
        assert "notifications" in payload["preferences"]
        assert "newsletter" in payload["preferences"]
        assert "productUpdates" in payload["preferences"]

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_trigger_json.Worqhat')
    def test_payload_structure_validation_ecommerce_order(self, mock_worqhat_class):
        """Test payload structure validation for e-commerce order."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "message": "Workflow triggered successfully",
            "analytics_id": "wf-exec-67890-fghij-12345",
            "timestamp": "2023-07-24T16:45:30Z",
            "data": {"workflow_status": "started"},
        }

        mock_client.flows.trigger_with_payload.return_value = mock_response

        process_ecommerce_order()

        # Verify payload structure
        call_args = mock_client.flows.trigger_with_payload.call_args
        payload = call_args[1]["body"]

        assert "orderId" in payload
        assert "customer" in payload
        assert "items" in payload
        assert "shipping" in payload
        assert "payment" in payload
        assert isinstance(payload["items"], list)
        assert len(payload["items"]) == 2
        assert "address" in payload["shipping"]
        assert "transactionId" in payload["payment"]

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_trigger_json.Worqhat')
    def test_payload_structure_validation_data_analysis(self, mock_worqhat_class):
        """Test payload structure validation for data analysis."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "message": "Workflow triggered successfully",
            "analytics_id": "wf-exec-99999-xyzab-45678",
            "timestamp": "2023-07-24T17:20:15Z",
            "data": {"workflow_status": "started"},
        }

        mock_client.flows.trigger_with_payload.return_value = mock_response

        trigger_data_analysis()

        # Verify payload structure
        call_args = mock_client.flows.trigger_with_payload.call_args
        payload = call_args[1]["body"]

        assert "datasetId" in payload
        assert "analysisParameters" in payload
        assert "outputFormat" in payload
        assert "notifyEmail" in payload
        assert "timeRange" in payload["analysisParameters"]
        assert "metrics" in payload["analysisParameters"]
        assert "segmentation" in payload["analysisParameters"]
        assert isinstance(payload["analysisParameters"]["metrics"], list)
        assert isinstance(payload["analysisParameters"]["segmentation"], list)

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_trigger_json.Worqhat')
    def test_analytics_id_format_validation(self, mock_worqhat_class):
        """Test analytics ID format validation."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "message": "Workflow triggered successfully",
            "analytics_id": "wf-exec-12345-abcde-67890",
            "timestamp": "2023-07-24T15:30:45Z",
            "data": {"workflow_status": "started"},
        }

        mock_client.flows.trigger_with_payload.return_value = mock_response

        onboard_new_customer()

        # Verify analytics ID format
        import re
        assert re.match(r"^wf-exec-[a-z0-9-]+$", mock_response["analytics_id"])

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_trigger_json.Worqhat')
    def test_timestamp_format_validation(self, mock_worqhat_class):
        """Test timestamp format validation."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "message": "Workflow triggered successfully",
            "analytics_id": "wf-exec-12345-abcde-67890",
            "timestamp": "2023-07-24T15:30:45Z",
            "data": {"workflow_status": "started"},
        }

        mock_client.flows.trigger_with_payload.return_value = mock_response

        onboard_new_customer()

        # Verify timestamp format (ISO 8601)
        import re
        assert re.match(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$", mock_response["timestamp"])

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_trigger_json.Worqhat')
    def test_complex_payload_nested_structures(self, mock_worqhat_class):
        """Test complex payload with nested structures."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "message": "Workflow triggered successfully",
            "analytics_id": "wf-exec-67890-fghij-12345",
            "timestamp": "2023-07-24T16:45:30Z",
            "data": {"workflow_status": "started"},
        }

        mock_client.flows.trigger_with_payload.return_value = mock_response

        process_ecommerce_order()

        # Verify complex nested structures
        call_args = mock_client.flows.trigger_with_payload.call_args
        payload = call_args[1]["body"]

        # Customer nested object
        assert payload["customer"]["id"] == "CUST-789"
        assert payload["customer"]["name"] == "Alex Johnson"
        assert payload["customer"]["email"] == "alex@example.com"

        # Shipping nested object with address
        assert payload["shipping"]["method"] == "express"
        assert payload["shipping"]["address"]["street"] == "123 Main St"
        assert payload["shipping"]["address"]["city"] == "Boston"
        assert payload["shipping"]["address"]["state"] == "MA"
        assert payload["shipping"]["address"]["zip"] == "02108"

        # Items array with objects
        assert payload["items"][0]["productId"] == "PROD-001"
        assert payload["items"][0]["quantity"] == 2
        assert payload["items"][0]["price"] == 29.99
        assert payload["items"][1]["productId"] == "PROD-042"
        assert payload["items"][1]["quantity"] == 1
        assert payload["items"][1]["price"] == 49.99

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_trigger_json.Worqhat')
    def test_complex_payload_analysis_parameters(self, mock_worqhat_class):
        """Test complex payload with analysis parameters."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "message": "Workflow triggered successfully",
            "analytics_id": "wf-exec-99999-xyzab-45678",
            "timestamp": "2023-07-24T17:20:15Z",
            "data": {"workflow_status": "started"},
        }

        mock_client.flows.trigger_with_payload.return_value = mock_response

        trigger_data_analysis()

        # Verify complex analysis parameters
        call_args = mock_client.flows.trigger_with_payload.call_args
        payload = call_args[1]["body"]

        # Time range nested object
        assert payload["analysisParameters"]["timeRange"]["start"] == "2025-01-01"
        assert payload["analysisParameters"]["timeRange"]["end"] == "2025-07-31"

        # Metrics array
        assert payload["analysisParameters"]["metrics"] == [
            "revenue",
            "user_growth",
            "conversion_rate"
        ]

        # Segmentation array
        assert payload["analysisParameters"]["segmentation"] == [
            "region",
            "device_type",
            "user_tier"
        ]

        # Other parameters
        assert payload["analysisParameters"]["comparisonPeriod"] == "previous_quarter"
        assert payload["outputFormat"] == "pdf"
        assert payload["notifyEmail"] == "reports@yourcompany.com"

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_trigger_json.Worqhat')
    def test_workflow_status_validation(self, mock_worqhat_class):
        """Test workflow status validation in response."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "message": "Workflow triggered successfully",
            "analytics_id": "wf-exec-12345-abcde-67890",
            "timestamp": "2023-07-24T15:30:45Z",
            "data": {"workflow_status": "started"},
        }

        mock_client.flows.trigger_with_payload.return_value = mock_response

        onboard_new_customer()

        # Verify workflow status
        assert mock_response["data"]["workflow_status"] == "started"

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_trigger_json.Worqhat')
    def test_trigger_flow_json_runs_all_examples(self, mock_worqhat_class):
        """Test that trigger_flow_json runs all examples."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "message": "Workflow triggered successfully",
            "analytics_id": "wf-exec-test-12345",
            "timestamp": "2023-07-24T15:30:45Z",
            "data": {"workflow_status": "started"},
        }

        mock_client.flows.trigger_with_payload.return_value = mock_response

        trigger_flow_json()

        # Should be called three times - once for each function
        assert mock_client.flows.trigger_with_payload.call_count == 3
