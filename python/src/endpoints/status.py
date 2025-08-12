from ..client import client


def check_status():
    """Fetch WorqHat server info."""
    return client.get_server_info()

