"use client";
import axios from "axios";
import Link from "next/link";
import React from "react";

type EmployeeSalaryDetails = {
  bonuses: number;
  cpfContributions: {
    employeeContribution: number;
    employerContribution: number;
    totalContribution: number;
  };
  employeeId: string;
  employeeName: string;
  employeeSalary: number;
  grossSalary: number;
  netSalary: number;
};

const EmployeeRow: React.FC<{ employee: EmployeeSalaryDetails }> = ({
  employee,
}) => (
  <tr key={employee?.employeeId} className="bg-white border-2">
    <td className="p-3">
      <input type="checkbox" />
    </td>
    <td className="p-3">
      <div className="flex items-center">
        <Link
          href={`/dashboard/payrolls/${employee?.employeeId}`}
          className="text-[#02b9b0] border-b-2 border-[#02b9b0]"
        >
          {employee?.employeeName}
        </Link>
      </div>
    </td>
    <td className="p-3">{employee?.bonuses}</td>
    <td className="p-3">{employee?.employeeSalary}</td>
    <td className="p-3 r">
      {employee?.cpfContributions?.employeeContribution}
    </td>
    <td className="p-3 ">{employee?.cpfContributions?.employerContribution}</td>
    <td className="p-3 ">{employee?.cpfContributions?.totalContribution}</td>
    <td className="p-3 ">{employee?.grossSalary}</td>
    <td className="p-3 ">{employee?.netSalary}</td>
  </tr>
);

export default function Page() {
  const [payrollData, setPayrollData] = React.useState<
    EmployeeSalaryDetails[] | null
  >(null);

  React.useEffect(() => {
    async function fetchPayrollId() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
        const response = await axios.get(`${backendUrl}/calculate-payroll`);
        console.log("Payroll data:", response.data);
        if (response.data) {
          setPayrollData(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchPayrollId();
  }, []);
  return (
    <div className=" w-full ">
      <div className="text-xl items-center flex px-4 font-bold mb-4 text-gray-800 h-20  bg-white">
        Payrolls
      </div>
      <div className="overflow-hidden px-4 rounded-xl ">
        <table className="min-w-full bg-gray-400 border-none rounded-xl">
          <thead className="bg-gray-100 border-2 text-gray-600">
            <tr className="font-medium">
              <th className="p-3 text-left">
                <input type="checkbox" />
              </th>
              <th className="p-3 font-medium text-left">Profile</th>
              <th className="p-3 font-medium text-left">Bonuses</th>
              <th className="p-3 font-medium text-left">Salary</th>
              <th className="p-3 font-medium text-left">
                Employee Contribution
              </th>
              <th className="p-3 font-medium text-left">
                Employer Contribution
              </th>
              <th className="p-3 font-medium text-left">Total Contribution</th>
              <th className="p-3 font-medium text-left">Gross Salary</th>
              <th className="p-3 font-medium text-left">Net Salary</th>
            </tr>
          </thead>
          <tbody>
            {payrollData?.map((employee) => (
              <EmployeeRow key={employee.employeeId} employee={employee} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
