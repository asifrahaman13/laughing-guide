"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback } from "react";
import { Employee } from "../../types/dashboard";
import DropDownBox from "./Dropdown";
import SearchBox from "@/app/components/ui/SearchBox";
import StatusBadge from "./StatusBadge";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import Spinner from "./Spinner";
import { usePathname } from "next/navigation";
import { useToast } from "@/app/hooks/useToast";
import Toast from "../toasts/Toast";
import { openModal } from "@/lib/features/employeeUpdate";
import { setEmployeeData } from "@/lib/features/employeeDataSlice";

const EMPLOYEE_STATUS = [
  { id: 0, name: "All Status" },
  { id: 1, name: "Active" },
  { id: 2, name: "Invite Sent" },
  { id: 3, name: "Payroll Only" },
];

const EMPLOYEE_ROLE = [
  { id: 0, name: "All Role" },
  { id: 1, name: "Full Time" },
  { id: 2, name: "Contract" },
  { id: 3, name: "Part Time" },
  { id: 4, name: "Intern" },
];

export default function EmployeeTable() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { toast, showToast } = useToast();

  const selection = useSelector((state: RootState) => state.selection);
  const updateEmployee = useSelector((state: RootState) => state.employee);

  const [pageLoading, setPageLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  const organizationId = pathname.split("/")[2];
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  const fetchEmployees = useCallback(async () => {
    setPageLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const { data } = await axios.get(
        `${backendUrl}/employees/filter-employees`,
        {
          params: {
            employee_name:
              selection.employeeName === "All" ? "" : selection.employeeName,
            employee_status:
              selection.employeeStatus === "All Status"
                ? ""
                : selection.employeeStatus,
            employee_role:
              selection.employeeRole === "All Role"
                ? ""
                : selection.employeeRole,
            organizationId,
            page: currentPage,
            limit: itemsPerPage,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(data);
      setEmployees(data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setPageLoading(false);
    }
  }, [backendUrl, organizationId, selection, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees, updateEmployee]);

  const totalPages = Math.ceil(employees.length / itemsPerPage);

  const handleRowSelection = (employeeId: string | "all") => {
    if (employeeId === "all") {
      setSelectedRows(
        selectedRows.length === employees.length
          ? []
          : employees.map(({ employeeId }) => employeeId),
      );
    } else {
      setSelectedRows((prev) =>
        prev.includes(employeeId)
          ? prev.filter((id) => id !== employeeId)
          : [...prev, employeeId],
      );
    }
  };

  const deleteSelectedRows = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const { status } = await axios.post(
        `${backendUrl}/employees/delete-employees`,
        { employeeIds: selectedRows },
        {
          params: { organizationId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (status === 200) {
        showToast("Employees successfully deleted", "success");
        fetchEmployees();
        setSelectedRows([]);
      }
    } catch (error) {
      console.error("Error deleting employees:", error);
      showToast("Error deleting employees", "error");
    }
  };

  const handleEmployeeUpdate = (employeeId: string) => {
    const employee = employees.find((emp) => emp.employeeId === employeeId);
    if (employee) {
      dispatch(openModal());
      dispatch(
        setEmployeeData({
          EmployeeId: employee.employeeId,
          EmployeeName: employee.employeeName,
          EmployeeProfile: employee.employeeProfile,
          EmployeeEmail: employee.employeeEmail,
          EmployeeRole: employee.employeeRole,
          EmployeeStatus: employee.employeeStatus,
        }),
      );
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="flex items-center justify-between py-4">
        <h1 className="text-xl font-bold text-gray-700">All Employees</h1>
        <div className="flex gap-2">
          <SearchBox />

          <DropDownBox
            dropDownType="employment"
            data={EMPLOYEE_STATUS}
            key={0}
          />
          <DropDownBox dropDownType="roles" data={EMPLOYEE_ROLE} key={1} />
        </div>
      </div>

      {pageLoading ? (
        <Spinner />
      ) : (
        <div className="overflow-hidden rounded-xl shadow-md">
          <div className="bg-light-gray-row border-none">
            <div className="flex bg-light-gray-row border text-gray-600">
              <button
                className="p-3 text-left"
                onClick={() => handleRowSelection("all")}
              >
                <div
                  className={`rounded-lg h-7 w-7 border ${
                    selectedRows.length === employees.length
                      ? "bg-lime-green"
                      : "border-gray-400"
                  }`}
                />
              </button>
              {[
                "Employee ID",
                "Name",
                "Profile",
                "Email",
                "Role",
                "Status",
              ].map((heading) => (
                <div
                  key={heading}
                  className="p-3 font-normal text-left flex-1"
                  style={{ minWidth: "150px" }} 
                >
                  {heading}
                </div>
              ))}
            </div>
            {employees
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage,
              )
              .map((employee) => (
                <div
                  key={employee.employeeId}
                  className={`flex border ${
                    selectedRows.includes(employee.employeeId)
                      ? "bg-light-gray-row"
                      : "bg-white"
                  }`}
                >
                  <button
                    className="p-3"
                    onClick={() => handleRowSelection(employee.employeeId)}
                  >
                    <div
                      className={`rounded-lg h-7 w-7 border ${
                        selectedRows.includes(employee.employeeId)
                          ? "bg-lime-green"
                          : "border-gray-400"
                      }`}
                    />
                  </button>
                  <div className="p-3 flex-1" style={{ minWidth: "150px" }}>
                    <button
                      className="text-[#02b9b0] border-b border-[#02b9b0]"
                      onClick={() => handleEmployeeUpdate(employee.employeeId)}
                    >
                      {employee.employeeId}
                    </button>
                  </div>
                  <div className="p-3 flex-1" style={{ minWidth: "150px" }}>
                    {employee.employeeName}
                  </div>
                  <div
                    className="p-3 flex-1 flex items-center gap-2"
                    style={{ minWidth: "150px" }}
                  >
                    <img
                      src="/images/employees/circle.svg"
                      alt="profile"
                      className="w-6 h-6"
                    />
                    <span>{employee.employeeProfile}</span>
                  </div>
                  <div className="p-3 flex-1" style={{ minWidth: "150px" }}>
                    {employee.employeeEmail}
                  </div>
                  <div className="p-3 flex-1" style={{ minWidth: "150px" }}>
                    {employee.employeeRole}
                  </div>
                  <div className="p-3 flex-1" style={{ minWidth: "150px" }}>
                    <StatusBadge status={employee.employeeStatus} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      <div className="flex w-full justify-between py-4 gap-4">
        <div className="flex-col justify-center items-center bg-red-50">
          {selectedRows.length > 0 && (
            <div className="flex justify-between items-center ">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={deleteSelectedRows}
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>
        <div className="flex gap-4 items-center">
          <button
            className="bg-lime-green text-white px-4 py-2 rounded"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="bg-lime-green text-white px-4 py-2 rounded"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
