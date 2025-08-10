from ..client import WorqHatClient

# Use one of these helpers depending on input type

def run_file(flow_id: str, file_path: str, metadata: dict | None = None):
    client = WorqHatClient()
    with open(file_path, 'rb') as f:
        files = {'file': (file_path.split('/')[-1], f)}
        data = {'metadata': metadata} if metadata else None
        resp = client.post(f'/flows/file/{flow_id}', files=files, data=data)
        print(resp.status_code)
        print(resp.text)

def run_url(flow_id: str, url: str, metadata: dict | None = None):
    client = WorqHatClient()
    data = {'url': url}
    if metadata:
        data['metadata'] = metadata
    resp = client.post(f'/flows/file/{flow_id}', data=data)
    print(resp.status_code)
    print(resp.text)

if __name__ == '__main__':
    run_url('your-flow-id', 'https://example.com/file.pdf')
