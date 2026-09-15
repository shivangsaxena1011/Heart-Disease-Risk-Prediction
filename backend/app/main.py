"""
Compatibility module for Render deployments configured with 'backend.app.main:app'.
Ensures proper sys.path resolution and exports the FastAPI application.
"""

import sys
from pathlib import Path

# Ensure project root is in sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.main import app

__all__ = ["app"]
