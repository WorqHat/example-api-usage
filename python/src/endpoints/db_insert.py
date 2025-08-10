from ..client import WorqHatClient

def run(table: str, data: dict | list[dict]):
    client = WorqHatClient()
    resp = client.post('/db/insert', json={'table': table, 'data': data})
    print(resp.status_code)
    print(resp.text)

if __name__ == '__main__':
    run('users', {"name": "John"})
