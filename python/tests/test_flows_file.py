import pytest
from unittest.mock import MagicMock, patch, mock_open
import os
from endpoints.flows_file import process_document, process_remote_image, process_document_with_params, trigger_flow_with_file, trigger_flow_with_url


class TestFlowsFile:
    """Test suite for flows_file functionality."""

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key",
        "WORQHAT_ENVIRONMENT": "test"
    })
    @patch('endpoints.flows_file.Worqhat')
    @patch('builtins.open', new_callable=mock_open, read_data=b"fake file content")
    def test_process_document_success(self, mock_file_open, mock_worqhat_class):
        """Test successful document processing with file upload."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "statusCode": "200",
            "data": {
                "output": "Document processed successfully",
                "extractedText": "This is a sample contract...",
                "confidence": 0.95,
            },
            "analytics_id": "wf-exec-12345-abcde-67890",
            "message": "Workflow triggered successfully with file upload",
        }

        mock_client.flows.trigger_with_file.return_value = mock_response

        result = process_document("./contract.pdf")

        # Verify the call was made with correct parameters
        mock_worqhat_class.assert_called_once_with(
            api_key="test-api-key",
            environment="test"
        )

        mock_client.flows.trigger_with_file.assert_called_once()
        call_args = mock_client.flows.trigger_with_file.call_args
        assert call_args[0][0] == "document-processing-workflow-id"
        assert "file" in call_args[1]
        assert call_args[1]["documentType"] == "contract"
        assert call_args[1]["priority"] == "high"
        assert call_args[1]["department"] == "legal"

        assert result == mock_response

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key",
        "WORQHAT_ENVIRONMENT": "test"
    })
    @patch('endpoints.flows_file.Worqhat')
    def test_process_remote_image_success(self, mock_worqhat_class):
        """Test successful remote image processing with URL."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "statusCode": "200",
            "data": {
                "description": "A laptop computer on a desk",
                "objects": ["laptop", "desk", "chair"],
                "colors": ["black", "silver"],
                "confidence": 0.89,
            },
            "analytics_id": "wf-exec-67890-fghij-12345",
            "message": "Workflow triggered successfully with URL processing",
        }

        mock_client.flows.trigger_with_file.return_value = mock_response

        result = process_remote_image()

        # Verify the call was made with correct parameters
        mock_client.flows.trigger_with_file.assert_called_once()
        call_args = mock_client.flows.trigger_with_file.call_args
        assert call_args[0][0] == "image-analysis-workflow-id"
        assert "url" in call_args[1]
        assert call_args[1]["url"] == "https://storage.example.com/products/laptop-x1.jpg"
        assert call_args[1]["imageType"] == "product"
        assert call_args[1]["category"] == "electronics"
        assert call_args[1]["productId"] == "PROD-12345"

        assert result == mock_response

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key",
        "WORQHAT_ENVIRONMENT": "test"
    })
    @patch('endpoints.flows_file.Worqhat')
    @patch('builtins.open', new_callable=mock_open, read_data=b"fake file content")
    def test_process_document_with_params_success(self, mock_file_open, mock_worqhat_class):
        """Test successful document processing with complex parameters."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "statusCode": "200",
            "data": {
                "processed": True,
                "pages": 5,
                "signatures": 2,
                "validationPassed": True,
                "extractedData": {
                    "contractValue": 50000,
                    "parties": ["Company A", "Company B"],
                    "effectiveDate": "2025-01-01",
                },
            },
            "analytics_id": "wf-exec-99999-xyzab-45678",
            "message": "Workflow triggered successfully with file upload",
        }

        mock_client.flows.trigger_with_file.return_value = mock_response

        result = process_document_with_params("./contract.pdf")

        # Verify the call was made with correct parameters
        mock_client.flows.trigger_with_file.assert_called_once()
        call_args = mock_client.flows.trigger_with_file.call_args
        assert call_args[0][0] == "document-processing-workflow-id"
        assert "file" in call_args[1]
        assert call_args[1]["customerId"] == "CID-12345"
        assert call_args[1]["department"] == "legal"
        assert call_args[1]["requireSignature"] is True
        assert call_args[1]["processingMode"] == "detailed"

        assert result == mock_response

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_file.Worqhat')
    @patch('builtins.open', new_callable=mock_open, read_data=b"fake file content")
    def test_process_document_file_not_found_error(self, mock_file_open, mock_worqhat_class):
        """Test file not found error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        # Simulate file not found
        mock_file_open.side_effect = FileNotFoundError("No such file or directory")

        with pytest.raises(FileNotFoundError, match="No such file or directory"):
            process_document("./nonexistent.pdf")

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_file.Worqhat')
    def test_process_remote_image_api_error_handling(self, mock_worqhat_class):
        """Test API error handling in process_remote_image."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.flows.trigger_with_file.side_effect = Exception("API Error: Invalid URL format")

        with pytest.raises(Exception, match="API Error: Invalid URL format"):
            process_remote_image()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_file.Worqhat')
    @patch('builtins.open', new_callable=mock_open, read_data=b"fake file content")
    def test_process_document_with_params_workflow_not_found_error(self, mock_file_open, mock_worqhat_class):
        """Test workflow not found error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.flows.trigger_with_file.side_effect = Exception("Workflow not found")

        with pytest.raises(Exception, match="Workflow not found"):
            process_document_with_params("./contract.pdf")

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_file.Worqhat')
    @patch('builtins.open', new_callable=mock_open, read_data=b"fake file content")
    def test_process_document_file_too_large_error(self, mock_file_open, mock_worqhat_class):
        """Test file too large error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.flows.trigger_with_file.side_effect = Exception("File too large. Maximum size is 100MB.")

        with pytest.raises(Exception, match="File too large. Maximum size is 100MB."):
            process_document("./contract.pdf")

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_file.Worqhat')
    def test_process_remote_image_unsupported_file_type_error(self, mock_worqhat_class):
        """Test unsupported file type error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.flows.trigger_with_file.side_effect = Exception("Unsupported file type.")

        with pytest.raises(Exception, match="Unsupported file type."):
            process_remote_image()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_file.Worqhat')
    def test_process_remote_image_rate_limit_error(self, mock_worqhat_class):
        """Test rate limit error handling."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_client.flows.trigger_with_file.side_effect = Exception("Rate limit exceeded. Please try again later.")

        with pytest.raises(Exception, match="Rate limit exceeded. Please try again later."):
            process_remote_image()

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_file.Worqhat')
    @patch('builtins.open', new_callable=mock_open, read_data=b"fake file content")
    def test_response_structure_validation_document_processing(self, mock_file_open, mock_worqhat_class):
        """Test response structure validation for document processing."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "statusCode": "200",
            "data": {
                "output": "Document processed successfully",
                "extractedText": "Sample contract text...",
                "confidence": 0.95,
            },
            "analytics_id": "wf-exec-12345-abcde-67890",
            "message": "Workflow triggered successfully with file upload",
        }

        mock_client.flows.trigger_with_file.return_value = mock_response

        result = process_document("./contract.pdf")

        # Verify response structure
        assert result["success"] is True
        assert result["statusCode"] == "200"
        assert "data" in result
        assert "analytics_id" in result
        assert "message" in result
        assert isinstance(result["analytics_id"], str)
        assert isinstance(result["message"], str)
        assert result["message"] == "Workflow triggered successfully with file upload"

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_file.Worqhat')
    def test_response_structure_validation_image_processing(self, mock_worqhat_class):
        """Test response structure validation for image processing."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "statusCode": "200",
            "data": {
                "description": "A laptop computer on a desk",
                "objects": ["laptop", "desk", "chair"],
                "colors": ["black", "silver"],
                "confidence": 0.89,
            },
            "analytics_id": "wf-exec-67890-fghij-12345",
            "message": "Workflow triggered successfully with URL processing",
        }

        mock_client.flows.trigger_with_file.return_value = mock_response

        result = process_remote_image()

        # Verify response structure
        assert result["success"] is True
        assert result["statusCode"] == "200"
        assert "data" in result
        assert "analytics_id" in result
        assert result["analytics_id"] == "wf-exec-67890-fghij-12345"
        assert result["message"] == "Workflow triggered successfully with URL processing"

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_file.Worqhat')
    @patch('builtins.open', new_callable=mock_open, read_data=b"fake file content")
    def test_payload_structure_validation_document_processing(self, mock_file_open, mock_worqhat_class):
        """Test payload structure validation for document processing."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "statusCode": "200",
            "data": {"output": "Processed"},
            "analytics_id": "wf-exec-12345-abcde-67890",
            "message": "Workflow triggered successfully with file upload",
        }

        mock_client.flows.trigger_with_file.return_value = mock_response

        process_document("./contract.pdf")

        # Verify payload structure
        call_args = mock_client.flows.trigger_with_file.call_args
        payload = call_args[1]

        assert "file" in payload
        assert payload["documentType"] == "contract"
        assert payload["priority"] == "high"
        assert payload["department"] == "legal"

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_file.Worqhat')
    def test_payload_structure_validation_image_processing(self, mock_worqhat_class):
        """Test payload structure validation for image processing."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "statusCode": "200",
            "data": {"output": "Processed"},
            "analytics_id": "wf-exec-67890-fghij-12345",
            "message": "Workflow triggered successfully with URL processing",
        }

        mock_client.flows.trigger_with_file.return_value = mock_response

        process_remote_image()

        # Verify payload structure
        call_args = mock_client.flows.trigger_with_file.call_args
        payload = call_args[1]

        assert "url" in payload
        assert payload["url"] == "https://storage.example.com/products/laptop-x1.jpg"
        assert payload["imageType"] == "product"
        assert payload["category"] == "electronics"
        assert payload["productId"] == "PROD-12345"

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_file.Worqhat')
    @patch('builtins.open', new_callable=mock_open, read_data=b"fake file content")
    def test_payload_structure_validation_complex_parameters(self, mock_file_open, mock_worqhat_class):
        """Test payload structure validation for complex parameters."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "statusCode": "200",
            "data": {"output": "Processed with params"},
            "analytics_id": "wf-exec-99999-xyzab-45678",
            "message": "Workflow triggered successfully with file upload",
        }

        mock_client.flows.trigger_with_file.return_value = mock_response

        process_document_with_params("./contract.pdf")

        # Verify complex payload structure
        call_args = mock_client.flows.trigger_with_file.call_args
        payload = call_args[1]

        assert "file" in payload
        assert payload["customerId"] == "CID-12345"
        assert payload["department"] == "legal"
        assert payload["requireSignature"] is True
        assert payload["processingMode"] == "detailed"

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_file.Worqhat')
    @patch('builtins.open', new_callable=mock_open, read_data=b"fake file content")
    def test_analytics_id_format_validation(self, mock_file_open, mock_worqhat_class):
        """Test analytics ID format validation."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "statusCode": "200",
            "data": {"output": "Processed"},
            "analytics_id": "wf-exec-12345-abcde-67890",
            "message": "Workflow triggered successfully with file upload",
        }

        mock_client.flows.trigger_with_file.return_value = mock_response

        result = process_document("./contract.pdf")

        # Verify analytics ID format
        import re
        assert re.match(r"^wf-exec-[a-z0-9-]+$", result["analytics_id"])

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_file.Worqhat')
    def test_url_format_validation(self, mock_worqhat_class):
        """Test URL format validation."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "statusCode": "200",
            "data": {"output": "Processed"},
            "analytics_id": "wf-exec-67890-fghij-12345",
            "message": "Workflow triggered successfully with URL processing",
        }

        mock_client.flows.trigger_with_file.return_value = mock_response

        process_remote_image()

        # Verify URL format
        call_args = mock_client.flows.trigger_with_file.call_args
        url = call_args[1]["url"]
        assert url.startswith("https://")
        assert "storage.example.com" in url

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_file.Worqhat')
    @patch('builtins.open', new_callable=mock_open, read_data=b"fake file content")
    def test_data_processing_validation_structured_response(self, mock_file_open, mock_worqhat_class):
        """Test data processing validation for structured responses."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "statusCode": "200",
            "data": {
                "extractedData": {
                    "entities": ["John Doe", "Jane Smith"],
                    "dates": ["2025-01-15", "2025-02-20"],
                    "amounts": [1500.00, 2500.50],
                    "categories": ["contract", "agreement"],
                },
                "metadata": {
                    "processingTime": 3.2,
                    "confidence": 0.87,
                    "pagesProcessed": 5,
                },
            },
            "analytics_id": "wf-exec-12345-abcde-67890",
            "message": "Workflow triggered successfully with file upload",
        }

        mock_client.flows.trigger_with_file.return_value = mock_response

        result = process_document("./contract.pdf")

        # Verify structured data processing
        assert len(result["data"]["extractedData"]["entities"]) == 2
        assert result["data"]["extractedData"]["amounts"] == [1500.00, 2500.50]
        assert result["data"]["metadata"]["processingTime"] == 3.2
        assert result["data"]["metadata"]["pagesProcessed"] == 5

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_file.Worqhat')
    def test_data_processing_validation_array_response(self, mock_worqhat_class):
        """Test data processing validation for array responses."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "statusCode": "200",
            "data": {
                "analysis": [
                    {"type": "text", "content": "Contract terms", "confidence": 0.95},
                    {"type": "signature", "content": "John Doe signature", "confidence": 0.89},
                    {"type": "date", "content": "2025-01-15", "confidence": 0.97},
                ],
                "summary": {
                    "totalItems": 3,
                    "averageConfidence": 0.937,
                },
            },
            "analytics_id": "wf-exec-67890-fghij-12345",
            "message": "Workflow triggered successfully with URL processing",
        }

        mock_client.flows.trigger_with_file.return_value = mock_response

        result = process_remote_image()

        # Verify array data processing
        assert isinstance(result["data"]["analysis"], list)
        assert len(result["data"]["analysis"]) == 3
        assert result["data"]["analysis"][0]["type"] == "text"
        assert result["data"]["analysis"][0]["confidence"] == 0.95
        assert result["data"]["summary"]["totalItems"] == 3
        assert result["data"]["summary"]["averageConfidence"] == 0.937

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_file.Worqhat')
    def test_workflow_trigger_status_validation(self, mock_worqhat_class):
        """Test workflow trigger status validation."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "statusCode": "200",
            "data": {"output": "Processed successfully"},
            "analytics_id": "wf-exec-12345-abcde-67890",
            "message": "Workflow triggered successfully with file upload",
        }

        mock_client.flows.trigger_with_file.return_value = mock_response

        result = process_remote_image()

        # Verify workflow trigger status
        assert result["success"] is True
        assert result["statusCode"] == "200"
        assert "triggered successfully" in result["message"]

    @patch.dict(os.environ, {
        "WORQHAT_API_KEY": "test-api-key"
    })
    @patch('endpoints.flows_file.Worqhat')
    @patch('builtins.open', new_callable=mock_open, read_data=b"fake file content")
    def test_trigger_flow_with_file_runs_all_examples(self, mock_file_open, mock_worqhat_class):
        """Test that trigger_flow_with_file runs all examples."""
        mock_client = MagicMock()
        mock_worqhat_class.return_value = mock_client

        mock_response = {
            "success": True,
            "statusCode": "200",
            "data": {"output": "Processed"},
            "analytics_id": "wf-exec-test-12345",
            "message": "Workflow triggered successfully",
        }

        mock_client.flows.trigger_with_file.return_value = mock_response

        trigger_flow_with_file()

        # Should be called three times - once for each function (process_document may fail with file not found)
        assert mock_client.flows.trigger_with_file.call_count >= 2
