import React from "react";
import { employees } from "@/constants/dashboard";

interface EmployeeTableProps {
  selectedRows: number[];
  handleCheckboxChange: (id: number) => void;
  setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function EmployeeTable({
  selectedRows,
  handleCheckboxChange,
  setSelectedRows,
}: EmployeeTableProps) {
  const isSelected = (id: number) => selectedRows.includes(id);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Employee Table</h1>
      <div className="overflow-hidden rounded-xl shadow-md">
        <table className="min-w-full bg-grary-400 border-none">
          <thead className="bg-gray-100 border-2 text-gray-600">
            <tr>
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRows(employees.map((employee) => employee.id));
                    } else {
                      setSelectedRows([]);
                    }
                  }}
                  checked={selectedRows.length === employees.length}
                />
              </th>
              <th className="p-3 text-left">Profile</th>
              <th className="p-3 text-left">Email ID</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className={`${
                  isSelected(employee.id) ? "bg-blue-100" : ""
                } hover:bg-gray-50 bg-white border-2`}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={isSelected(employee.id)}
                    onChange={() => handleCheckboxChange(employee.id)}
                  />
                </td>
                <td className="p-3">
                  <div className="flex items-center">{employee.name}</div>
                </td>
                <td className="p-3">{employee.email}</td>
                <td className="p-3">{employee.role}</td>
                <td className="p-3">{employee.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <p className="text-sm">
          Selected Rows:{" "}
          {selectedRows.length > 0 ? selectedRows.join(", ") : "None"}
        </p>
      </div>
    </div>
  );
}
