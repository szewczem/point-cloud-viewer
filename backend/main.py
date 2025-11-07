from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from point_loader import load_points
from pathlib import Path


app = FastAPI(
    title="Point Cloud Viewer API",
    description="API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],    # "GET", "POST", "PUT"
    allow_headers=["*"],
)

DATA_DIR = Path(__file__).parent / "data"

@app.get("/files")
def get_files():
    files = [f.name for f in DATA_DIR.glob("*.txt")]
    return {"files": files}

@app.get("/points")
def get_points(filename: str):
    try:
        points = load_points(filename)
        return points
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")
