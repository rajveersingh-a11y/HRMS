from app.services.json_storage import read_attendance, write_attendance, read_employees
from app.schemas.attendance import AttendanceCreate
from typing import List, Optional
from fastapi import HTTPException
from datetime import date

def get_all_attendance(employee_id: Optional[str] = None, filter_date: Optional[date] = None, status: Optional[str] = None) -> List[dict]:
    attendance = read_attendance()
    
    if employee_id:
        attendance = [a for a in attendance if a['employee_id'] == employee_id]
        
    if filter_date:
        attendance = [a for a in attendance if a['date'] == filter_date.isoformat()]
        
    if status:
        attendance = [a for a in attendance if a['status'].lower() == status.lower()]
        
    return attendance

def get_employee_attendance(employee_id: str) -> List[dict]:
    attendance = read_attendance()
    return [a for a in attendance if a['employee_id'] == employee_id]

def mark_attendance(attendance_data: AttendanceCreate) -> dict:
    # Validate employee exists
    employees = read_employees()
    if not any(e['employee_id'] == attendance_data.employee_id for e in employees):
        raise HTTPException(status_code=404, detail=f"Employee ID {attendance_data.employee_id} not found")
        
    records = read_attendance()
    
    # Prevent duplicate attendance for the same employee on the same date
    date_str = attendance_data.date.isoformat()
    if any(a['employee_id'] == attendance_data.employee_id and a['date'] == date_str for a in records):
        raise HTTPException(status_code=409, detail=f"Attendance for Employee ID {attendance_data.employee_id} on {date_str} already marked")
        
    new_id = max([a['id'] for a in records], default=0) + 1
    
    att_dict = attendance_data.model_dump()
    att_dict['date'] = date_str  # store as string
    att_dict['id'] = new_id
    
    records.append(att_dict)
    write_attendance(records)
    
    return att_dict
