from typing import Any, Dict, List
from ..client import client


def db_insert() -> Dict[str, Any]:
    """Insert single and bulk records (mirrors TS example)."""
    table = "customer_management_data"
    single_data: Dict[str, Any] = {
        "customer_name": "Alice Johnson",
        "customer_email": "alice@example.com",
        "customer_phone_number": "+91-9876543210",
        "customer_address": "123 MG Road, Pune",
        "customer_type": "individual",
    }
    single_resp = client.db.insert_record(table=table, data=single_data)

    bulk_data: List[Dict[str, Any]] = [
        {
            "customer_name": "Bob Smith",
            "customer_email": "bob@example.com",
            "customer_phone_number": "+91-9000000001",
            "customer_address": "456 Brigade Road, Bengaluru",
            "customer_type": "business",
        },
        {
            "customer_name": "Carol Lee",
            "customer_email": "carol@example.com",
            "customer_phone_number": "+91-9000000002",
            "customer_address": "789 Park Street, Kolkata",
            "customer_type": "individual",
        },
    ]
    bulk_resp = client.db.insert_record(table=table, data=bulk_data)

    return {"single": single_resp, "bulk": bulk_resp}

