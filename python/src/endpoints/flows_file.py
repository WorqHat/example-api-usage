from pathlib import Path
from typing import Any, Dict
from ..client import client


def trigger_flow_with_file() -> Dict[str, Any]:
    """Trigger a workflow with a local file upload (mirrors TS example)."""
    workflow_id = "e3f35867-77f4-4c49-b376-ac0f0cedb423"
    image_path = Path(__file__).parent.parent / "image.png"
    with open(image_path, "rb") as f:
        return client.flows.trigger_with_file(
            workflow_id,
            {"file": f, "input1": "value1", "input2": "value2"},
        )


def trigger_flow_with_url() -> Dict[str, Any]:
    """Trigger a workflow with a remote file URL (mirrors TS example)."""
    workflow_id = "e3f35867-77f4-4c49-b376-ac0f0cedb423"
    url = "https://assets.worqhat.com/worqkitties/kitty-hi.png"
    return client.flows.trigger_with_file(
        workflow_id,
        {"url": url, "input1": "value1", "input2": "value2"},
    )

