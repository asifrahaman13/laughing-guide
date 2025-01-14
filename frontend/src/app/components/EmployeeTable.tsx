import React from "react";
import { Employee } from "../types/dashboard";
import Link from "next/link";

interface EmployeeTableProps {
  employees: Employee[];
}

export default function EmployeeTable({ employees }: EmployeeTableProps) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4 text-gray-800">All Employees</h1>
      <div className="overflow-hidden rounded-xl shadow-md">
        <table className="min-w-full bg-grary-400 border-none">
          <thead className="bg-gray-100 border-2 text-gray-600">
            <tr className="font-medium">
              <th className="p-3 text-left">
                <input type="checkbox" />
              </th>
              <th className="p-3 font-medium text-left">Profile</th>
              <th className="p-3 font-medium text-left">Email ID</th>
              <th className="p-3 font-medium text-left">Role</th>
              <th className="p-3 font-medium text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee?.employeeId} className="bg-white border-2">
                <td className="p-3">
                  <input type="checkbox" />
                </td>
                <td className="p-3">
                  <div className="flex items-center ">
                    <Link
                      href="/dashboard/claims"
                      className="text-blue-700 border-b-2 border-blue-700"
                    >
                      {employee?.employeeName}
                    </Link>
                  </div>
                </td>
                <td className="p-3">{employee?.employeeEmail}</td>
                <td className="p-3">{employee?.employeeJobType}</td>
                <td className="p-3">{employee?.employeeStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
