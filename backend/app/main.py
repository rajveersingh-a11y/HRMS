from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import employees, attendance
from app.services.json_storage import ensure_data_files

app = FastAPI(title="HRMS Lite API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    ensure_data_files()

app.include_router(employees.router, prefix="/api")
app.include_router(attendance.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to HRMS Lite API"}
