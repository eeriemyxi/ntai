import importlib.util
import subprocess
from pathlib import Path

from hatchling.builders.hooks.plugin.interface import BuildHookInterface

HERE = Path(__file__).parent.resolve()
WEB_DIR = HERE / "../web"
SERVE_DIR = HERE / "../src/ntai/data/serve"


class ProcessDataHook(BuildHookInterface):
    def initialize(self, version, build_data):
        ui_already_built = (SERVE_DIR / "index.html").exists()

        if not ui_already_built:
            subprocess.run(["bun", "install"], cwd=WEB_DIR, check=True)
            subprocess.run(
                [
                    "bun",
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


def _load(name, file):
    spec = importlib.util.spec_from_file_location(name, HERE / file)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module
