import subprocess
import typing as t
from pathlib import Path

from hatchling.builders.hooks.plugin.interface import BuildHookInterface

HERE = Path(__file__).parent.resolve()
WEB_DIR = HERE / "../web"
SERVE_DIR = HERE / "../src/ntai/data/serve"
BUN_PATH = "bun"


class ProcessDataHook(BuildHookInterface[t.Any]):
    @t.override
    def initialize(self, version: str, build_data: dict[str, t.Any]) -> None:
        _ = subprocess.run([BUN_PATH, "install"], cwd=WEB_DIR, check=True)
        _ = subprocess.run(
            [
                BUN_PATH,
                "run",
                "build",
                "--outDir",
                str(SERVE_DIR.resolve()),
                "--emptyOutDir",
            ],
            cwd=WEB_DIR,
            check=True,
        )

        if self.target_name == "sdist":
            build_data["force_include"][
                str(SERVE_DIR.resolve())
            ] = "src/ntai/data/serve"
        elif self.target_name == "wheel":
            build_data["force_include"][str(SERVE_DIR.resolve())] = "ntai/data/serve"
