from ..client import WorqHatClient

def run():
    client = WorqHatClient()
    resp = client.get('/health')
    print(resp.status_code)
    print(resp.text)

if __name__ == '__main__':
    run()
