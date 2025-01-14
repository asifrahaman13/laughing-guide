/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";

import EmployeeTable from "@/app/components/EmployeeTable";
import EmployeeStatistics from "./EmployeeStatistics";
import EmployeeLine from "./EmployeeLine";
import EmployeeStatus from "./EmployeeStatus";

export default function EmployeeList() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const handleCheckboxChange = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

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
          count={25}
          description="Singaporeans"
          chartSrc="/images/charts/pie.svg"
          chartAlt="Pie Chart"
        />
        <EmployeeLine
          title="Employment Type"
          count={25}
          description="Full timers"
          chartSrc="/images/charts/line.svg"
          chartAlt="Pie Chart"
        />
        <EmployeeStatus
          title="Employment Status"
          count={25}
          description="Active Employees"
          chartSrc="/images/charts/halfPie.svg"
          chartAlt="Half Pie Chart"
        />
      </div>
      <EmployeeTable
        selectedRows={selectedRows}
        handleCheckboxChange={handleCheckboxChange}
        setSelectedRows={setSelectedRows}
      />
    </div>
  );
}
