import pytest
from unittest.mock import MagicMock, patch
from endpoints.db_insert import create_user, create_product_with_custom_id, create_multiple_products, db_insert


class TestDbInsert:
    """Test suite for db_insert functionality."""

    @patch('endpoints.db_insert.client')
    def test_create_user_success(self, mock_client):
        """Test successful user creation."""
        mock_response = {
            "success": True,
            "data": {
                "documentId": "doc_12345abcde",
                "name": "John Doe",
                "email": "john@example.com",
                "role": "user",
                "active": True,
            },
            "message": "Record inserted successfully",
        }

        mock_client.db.insert_record.return_value = mock_response

        result = create_user()

        # Verify the call was made with correct parameters
        mock_client.db.insert_record.assert_called_once_with(
            table="users",
            data={
                "name": "John Doe",
                "email": "john@example.com",
                "role": "user",
                "active": True,
            }
        )

        assert result == mock_response

    @patch('endpoints.db_insert.client')
    def test_create_product_with_custom_id_success(self, mock_client):
        """Test successful product creation with custom documentId."""
        mock_product_response = {
            "success": True,
            "data": {
                "documentId": "prod_1627384950",
                "name": "Premium Widget",
                "price": 99.99,
                "inStock": True,
                "category": "electronics",
            },
            "message": "Record inserted successfully",
        }

        mock_client.db.insert_record.return_value = mock_product_response

        result = create_product_with_custom_id()

        # Verify the call was made with correct parameters
        call_args = mock_client.db.insert_record.call_args
        assert call_args[1]["table"] == "products"
        assert "documentId" in call_args[1]["data"]
        assert call_args[1]["data"]["documentId"].startswith("prod_")
        assert call_args[1]["data"]["name"] == "Premium Widget"
        assert call_args[1]["data"]["price"] == 99.99
        assert call_args[1]["data"]["inStock"] is True
        assert call_args[1]["data"]["category"] == "electronics"

        assert result == mock_product_response

    @patch('endpoints.db_insert.client')
    def test_create_multiple_products_success(self, mock_client):
        """Test successful bulk insertion of multiple products."""
        mock_bulk_response = {
            "success": True,
            "data": [
                {
                    "documentId": "doc_12345abcde",
                    "name": "Basic Widget",
                    "price": 19.99,
                    "inStock": True,
                    "category": "essentials",
                },
                {
                    "documentId": "doc_67890fghij",
                    "name": "Standard Widget",
                    "price": 49.99,
                    "inStock": True,
                    "category": "essentials",
                },
                {
                    "documentId": "doc_54321klmno",
                    "name": "Premium Widget",
                    "price": 99.99,
                    "inStock": False,
                    "category": "premium",
                },
            ],
            "message": "3 records inserted successfully",
        }

        mock_client.db.insert_record.return_value = mock_bulk_response

        result = create_multiple_products()

        # Verify the call was made with correct parameters
        call_args = mock_client.db.insert_record.call_args
        assert call_args[1]["table"] == "products"

        bulk_data = call_args[1]["data"]
        assert isinstance(bulk_data, list)
        assert len(bulk_data) == 3

        # Verify each product in bulk data
        assert bulk_data[0]["name"] == "Basic Widget"
        assert bulk_data[0]["price"] == 19.99
        assert bulk_data[0]["inStock"] is True
        assert bulk_data[0]["category"] == "essentials"

        assert bulk_data[1]["name"] == "Standard Widget"
        assert bulk_data[1]["price"] == 49.99
        assert bulk_data[1]["inStock"] is True
        assert bulk_data[1]["category"] == "essentials"

        assert bulk_data[2]["name"] == "Premium Widget"
        assert bulk_data[2]["price"] == 99.99
        assert bulk_data[2]["inStock"] is False
        assert bulk_data[2]["category"] == "premium"

        assert result == mock_bulk_response
        assert len(result["data"]) == 3

    @patch('endpoints.db_insert.client')
    def test_create_user_api_error_handling(self, mock_client):
        """Test handling of API errors in create_user."""
        mock_client.db.insert_record.side_effect = Exception("API Error: Invalid API key")

        with pytest.raises(Exception, match="API Error: Invalid API key"):
            create_user()

    @patch('endpoints.db_insert.client')
    def test_create_product_network_error_handling(self, mock_client):
        """Test handling of network errors in create_product_with_custom_id."""
        mock_client.db.insert_record.side_effect = Exception("Network Error: Connection timeout")

        with pytest.raises(Exception, match="Network Error: Connection timeout"):
            create_product_with_custom_id()

    @patch('endpoints.db_insert.client')
    def test_create_multiple_products_table_not_found_error(self, mock_client):
        """Test handling of table not found errors in create_multiple_products."""
        mock_client.db.insert_record.side_effect = Exception("Table not found")

        with pytest.raises(Exception, match="Table not found"):
            create_multiple_products()

    @patch('endpoints.db_insert.client')
    def test_create_user_duplicate_document_id_error(self, mock_client):
        """Test handling of duplicate documentId errors in create_user."""
        mock_client.db.insert_record.side_effect = Exception("Duplicate documentId")

        with pytest.raises(Exception, match="Duplicate documentId"):
            create_user()

    @patch('endpoints.db_insert.client')
    def test_custom_id_generation_uniqueness(self, mock_client):
        """Test that custom IDs are generated uniquely."""
        mock_response = {
            "success": True,
            "data": {
                "documentId": "prod_1627384950",
                "name": "Premium Widget",
                "price": 99.99,
                "inStock": True,
                "category": "electronics",
            },
            "message": "Record inserted successfully",
        }

        mock_client.db.insert_record.return_value = mock_response

        # Call create_product_with_custom_id twice to verify unique IDs
        create_product_with_custom_id()
        create_product_with_custom_id()

        # Get all calls for product inserts
        product_calls = [
            call for call in mock_client.db.insert_record.call_args_list
            if call[1]["table"] == "products" and "documentId" in call[1]["data"]
        ]

        # Should have at least 2 calls
        assert len(product_calls) >= 2

        # Extract documentIds
        document_ids = [call[1]["data"]["documentId"] for call in product_calls]

        # All IDs should be unique
        assert len(set(document_ids)) == len(document_ids)

        # All IDs should start with "prod_"
        assert all(doc_id.startswith("prod_") for doc_id in document_ids)

    @patch('endpoints.db_insert.client')
    def test_data_structure_validation(self, mock_client):
        """Test that returned data has correct structure."""
        mock_single_response = {
            "success": True,
            "data": {
                "documentId": "doc_12345abcde",
                "name": "John Doe",
                "email": "john@example.com",
                "role": "user",
                "active": True,
            },
            "message": "Record inserted successfully",
        }

        mock_product_response = {
            "success": True,
            "data": {
                "documentId": "prod_1627384950",
                "name": "Premium Widget",
                "price": 99.99,
                "inStock": True,
                "category": "electronics",
            },
            "message": "Record inserted successfully",
        }

        mock_bulk_response = {
            "success": True,
            "data": [
                {
                    "documentId": "doc_12345abcde",
                    "name": "Basic Widget",
                    "price": 19.99,
                    "inStock": True,
                    "category": "essentials",
                },
            ],
            "message": "1 record inserted successfully",
        }

        mock_client.db.insert_record.side_effect = [
            mock_single_response,
            mock_product_response,
            mock_bulk_response
        ]

        # Test create_user
        user_result = create_user()
        assert "documentId" in user_result["data"]
        assert "name" in user_result["data"]
        assert "email" in user_result["data"]
        assert "role" in user_result["data"]
        assert "active" in user_result["data"]

        # Test create_product_with_custom_id
        product_result = create_product_with_custom_id()
        assert "documentId" in product_result["data"]
        assert "name" in product_result["data"]
        assert "price" in product_result["data"]
        assert "inStock" in product_result["data"]
        assert "category" in product_result["data"]

        # Test create_multiple_products
        bulk_result = create_multiple_products()
        assert isinstance(bulk_result["data"], list)
        assert len(bulk_result["data"]) > 0
        for item in bulk_result["data"]:
            assert "documentId" in item
            assert "name" in item
            assert "price" in item
            assert "inStock" in item
            assert "category" in item

    @patch('endpoints.db_insert.client')
    def test_bulk_insert_partial_failure_simulation(self, mock_client):
        """Test simulation of partial bulk insert failures."""
        # This would test if partial failures in bulk operations are handled
        # Since the API might not support partial failures, this tests the current behavior
        mock_bulk_response = {
            "success": False,  # Simulate bulk insert failure
            "data": [],
            "message": "Bulk insert failed: some records could not be inserted",
        }

        mock_client.db.insert_record.return_value = mock_bulk_response

        result = create_multiple_products()

        # Verify that bulk operation failed
        assert result["success"] is False
        assert len(result["data"]) == 0
