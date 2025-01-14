/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import AddEmployee from "@/app/components/AddEmployee";
import { employees } from "@/constants/dashboard";

function EmployeeList() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const handleCheckboxChange = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const isSelected = (id: number) => selectedRows.includes(id);

  return (
    <div className="flex flex-col w-full h-full bg-gray-100">
      <div className="bg-white p-2 lg:p-4 h-16 flex justify-between items-center">
        <div className="font-medium text-xl">Employees</div>
        <div>
          <button className="bg-lime-green rounded-lg px-4 gap-2 items-center py-2 flex">
            <img src="/images/employees/person.svg" alt="" />
            <div className="text-white">Add Employee</div>
          </button>
        </div>
      </div>
      <div className="m-8 flex gap-4 h-1/4">
        <div className="bg-white p-4 rounded-xl h-full w-1/5"></div>
        <div className="bg-white p-4 rounded-xl h-full w-3/5"></div>
        <div className="bg-white p-4 rounded-xl h-full w-2/5"></div>
      </div>
      <div className="flex flex-col"></div>
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Employee Table</h1>
        <div className="overflow-hidden rounded-xl shadow-md">
          <table className="min-w-full bg-grary-400 border-none">
            <thead className="bg-gray-100  border-2 text-gray-600">
              <tr>
                <th className="p-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRows(
                          employees.map((employee) => employee.id)
                        );
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
    </div>
  );
}

export default function Page() {
  const [employees, setEmployees] = React.useState([]);

  React.useEffect(() => {
    setEmployees([]);
  }, []);

  return (
    <React.Fragment>
      <div className="w-full h-full">
        {employees.length !== 0 ? (
          <AddEmployee />
        ) : (
          <>
            <EmployeeList />
          </>
        )}
      </div>
    </React.Fragment>
  );
}
