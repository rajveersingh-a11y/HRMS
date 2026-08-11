import json
import os
from typing import List, Dict, Any

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
EMPLOYEES_FILE = os.path.join(DATA_DIR, "employees.json")
ATTENDANCE_FILE = os.path.join(DATA_DIR, "attendance.json")

def ensure_data_files():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
    
    if not os.path.exists(EMPLOYEES_FILE):
        with open(EMPLOYEES_FILE, "w") as f:
            json.dump([], f)
            
    if not os.path.exists(ATTENDANCE_FILE):
        with open(ATTENDANCE_FILE, "w") as f:
            json.dump([], f)

def read_json(file_path: str) -> List[Dict[str, Any]]:
    ensure_data_files()
    try:
        with open(file_path, "r") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return []

def write_json(file_path: str, data: List[Dict[str, Any]]):
    ensure_data_files()
    with open(file_path, "w") as f:
        json.dump(data, f, indent=2)

def read_employees() -> List[Dict[str, Any]]:
    return read_json(EMPLOYEES_FILE)

def write_employees(data: List[Dict[str, Any]]):
    write_json(EMPLOYEES_FILE, data)

def read_attendance() -> List[Dict[str, Any]]:
    return read_json(ATTENDANCE_FILE)

def write_attendance(data: List[Dict[str, Any]]):
    write_json(ATTENDANCE_FILE, data)
