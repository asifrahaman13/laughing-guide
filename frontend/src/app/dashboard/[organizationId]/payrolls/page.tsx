/* eslint-disable @next/next/no-img-element */
"use client";
import axios from "axios";
import Link from "next/link";
import React from "react";
import { EmployeeSalaryDetails } from "@/app/types/dashboard";
import { usePathname } from "next/navigation";
import InProgress from "@/app/components/ui/InProgress";

const EmployeeRow: React.FC<{ employee: EmployeeSalaryDetails }> = ({
  employee,
}) => (
  <tr key={employee?.employeeId} className="bg-white border-2">
    <td className="p-3">
      <div className="flex items-center">
        <Link
          href={`/dashboard/payrolls/${employee?.employeeId}`}
          className="text-[#02b9b0] border-b-2 border-[#02b9b0]"
        >
          {employee?.employeeId}
        </Link>
      </div>
    </td>
    <td className="p-3">{employee?.employeeName}</td>
    <td className="p-3">{employee?.employeeEmail}</td>
    <td className="p-3">{employee?.salary}</td>
    <td className="p-3">{employee?.bonuses}</td>
    <td className="p-3 r">{employee?.employeeContribution}</td>
    <td className="p-3 ">{employee?.employerContribution}</td>
    <td className="p-3 ">{employee?.totalContribution}</td>
    <td className="p-3 ">{employee?.grossSalary}</td>
    <td className="p-3 ">{employee?.netSalary}</td>
  </tr>
);

export default function Page() {
  const pathname = usePathname();
  const [payrollData, setPayrollData] = React.useState<
    EmployeeSalaryDetails[] | null
  >(null);

  React.useEffect(() => {
    async function fetchPayrollId() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
        const response = await axios.get(
          `${backendUrl}/payroll?organizationId=${pathname.split("/")[2]}`
        );
        console.log("Payroll data:", response.data);
        if (response.data) {
          setPayrollData(response.data);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    }
    fetchPayrollId();
  }, [pathname]);

  const downloadCSV = () => {
    if (!payrollData) return;

    const headers = [
      "Profile",
      "Name",
      "Email",
      "Salary",
      "Bonuses",
      "Employee Contribution",
      "Employer Contribution",
      "Total Contribution",
      "Gross Salary",
      "Net Salary",
    ];

    const rows = payrollData.map((employee) => [
      employee.employeeId,
      employee.employeeName,
      employee.employeeEmail,
      employee.salary,
      employee.bonuses,
      employee.employeeContribution,
      employee.employerContribution,
      employee.totalContribution,
      employee.grossSalary,
      employee.netSalary,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "payroll_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (payrollData === null) {
    return (
      <InProgress
        title="No payrolls generated"
        message="You have no records at this point. If you already have uploaded your data you can generate the payrolls from the employees page. However if ou have not uploaded yet then start by uploading some files"
      />
    );
  }
  return (
    <div className="w-full">
      <div className="text-xl gap-4  items-center flex px-4 font-bold border text-gray-800 h-20 bg-white">
        <div className="text-gray-900 text-xl">Payrolls</div>
        <button onClick={downloadCSV} className="flex gap-2 items-center">
          <img
            src="https://media.istockphoto.com/id/844294300/vector/download-icon-isolated-vector.jpg?s=612x612&w=0&k=20&c=VCmvy8uEoTQnt9W0kZzjEBplN_opDkGKF_eQTLfkivs="
            alt=""
            className="h-8"
          />
        </button>
      </div>

      {payrollData?.length !== 0 && payrollData && (
        <div className="overflow-hidden px-4 rounded-xl">
          <table className="min-w-full bg-gray-400 border-none rounded-xl">
            <thead className="bg-gray-100 border-2 text-gray-600 rounded-xl">
              <tr className="font-medium">
                <th className="p-3 font-medium text-left">Profile</th>
                <th className="p-3 font-medium text-left">Name</th>
                <th className="p-3 font-medium text-left">Email</th>
                <th className="p-3 font-medium text-left">Salary</th>
                <th className="p-3 font-medium text-left">Bonuses</th>
                <th className="p-3 font-medium text-left">
                  Employee Contribution
                </th>
                <th className="p-3 font-medium text-left">
                  Employer Contribution
                </th>
                <th className="p-3 font-medium text-left">
                  Total Contribution
                </th>
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
      )}
    </div>
  );
}
