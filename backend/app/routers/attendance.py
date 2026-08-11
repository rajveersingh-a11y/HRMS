from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from datetime import date
from app.schemas.attendance import Attendance, AttendanceCreate
from app.services import attendance_service
from app.services.employee_service import get_employee_by_id

router = APIRouter(prefix="/attendance", tags=["attendance"])

@router.post("", response_model=Attendance, status_code=status.HTTP_201_CREATED)
def mark_attendance(attendance: AttendanceCreate):
    return attendance_service.mark_attendance(attendance)

@router.get("", response_model=List[Attendance])
def get_all_attendance(
    employee_id: Optional[str] = None,
    date: Optional[date] = None,
    status: Optional[str] = None
):
    return attendance_service.get_all_attendance(employee_id, date, status)

@router.get("/{employee_id}", response_model=List[Attendance])
def get_employee_attendance(employee_id: str):
    emp = get_employee_by_id(employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return attendance_service.get_employee_attendance(employee_id)
