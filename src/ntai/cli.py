import click
from loguru import logger as log

from . import DEVELOPMENT, SERVER_PORT, SERVER_HOST, app


@click.group()
def main():
    pass


@main.command("web")
def cmd_web():
    import uvicorn
    from fastapi.staticfiles import StaticFiles
    from . import SERVE_DIR
    
    if not DEVELOPMENT:
        app.mount("/", StaticFiles(directory=str(SERVE_DIR), html=True), name="web")
        uvicorn.run(app, port=5000)
    else:
        import subprocess
        import pathlib
        import os

        API_HOST = SERVER_HOST
        API_PORT = 50539
        env = os.environ.copy()
        env.update(dict(API_PORT=str(API_PORT), API_HOST=API_HOST, SERVER_PORT=str(SERVER_PORT), SERVER_HOST=SERVER_HOST))

        log.info(f"Starting the API on {SERVER_HOST}:{API_PORT} and proxying it to {SERVER_HOST}:{SERVER_PORT}/api...")
        log.debug(f"{env=}")

        _ = subprocess.Popen(["bun", "run", "dev"], cwd=pathlib.Path(__file__).parents[2] / "web", env=env)
        uvicorn.run("ntai:app", port=API_PORT, host=SERVER_HOST, reload=True, reload_dirs=[pathlib.Path(__file__).parent])


@main.command("tui")
def cmd_tui():
    pass
