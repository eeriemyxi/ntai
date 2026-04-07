import sys

import click
from loguru import logger as log

from .server import app


@click.group()
@click.option(
    "--log-level",
    "-L",
    type=click.Choice(
        ["TRACE", "DEBUG", "INFO", "SUCCESS", "WARNING", "CRITICAL", "ERROR"]
    ),
    default="INFO",
)
@click.version_option(None, "--version", "-v", "-V", package_name="myxi-ntai")
def main(log_level: str) -> None:
    log.remove()
    _ = log.add(sys.stderr, level=log_level)



@click.option(
    "--host",
    help="The hostname the web app will bind to.",
    envvar="HOST",
    default="0.0.0.0",
)
@click.option(
    "--port",
    help="The port the web app will bind to.",
    envvar="PORT",
    default=5000,
)
@click.option(
    "-o",
    "--open",
    "flag_open",
    help="Open the web app on your browser automatically.",
    is_flag=True,
    default=True,
)
@click.option(
    "--dev-mode",
    help="Starts the servers in development mode.",
    envvar="DEVELOPMENT",
    is_flag=True,
    hidden=True,
    default=False,
)
@main.command("web")
def cmd_web(host: str, port: int, dev_mode: bool, flag_open: bool) -> None:
    import uvicorn
    from fastapi.staticfiles import StaticFiles

    if flag_open:
        import threading
        import webbrowser

        threading.Timer(
            0.3, webbrowser.open_new_tab, args=(f"http://{host}:{port}/",)
        ).start()

    from . import SERVE_DIR

    if not dev_mode:
        app.mount("/", StaticFiles(directory=str(SERVE_DIR), html=True), name="web")
        uvicorn.run(app, host=host, port=port)
    else:
        import os
        import pathlib
        import subprocess

        API_HOST = host
        API_PORT = 50539
        env = os.environ.copy()
        env.update(
            dict(
                API_PORT=str(API_PORT),
                API_HOST=API_HOST,
                SERVER_PORT=str(port),
                SERVER_HOST=host,
            )
        )

        log.info(
            f"Serving the backend API on {host}:{API_PORT} and proxying it to {host}:{port}/api..."
        )
        log.debug(f"{env=}")

        _ = subprocess.Popen(
            ["bun", "run", "dev"],
            cwd=pathlib.Path(__file__).parents[2] / "web",
            env=env,
        )
        uvicorn.run(
            "ntai:server.app",
            port=API_PORT,
            host=host,
            reload=True,
            reload_dirs=[str(pathlib.Path(__file__).parent)],
        )


@main.command("tui")
def cmd_tui() -> None:
    click.echo("The TUI client is yet to be implemented.")
