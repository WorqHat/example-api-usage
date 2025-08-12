from typing import Any, Dict
from ..client import client


def db_nl_query() -> Dict[str, Any]:
    """Ask an NL question on a table (mirrors TS example)."""
    question = "How many rows are in my_table?"
    table = "customer_management_data"
    return client.db.process_nl_query(question=question, table=table)


if __name__ == '__main__':
    print(db_nl_query())
