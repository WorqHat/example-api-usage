from ..client import client


def db_query(query: str, limit: int | None = None, offset: int | None = None):
    """Execute a SQL query via WorqHat DB API."""
    # Note: SDK currently does not document limit/offset params on execute_query; using base example.
    return client.db.execute_query(query=query)

