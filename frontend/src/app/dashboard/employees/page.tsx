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
      <div className="m-8 flex gap-4 ">
        <div className="bg-white p-4  py-6 rounded-xl h-full w-2/5 flex flex-col">
          <div className="h-2/3 flex justify-between">
            <div className="flex flex-col gap-2">
              <div className="text-sm">Nationality</div>
              <div className="font-medium text-2xl">25</div>
              <div>Singaporeans</div>
            </div>
            <div>
              <img src="/images/charts/pie.svg" alt="" className="h-28" />
            </div>
          </div>
          <div className="h-1/3">
            <div className="flex text-gray-600 items-center gap-4 flex-wrap p-4 rounded-md">
              <div className="flex items-center">
                <div className="w-1 h-6 bg-cyan-500 mr-2 rounded-full"></div>
                <span className=" font-medium">25 Full-Timer</span>
              </div>
              <div className="flex items-center">
                <div className="w-1 h-6 bg-yellow-500 mr-2 rounded-full"></div>
                <span className=" font-medium">10 Part-Timer</span>
              </div>
              <div className="flex items-center">
                <div className="w-1 h-6 bg-purple-500 mr-2 rounded-full"></div>
                <span className=" font-medium">5 Contract</span>
              </div>
              <div className="flex items-center">
                <div className="w-1 h-6 bg-gray-300 mr-2 rounded-full"></div>
                <span className=" font-medium">6 Intern</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl py-8 h-full w-2/5">
          <div className="h-2/3 flex justify-between">
            <div className="flex flex-col gap-2">
              <div className="text-sm">Nationality</div>
              <div className="font-medium text-2xl">25</div>
              <div>Singaporeans</div>
            </div>
          </div>

          <div>
            <img src="/images/charts/line.svg" alt="" />
          </div>

          <div className="h-1/3">
            <div className="flex text-gray-600 items-center gap-4 flex-wrap p-4 rounded-md">
              <div className="flex items-center">
                <div className="w-1 h-6 bg-cyan-500 mr-2 rounded-full"></div>
                <span className=" font-medium">25 Full-Timer</span>
              </div>
              <div className="flex items-center">
                <div className="w-1 h-6 bg-yellow-500 mr-2 rounded-full"></div>
                <span className=" font-medium">10 Part-Timer</span>
              </div>
              <div className="flex items-center">
                <div className="w-1 h-6 bg-purple-500 mr-2 rounded-full"></div>
                <span className=" font-medium">5 Contract</span>
              </div>
              <div className="flex items-center">
                <div className="w-1 h-6 bg-gray-300 mr-2 rounded-full"></div>
                <span className=" font-medium">6 Intern</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl h-full w-2/5">
          <div className="h-2/3 flex justify-between">
            <div className="flex flex-col gap-2">
              <div className="text-sm">Nationality</div>
              <div className="font-medium text-2xl">25</div>
              <div>Singaporeans</div>
            </div>
            <div>
              <img src="/images/charts/halfPie.svg" alt="" className="h-22" />
            </div>
          </div>
          <div className="h-1/3">
            <div className="flex text-gray-600 items-center gap-4 flex-wrap p-4 rounded-md">
              <div className="flex items-center">
                <div className="w-1 h-6 bg-cyan-500 mr-2 rounded-full"></div>
                <span className=" font-medium">25 Full-Timer</span>
              </div>
              <div className="flex items-center">
                <div className="w-1 h-6 bg-yellow-500 mr-2 rounded-full"></div>
                <span className=" font-medium">10 Part-Timer</span>
              </div>
              <div className="flex items-center">
                <div className="w-1 h-6 bg-purple-500 mr-2 rounded-full"></div>
                <span className=" font-medium">5 Contract</span>
              </div>
            </div>
          </div>
        </div>
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
