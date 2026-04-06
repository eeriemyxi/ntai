from importlib.metadata import metadata
from importlib.resources import files

PACKAGE_NAME = metadata(__package__ or "")["Name"]
SERVE_DIR = files(f"{PACKAGE_NAME}.data") / "serve"
