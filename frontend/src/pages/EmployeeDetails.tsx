import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEmployee, getEmployeeAttendance } from '../services/api';
import type { Employee } from '../types/employee';
import type { Attendance } from '../types/attendance';
import { ArrowLeft, Mail, Briefcase, Hash } from 'lucide-react';

const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        const emp = await getEmployee(id);
        const att = await getEmployeeAttendance(id);
        setEmployee(emp);
        setAttendance(att);
      } catch (err) {
        setError('Employee not found or unable to load details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  if (error || !employee) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
        <p className="text-sm text-red-700">{error}</p>
        <Link to="/employees" className="mt-2 inline-block text-sm font-medium text-red-700 underline">Back to Employees</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/employees" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Employees
        </Link>
        <h2 className="text-2xl font-bold leading-7 text-gray-900">Employee Information</h2>
      </div>

      <div className="bg-white shadow-sm overflow-hidden sm:rounded-xl border border-gray-100">
        <div className="px-4 py-5 sm:px-6 flex items-center">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold mr-4">
            {employee.full_name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">{employee.full_name}</h3>
            <p className="max-w-2xl text-sm text-gray-500">{employee.department} Department</p>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center"><Hash className="w-4 h-4 mr-2" /> Employee ID</dt>
              <dd className="mt-1 text-sm text-gray-900 font-semibold">{employee.employee_id}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center"><Briefcase className="w-4 h-4 mr-2" /> Department</dt>
              <dd className="mt-1 text-sm text-gray-900">{employee.department}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center"><Mail className="w-4 h-4 mr-2" /> Email address</dt>
              <dd className="mt-1 text-sm text-gray-900">{employee.email}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold leading-7 text-gray-900 mb-4">Attendance History</h3>
        {attendance.length > 0 ? (
          <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendance.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">No attendance records found for this employee.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetails;
