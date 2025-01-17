/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import AddEmployee from "@/app/components/ui/AddEmployee";
import { useDispatch, useSelector } from "react-redux";
import { Employee, EmployeeData } from "@/app/types/dashboard";
import axios from "axios";
import { openModal } from "@/lib/features/modalSlice";
import EmployeeStatistics from "@/app/components/charts/EmployeeStatistics";
import EmployeeStatus from "@/app/components/charts/EmployeeStatus";
import EmployeeLine from "@/app/components/charts/EmployeeLine";
import EmployeeTable from "@/app/components/ui/EmployeeTable";
import { ButtionSpinner } from "@/app/components/ui/Buttons";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/store";
import Spinner from "@/app/components/ui/Spinner";

export default function Page() {
  const dispath = useDispatch();
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [employeeStats, setEmployeeStats] = useState<EmployeeData | null>(null);

  const [buttonLoading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const loading = useSelector((state: RootState) => state.spinner.isLoading);
  const router = useRouter();

  React.useEffect(() => {
    setPageLoading(true);
    async function fetchData() {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
      try {
        const [employeesResponse, statsResponse] = await Promise.all([
          axios.get(`${backendUrl}/employees`),
          axios.get(`${backendUrl}/aggregate`),
        ]);

        if (employeesResponse?.data === null || statsResponse?.data === null) {
          console.log("Sorry something went wrong");
        }
        setEmployees(employeesResponse?.data);
        setEmployeeStats(statsResponse?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setPageLoading(false);
      }
    }

    fetchData();
  }, [loading]);

  if (loading || pageLoading) {
    return <Spinner />;
  } else {
    if (employees === null || employees === undefined) {
      return <AddEmployee />;
    }
  }

  async function generatePayroll() {
    try {
      setLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
      const response = await axios.get(`${backendUrl}/calculate-payroll`);
      if (response.status === 200) {
        console.log(response.data);
        router.push("/dashboard/payrolls");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <React.Fragment>
      <div className="flex flex-col w-full h-full">
        <div className="bg-white border p-2 lg:p-4 h-16 flex justify-between items-center">
          <div className="font-medium text-xl">Employees</div>
          <div className="flex gap-2">
            <button
              className="bg-lime-green rounded-lg px-4 gap-2 items-center py-2 flex"
              onClick={() => {
                dispath(openModal());
              }}
            >
              <img src="/images/employees/person.svg" alt="" />
              <div className="text-white">Add Employee</div>
            </button>
            <button
              className="bg-lime-green rounded-lg gap-2 px-4 items-center  flex"
              onClick={generatePayroll}
              disabled={buttonLoading}
            >
              {buttonLoading ? (
                <ButtionSpinner buttonType="primary" />
              ) : (
                <>
                  <img src="/images/employees/person.svg" alt="" />
                  <div className="text-white">Generate Payroll</div>
                </>
              )}
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
        <EmployeeTable />
      </div>
    </React.Fragment>
  );
}
