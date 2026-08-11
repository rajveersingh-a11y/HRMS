from pydantic import BaseModel
from datetime import date
from typing import Literal

class AttendanceBase(BaseModel):
    employee_id: str
    date: date
    status: Literal["Present", "Absent"]

class AttendanceCreate(AttendanceBase):
    pass

class Attendance(AttendanceBase):
    id: int
