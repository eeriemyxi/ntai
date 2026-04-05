import ast
import os
from importlib.metadata import metadata
from importlib.resources import files

PACKAGE_NAME = metadata(__package__ or "")["Name"]
SERVE_DIR = files(f"{PACKAGE_NAME}.data") / "serve"
DEVELOPMENT = bool(ast.literal_eval(os.environ.get("DEVELOPMENT", "False")))
SERVER_HOST = str(ast.literal_eval(os.environ.get("SERVER_HOST", "'0.0.0.0'")))
SERVER_PORT = int(ast.literal_eval(os.environ.get("SERVER_PORT", "5000")))

from .server import app

__all__ = ("app",)
