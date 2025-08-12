from typing import Any, Dict
from ..client import client


def db_delete() -> Dict[str, Any]:
    """Delete records (mirrors TS example)."""
    table = "users"
    where = {"id": "123", "email": "user@example.com"}
    return client.db.delete_records(table=table, where=where)

