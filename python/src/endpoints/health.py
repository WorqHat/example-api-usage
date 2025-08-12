from ..client import client


def check_health():
    """Call WorqHat health endpoint."""
    return client.health.check()

