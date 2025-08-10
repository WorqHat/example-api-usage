import os
from typing import Dict, Any
import requests
from dotenv import load_dotenv

load_dotenv()

API_URL = os.getenv('API_URL', 'http://localhost:3000')
API_KEY = os.getenv('API_KEY', '')

def _headers() -> Dict[str, str]:
    headers = {'Content-Type': 'application/json'}
    if API_KEY:
        headers['Authorization'] = f'Bearer {API_KEY}'
    return headers

class WorqHatClient:
    def __init__(self, base_url: str | None = None, api_key: str | None = None):
        self.base_url = base_url or API_URL
        self.api_key = api_key or API_KEY
        self.session = requests.Session()
        if self.api_key:
            self.session.headers.update({'Authorization': f'Bearer {self.api_key}'})

    def get(self, path: str, **kwargs) -> requests.Response:
        return self.session.get(f"{self.base_url}{path}", **kwargs)

    def post(self, path: str, json: Any | None = None, files: Any | None = None, data: Any | None = None, **kwargs) -> requests.Response:
        return self.session.post(f"{self.base_url}{path}", json=json, files=files, data=data, **kwargs)

    def put(self, path: str, json: Any | None = None, **kwargs) -> requests.Response:
        return self.session.put(f"{self.base_url}{path}", json=json, **kwargs)

    def delete(self, path: str, json: Any | None = None, **kwargs) -> requests.Response:
        return self.session.delete(f"{self.base_url}{path}", json=json, **kwargs)

