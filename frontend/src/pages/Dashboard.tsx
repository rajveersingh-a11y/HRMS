import React, { useEffect, useState } from 'react';
import { getEmployees, getAttendance } from '../services/api';
import { Users, UserCheck, UserX, Building2 } from 'lucide-react';
import type { Employee } from '../types/employee';
import type { Attendance } from '../types/attendance';

const Dashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [emps, atts] = await Promise.all([getEmployees(), getAttendance()]);
        setEmployees(emps);
        setAttendance(atts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  const today = new Date().toISOString().split('T')[0];
  const todaysAttendance = attendance.filter(a => a.date === today);
  const presentToday = todaysAttendance.filter(a => a.status === 'Present').length;
  const absentToday = todaysAttendance.filter(a => a.status === 'Absent').length;
  const uniqueDepartments = new Set(employees.map(e => e.department)).size;

  const statCards = [
    { title: 'Total Employees', value: employees.length, icon: Users, color: 'bg-blue-500' },
    { title: 'Present Today', value: presentToday, icon: UserCheck, color: 'bg-green-500' },
    { title: 'Absent Today', value: absentToday, icon: UserX, color: 'bg-red-500' },
    { title: 'Total Departments', value: uniqueDepartments, icon: Building2, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Dashboard
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-md ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stat.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Recent Attendance</h3>
          {attendance.length > 0 ? (
            <div className="overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {attendance.slice(-5).reverse().map((record) => {
                  const emp = employees.find(e => e.employee_id === record.employee_id);
                  return (
                    <li key={record.id} className="py-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                          {emp ? emp.full_name.charAt(0) : '?'}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{emp ? emp.full_name : record.employee_id}</p>
                          <p className="text-sm text-gray-500">{record.date}</p>
                        </div>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {record.status}
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No recent attendance records.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
