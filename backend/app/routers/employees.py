from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from app.schemas.employee import Employee, EmployeeCreate
from app.services import employee_service

router = APIRouter(prefix="/employees", tags=["employees"])

@router.post("", response_model=Employee, status_code=status.HTTP_201_CREATED)
def create_employee(employee: EmployeeCreate):
    return employee_service.create_employee(employee)

@router.get("", response_model=List[Employee])
def get_employees(search: Optional[str] = None):
    return employee_service.get_all_employees(search)

@router.get("/{employee_id}", response_model=Employee)
def get_employee(employee_id: str):
    emp = employee_service.get_employee_by_id(employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp

@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: str):
    success = employee_service.delete_employee(employee_id)
    if not success:
        raise HTTPException(status_code=404, detail="Employee not found")
