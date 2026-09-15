import sys
import os

# Add backend to sys.path for Vercel serverless environment
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app

# Export app for Vercel WSGI / ASGI handler
handler = app
