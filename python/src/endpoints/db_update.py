from typing import Any, Dict
from ..client import client


def db_update() -> Dict[str, Any]:
    """Update records (mirrors TS example)."""
    table = "users"
    where = {"id": "123", "email": "user@example.com"}
    data = {"status": "active", "name": "Updated Name"}
    return client.db.update_records(table=table, where=where, data=data)

