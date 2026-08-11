from app.services.json_storage import read_employees, write_employees
from app.schemas.employee import EmployeeCreate
from typing import List, Optional
from fastapi import HTTPException

def get_all_employees(search: Optional[str] = None) -> List[dict]:
    employees = read_employees()
    if search:
        search_lower = search.lower()
        employees = [e for e in employees if search_lower in e['full_name'].lower() or search_lower in e['employee_id'].lower() or search_lower in e['email'].lower() or search_lower in e['department'].lower()]
    return employees

def get_employee_by_id(employee_id: str) -> Optional[dict]:
    employees = read_employees()
    for e in employees:
        if e['employee_id'] == employee_id:
            return e
    return None

def create_employee(employee: EmployeeCreate) -> dict:
    employees = read_employees()
    
    # Validation for unique ID
    if any(e['employee_id'] == employee.employee_id for e in employees):
        raise HTTPException(status_code=409, detail=f"Employee ID {employee.employee_id} already exists")
    
    # Validation for unique Email
    if any(e['email'] == employee.email for e in employees):
        raise HTTPException(status_code=409, detail=f"Email {employee.email} already exists")
        
    emp_dict = employee.model_dump()
    employees.append(emp_dict)
    write_employees(employees)
    return emp_dict

def delete_employee(employee_id: str) -> bool:
    employees = read_employees()
    filtered = [e for e in employees if e['employee_id'] != employee_id]
    
    if len(filtered) == len(employees):
        return False
        
    write_employees(filtered)
    return True
