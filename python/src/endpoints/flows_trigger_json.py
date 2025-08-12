from typing import Any, Dict
from ..client import client


def trigger_flow_json() -> Dict[str, Any]:
    """Trigger a workflow using a JSON payload (mirrors TS example)."""
    workflow_id = "a4a0053f-adec-4a3d-abf6-87ccac03b391"
    data = {"input1": "value1", "input2": "value2"}
    return client.flows.trigger_with_payload(workflow_id, {"body": data})

