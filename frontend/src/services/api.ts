import axios from 'axios';
import type { Employee, EmployeeCreate } from '../types/employee';
import type { Attendance, AttendanceCreate } from '../types/attendance';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getEmployees = async (search?: string) => {
  const response = await api.get<Employee[]>('/employees', { params: { search } });
  return response.data;
};

export const getEmployee = async (id: string) => {
  const response = await api.get<Employee>(`/employees/${id}`);
  return response.data;
};

export const createEmployee = async (data: EmployeeCreate) => {
  const response = await api.post<Employee>('/employees', data);
  return response.data;
};

export const deleteEmployee = async (id: string) => {
  await api.delete(`/employees/${id}`);
};

export const getAttendance = async (employee_id?: string, date?: string, status?: string) => {
  const response = await api.get<Attendance[]>('/attendance', { params: { employee_id, date, status } });
  return response.data;
};

export const getEmployeeAttendance = async (id: string) => {
  const response = await api.get<Attendance[]>(`/attendance/${id}`);
  return response.data;
};

export const markAttendance = async (data: AttendanceCreate) => {
  const response = await api.post<Attendance>('/attendance', data);
  return response.data;
};
