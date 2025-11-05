from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from point_loader import load_points


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

@app.get("/points")
def get_points(filename: str = "data_1.txt"):
    return load_points(filename)
