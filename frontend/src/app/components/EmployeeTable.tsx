/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Employee } from "../types/dashboard";
import Link from "next/link";

interface EmployeeTableProps {
  employees: Employee[];
}

interface StatusProps {
  status: string;
}

const StatusBadge: React.FC<StatusProps> = ({ status }) => {
  const statusStyles: Record<
    string,
    { bg: string; text: string; icon: string }
  > = {
    Active: {
      bg: "bg-green-200",
      text: "text-lime-green",
      icon: "/images/status/active.svg",
    },
    "Payroll Only": {
      bg: "bg-light-gray",
      text: "text-status-gray",
      icon: "/images/status/payroll.svg",
    },
    "Invite Sent": {
      bg: "bg-purple-200",
      text: "text-light-purple",
      icon: "/images/status/invite.svg",
    },
  };

  const { bg, text, icon } = statusStyles[status] || {
    bg: "bg-gray-200",
    text: "text-gray-500",
    icon: "",
  };

  return (
    <div
      className={`text-center flex py-2 items-center px-4 ${bg} rounded-2xl ${text}`}
    >
      {icon && <img src={icon} alt={status} className="mr-2" />}
      {status}
    </div>
  );
};

const EmployeeRow: React.FC<{ employee: Employee }> = ({ employee }) => (
  <tr key={employee?.employeeId} className="bg-white border-2">
    <td className="p-3">
      <input type="checkbox" />
    </td>
    <td className="p-3">
      <div className="flex items-center">
        <Link
          href={`/dashboard/payrolls/${employee?.employeeId}`}
          className="text-[#02b9b0] border-b-2 border-[#02b9b0]"
        >
          {employee?.employeeName}
        </Link>
      </div>
    </td>
    <td className="p-3">{employee?.employeeEmail}</td>
    <td className="p-3">{employee?.employeeJobType}</td>
    <td className="p-3 flex items-center">
      <StatusBadge status={employee?.employeeStatus} />
    </td>
  </tr>
);

export default function EmployeeTable({ employees }: EmployeeTableProps) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4 text-gray-00">All Employees</h1>
      <div className="overflow-hidden rounded-xl shadow-md">
        <table className="min-w-full bg-gray-400 border-none">
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
            {employees?.map((employee) => (
              <EmployeeRow key={employee.employeeId} employee={employee} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
