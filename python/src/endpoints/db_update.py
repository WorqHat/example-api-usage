from ..client import WorqHatClient

def run(table: str, where: dict, data: dict):
    client = WorqHatClient()
    resp = client.put('/db/update', json={'table': table, 'where': where, 'data': data})
    print(resp.status_code)
    print(resp.text)

if __name__ == '__main__':
    run('users', {"id": "123"}, {"status": "active"})
