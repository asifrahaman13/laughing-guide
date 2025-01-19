"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { Employee } from "../../types/dashboard";
import Link from "next/link";
import DropDownBox from "./Dropdown";
import SearchBox from "@/app/components/ui/SearchBox";
import RolesDropDownBox from "./RolesDropDown";
import StatusBadge from "./StatusBadge";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import Spinner from "./Spinner";
import { usePathname } from "next/navigation";
import { useToast } from "@/app/hooks/useToast";
import Toast from "../toasts/Toast";

export default function EmployeeTable() {
  const pathname = usePathname();
  const selection = useSelector((state: RootState) => state.selection);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [initialEmployees, setInitialEmployees] = useState<Employee[]>([]);
  const { toast, showToast } = useToast();
  const [employees, setEmployees] = useState(initialEmployees);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  React.useEffect(() => {
    setPageLoading(true);
    async function fetchData() {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
      try {
        const [employeesResponse] = await Promise.all([
          axios.get(
            `${backendUrl}/filter-employees?employee_name=${selection?.employeeName === "All" ? "" : selection.employeeName}&employee_status=${selection?.employeeStatus === "All" ? "" : selection.employeeStatus}&employee_role=${selection?.employeeRole === "All" ? "" : selection.employeeRole}&organizationId=${pathname.split("/")[2]}`,
          ),
        ]);

        if (employeesResponse?.data === null) {
          console.log("Sorry something went wrong");
        }
        setInitialEmployees(employeesResponse?.data);
      } catch {
        console.log("Error fetching data:");
      } finally {
        setPageLoading(false);
      }
    }

    fetchData();
  }, [
    pathname,
    selection.employeeName,
    selection.employeeRole,
    selection.employeeStatus,
  ]);

  React.useEffect(() => {
    setEmployees(initialEmployees);
  }, [initialEmployees]);

  function selectedRow(employee: string) {
    if (employee === "all") {
      setSelectedRows(
        selectedRows.length === employees.length
          ? []
          : employees.map((item) => item.employeeId),
      );
      return;
    }

    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(employee)
        ? prevSelectedRows.filter((row) => row !== employee)
        : [...prevSelectedRows, employee],
    );
  }

  async function deleteSelectedRows() {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
      const response = await axios.post(
        `${backendUrl}/delete-employees?organizationId=${pathname.split("/")[2]}`,
        {
          employeeIds: selectedRows,
        },
      );
      if (response.status === 200) {
        showToast("Employees successfully deleted", "success");
        const updatedEmployees = await axios.get(
          `${backendUrl}/employees?organizationId=${pathname.split("/")[2]}`,
        );
        setEmployees(updatedEmployees.data);
        setSelectedRows([]);
      }
    } catch {
      showToast("Error deleting employees", "error");
    }
  }

  return (
    <div className="container mx-auto p-4">
      {toast && <Toast message={toast.message} type={toast.type} />}
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

      {pageLoading && <Spinner />}
      <div className="overflow-hidden rounded-xl shadow-md">
        <div className="bg-light-gray-row border-none">
          <div className="bg-light-gray-row border text-gray-600 flex">
            <button
              className="p-3 text-left"
              onClick={() => selectedRow("all")}
            >
              <div
                className={`${
                  selectedRows?.length === employees?.length
                    ? "bg-lime-green border-none"
                    : ""
                } rounded-lg h-7 w-7 border border-gray-400`}
              ></div>
            </button>
            <div className="p-3 font-normal text-left flex-1">Employee ID</div>
            <div className="p-3 font-normal text-left flex-1">Profile</div>
            <div className="p-3 font-normal text-left flex-1">Email</div>
            <div className="p-3 font-normal text-left flex-1">Role</div>
            <div className="p-3 font-normal text-left flex-1">Status</div>
          </div>
          {employees?.map((employee, index) => (
            <React.Fragment key={employee?.employeeId + index}>
              <div
                className={`${selectedRows.includes(employee?.employeeId) ? "bg-light-gray-row" : "bg-white"}  border flex`}
              >
                <button
                  className="p-3"
                  onClick={() => selectedRow(employee?.employeeId)}
                >
                  <div
                    className={`${
                      selectedRows.includes(employee?.employeeId)
                        ? "bg-lime-green border-none"
                        : ""
                    } rounded-lg h-7 w-7 border border-gray-400`}
                  ></div>
                </button>
                <div className="p-3 flex-1">
                  <div className="flex items-center">
                    <Link
                      href={`/dashboard/payrolls/${employee?.employeeId}`}
                      className="text-[#02b9b0] border-b border-[#02b9b0]"
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
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-md flex justify-between items-center">
          <div className="flex gap-1">
            <div>{selectedRows?.length}</div>
            <div> {selectedRows?.length === 1 ? "row" : "rows"} selected</div>
          </div>
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
