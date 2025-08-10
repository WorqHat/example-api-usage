from ..client import WorqHatClient

def run(flow_id: str, body: dict | None = None):
    client = WorqHatClient()
    resp = client.post(f'/flows/trigger/{flow_id}', json=body or {})
    print(resp.status_code)
    print(resp.text)

if __name__ == '__main__':
    run('your-flow-id')
