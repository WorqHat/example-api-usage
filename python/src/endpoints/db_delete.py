from ..client import WorqHatClient

def run(table: str, where: dict):
    client = WorqHatClient()
    resp = client.delete('/db/delete', json={'table': table, 'where': where})
    print(resp.status_code)
    print(resp.text)

if __name__ == '__main__':
    run('users', {"id": "123"})
