"""
HeartGuard AI — Production Entrypoint for Hosting Services (Render / Cloud).
Exposes the FastAPI application at the repository root so both:
  uvicorn main:app --host 0.0.0.0 --port $PORT
and
  uvicorn backend.main:app --host 0.0.0.0 --port $PORT
work cleanly without module path errors.
"""

import os
import sys
from pathlib import Path

# Ensure repository root is on sys.path
ROOT_DIR = Path(__file__).resolve().parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.main import app

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
