from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from point_loader import load_points
from pathlib import Path


app = FastAPI(
    title="Point Cloud Viewer API",
    description="A simple API for serving and managing 3D point cloud data files.",
    version="0.1.0",
)

# Allow request from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Folder containing .txt files with points data
DATA_DIR = Path(__file__).parent / "data"

@app.get("/files")
def get_files():
    '''
    Retrieve a list of all avaible point data files (in .txt format).
    Files should follow the naming pattern: "data_<number>.txt".
    Files are sorted based on the <number>.

    Returns:
        dict: A dictionary with the key "files" containing a list of filenames.
    '''
    files = sorted(
        (f.name for f in DATA_DIR.glob("*.txt")),
        key=lambda name: int(name.split("_")[1].split(".")[0])
    )
    return {"files": files}

@app.get("/points")
def get_points(filename: str):
    '''
    Retrieve points coordinations data from specified .txt data file.

    Args:
        filename (str): The name of selected file.
    Returns:
        list[dict]: A list of points coordinates [{"x": x, "y": z, "z": y}]
    '''
    try:
        points = load_points(filename)
        return points
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")

# Serve the built React app
frontend_path = Path(__file__).parent / "frontend_dist"
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")