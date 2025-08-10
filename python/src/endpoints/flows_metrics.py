from ..client import WorqHatClient

def run(start_date: str | None = None, end_date: str | None = None, status: str | None = None):
    client = WorqHatClient()
    params = {}
    if start_date: params['start_date'] = start_date
    if end_date: params['end_date'] = end_date
    if status: params['status'] = status
    resp = client.get('/flows/metrics', params=params)
    print(resp.status_code)
    print(resp.text)

if __name__ == '__main__':
    run()
