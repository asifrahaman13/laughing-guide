/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import AddEmployee from "@/app/components/AddEmployee";
import { useDispatch } from "react-redux";
import { Employee, EmployeeData } from "@/app/types/dashboard";
import axios from "axios";
import { openModal } from "@/lib/features/modalSlice";
import EmployeeStatistics from "@/app/components/EmployeeStatistics";
import EmployeeStatus from "@/app/components/EmployeeStatus";
import EmployeeLine from "@/app/components/EmployeeLine";
import EmployeeTable from "@/app/components/EmployeeTable";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

export default function Page() {
  const dispath = useDispatch();
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [employeeStats, setEmployeeStats] = useState<EmployeeData | null>(null);
  const loading = useSelector((state: RootState) => state.spinner.isLoading);

  React.useEffect(() => {
    async function fetchData() {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

      try {
        const [employeesResponse, statsResponse] = await Promise.all([
          axios.get(`${backendUrl}/employees`),
          axios.get(`${backendUrl}/aggregate`),
        ]);

        if (employeesResponse.data === null || statsResponse.data === null) {
          return;
        }

        setEmployees(employeesResponse.data);
        setEmployeeStats(statsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [loading]);

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center h-screen">
          <div
            className="h-16 w-16 animate-spin rounded-full border-4 border-transparent"
            style={{
              borderTopColor: "rgba(173,216,230,1)",
              borderRightColor: "rgba(173,216,230,0.7)",
              borderBottomColor: "rgba(173,216,230,0.5)",
              borderLeftColor: "rgba(173,216,230,0.3)",
            }}
          ></div>
        </div>
      </>
    );
  }

  if (
    employees?.length === 0 ||
    employees === null ||
    employees === undefined
  ) {
    return <AddEmployee />;
  }

  return (
    <React.Fragment>
      <div className="flex flex-col w-full h-full">
        <div className="bg-white p-2 lg:p-4 h-16 flex justify-between items-center">
          <div className="font-medium text-xl">Employees</div>
          <div>
            <button
              className="bg-lime-green rounded-lg px-4 gap-2 items-center py-2 flex"
              onClick={() => {
                dispath(openModal());
              }}
            >
              <img src="/images/employees/person.svg" alt="" />
              <div className="text-white">Add Employee</div>
            </button>
          </div>
        </div>
        <div className="m-8 flex gap-4">
          <EmployeeStatistics
            title="Nationality"
            description="Singaporeans"
            nationality={employeeStats?.Nationality || null}
          />
          <EmployeeLine
            title="Employment Type"
            description="Full timers"
            employeeType={employeeStats?.EmploymentType || null}
          />
          <EmployeeStatus
            title="Employment Status"
            description="Active Employees"
            employmentStatus={employeeStats?.EmployeeStatus || null}
          />
        </div>
        <EmployeeTable employees={employees} />
      </div>
    </React.Fragment>
  );
}
