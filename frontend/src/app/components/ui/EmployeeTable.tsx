/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Employee } from "../../types/dashboard";
import Link from "next/link";
import DropDownBox from "./Dropdown";
import SearchBox from "@/app/components/ui/SearchBox";
import RolesDropDownBox from "./RolesDropDown";
import StatusBadge from "./StatusBadge";

type EmployeeTableProps = {
  employees: Employee[];
};

export default function EmployeeTable({ employees }: EmployeeTableProps) {
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);

  function selectedRow(employee: string) {
    console.log(employee);

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
    console.log(selectedRows);
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
                  selectedRows.length === employees.length
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
    </div>
  );
}
