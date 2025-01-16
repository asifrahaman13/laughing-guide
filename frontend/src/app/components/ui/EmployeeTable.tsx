/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { Employee } from "../../types/dashboard";
import Link from "next/link";
import DropDownBox from "./Dropdown";
import SearchBox from "@/app/components/ui/SearchBox";
import RolesDropDownBox from "./RolesDropDown";
import StatusBadge from "./StatusBadge";
import axios from "axios";

type EmployeeTableProps = {
  employees: Employee[];
};

export default function EmployeeTable({ employees: initialEmployees }: EmployeeTableProps) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  useEffect(() => {
    setEmployees(initialEmployees);
  }, [initialEmployees]);

  function selectedRow(employee: string) {
    if (employee === "all") {
      if (selectedRows.length === employees.length) {
        setSelectedRows([]);
        return;
      }
      setSelectedRows(employees.map((item) => item.employeeId));
    } else {
      if (selectedRows.includes(employee)) {
        setSelectedRows(selectedRows.filter((row) => row !== employee));
      } else {
        setSelectedRows([...selectedRows, employee]);
      }
    }
  }

  async function deleteSelectedRows() {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
      const response = await axios.post(`${backendUrl}/delete-employees`, {
        employeeIds: selectedRows,
      });
      if (response.status === 200) {
        console.log("Rows deleted successfully:", response);
        const updatedEmployees = await axios.get(`${backendUrl}/employees`);
        setEmployees(updatedEmployees.data);
        setSelectedRows([]);
      }
    } catch (error) {
      console.error("Error deleting rows:", error);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between py-4">
        <div className="text-xl font-bold text-gray-700 h-full flex items-center">
          All Employees
        </div>
        <div className="flex gap-2">
          <SearchBox />
          <DropDownBox />
          <RolesDropDownBox />
        </div>
      </div>
      <div className="overflow-hidden rounded-xl shadow-md">
        <div className="bg-gray-400 border-none">
          <div className="bg-gray-100 border-2 text-gray-600 flex">
            <button
              className="p-3 text-left"
              onClick={() => selectedRow("all")}
            >
              <div
                className={`${
                  selectedRows?.length === employees?.length
                    ? "bg-lime-green border-none"
                    : ""
                } rounded-lg h-7 w-7 border-2 border-gray-400`}
              ></div>
            </button>
            <div className="p-3 font-medium text-left flex-1">Employee ID</div>
            <div className="p-3 font-medium text-left flex-1">Profile</div>
            <div className="p-3 font-medium text-left flex-1">Email</div>
            <div className="p-3 font-medium text-left flex-1">Role</div>
            <div className="p-3 font-medium text-left flex-1">Status</div>
          </div>
          {employees?.map((employee, index) => (
            <React.Fragment key={employee?.employeeId + index}>
              <div className="bg-white border-2 flex">
                <button
                  className="p-3"
                  onClick={() => selectedRow(employee?.employeeId)}
                >
                  <div
                    className={`${
                      selectedRows.includes(employee?.employeeId)
                        ? "bg-lime-green border-none"
                        : ""
                    } rounded-lg h-7 w-7 border-2 border-gray-400`}
                  ></div>
                </button>
                <div className="p-3 flex-1">
                  <div className="flex items-center">
                    <Link
                      href={`/dashboard/payrolls/${employee?.employeeId}`}
                      className="text-[#02b9b0] border-b-2 border-[#02b9b0]"
                    >
                      {employee?.employeeId}
                    </Link>
                  </div>
                </div>
                <button className="p-3 flex items-center gap-2 flex-1">
                  <img src="/images/employees/circle.svg" alt="" />
                  <div>{employee?.employeeProfile}</div>
                </button>
                <div className="p-3 flex-1">{employee?.employeeEmail}</div>
                <div className="p-3 flex-1">{employee?.employeeRole}</div>
                <div className="p-3 flex-1 flex items-center">
                  <StatusBadge status={employee?.employeeStatus} />
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {selectedRows.length !== 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md flex justify-between items-center">
          <div>{selectedRows.length} rows selected</div>
          <button
            className="bg-red-400 text-white px-4 py-2 rounded"
            onClick={deleteSelectedRows}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
