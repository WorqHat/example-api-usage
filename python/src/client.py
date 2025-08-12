import os
from dotenv import load_dotenv
from typing import Optional

try:
    from worqhat import Worqhat
except ImportError as e:
    raise RuntimeError("The 'worqhat' package is required. Install with `pip install worqhat`.") from e

load_dotenv()
WORQHAT_API_KEY: Optional[str] = os.environ.get("WORQHAT_API_KEY", "")

# Export a singleton Worqhat client used across the app
client = Worqhat(api_key=WORQHAT_API_KEY)


