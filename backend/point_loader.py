from pathlib import Path


'''
Utility module for loading points coordinates from .txt file.

Functions:
    load_points(filename: str) -> list[dict]:
    Read a text file containing points coordiantes and return them as a python list of dictionares [{"x": x, "y": z, "z": y}].
    Coordinates for Y and Z are swapped for proper visualisation in Three.js.

Constant:
    BASE_DIR: Path to the directory containing this module.
    DATA_DIR: Path to the directory containing .txt files with points data.

File format:
    Provided files need to have .txt extension and contain in separate lines data with coordinations for one points separated by spaces, e.g.:
        1.0 2.0 3.0
        4.0 5.0 6.0
'''
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"

def load_points(filename: str):
    file_path = DATA_DIR / filename
    if not file_path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")
    
    points = []

    with open(file_path, "r") as f:
        for line in f:
            x, y, z = map(float, line.strip().split())
            points.append({"x": x, "y": z, "z": y})
    return points