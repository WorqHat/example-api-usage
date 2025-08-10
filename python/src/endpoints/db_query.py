from ..client import WorqHatClient

def run(sql: str, limit: int | None = None, offset: int | None = None):
    client = WorqHatClient()
    params = {}
    if limit is not None:
        params['limit'] = limit
    if offset is not None:
        params['offset'] = offset
    resp = client.post('/db/query', json={'query': sql}, params=params)
    print(resp.status_code)
    print(resp.text)

if __name__ == '__main__':
    run("SELECT 1")
