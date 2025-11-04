from pathlib import Path


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
            if z < -1:
                color = "red"
            elif -1 <= z < 0.5:
                color = "orange"
            else:
                color = "green"
            points.append({"x": y, "y": z, "z": x, "color": color})
    return points