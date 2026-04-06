from importlib.resources import files

PACKAGE_NAME = "ntai"
SERVE_DIR = files(f"{PACKAGE_NAME}.data") / "serve"
