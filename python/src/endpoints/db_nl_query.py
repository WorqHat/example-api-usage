from ..client import WorqHatClient

def run(question: str, table: str):
    client = WorqHatClient()
    resp = client.post('/db/nl-query', json={'question': question, 'table': table})
    print(resp.status_code)
    print(resp.text)

if __name__ == '__main__':
    run('How many active users?', 'users')
