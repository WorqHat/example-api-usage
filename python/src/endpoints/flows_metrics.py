from typing import Any, Dict
from ..client import client


def get_flows_metrics() -> Dict[str, Any]:
    """Fetch flows metrics (mirrors TS example)."""
    params: Dict[str, Any] = {
        "start_date": "2025-08-01",
        "end_date": "2025-08-31",
        "status": "completed",
    }
    return client.flows.get_metrics(params)

