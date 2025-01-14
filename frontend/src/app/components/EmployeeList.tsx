/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";

import EmployeeTable from "@/app/components/EmployeeTable";
import EmployeeStatistics from "./EmployeeStatistics";
import EmployeeLine from "./EmployeeLine";
import axios from "axios";
import { Employee } from "../types/dashboard";
import { EmployeeData } from "../types/dashboard";
import EmployeeStatus from "./EmployeeStatus";

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeStats, setEmployeeStats] = useState<EmployeeData | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

      try {
        const [employeesResponse, statsResponse] = await Promise.all([
          axios.get(`${backendUrl}/employees`),
          axios.get(`${backendUrl}/aggregate`),
        ]);

        setEmployees(employeesResponse.data);
        setEmployeeStats(statsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

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
  );
}
