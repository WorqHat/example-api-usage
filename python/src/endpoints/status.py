# Placeholder script for GET /
from ..client import WorqHatClient

def run():
    client = WorqHatClient()
    resp = client.get('/')
    print(resp.status_code)
    print(resp.text)

if __name__ == '__main__':
    run()
