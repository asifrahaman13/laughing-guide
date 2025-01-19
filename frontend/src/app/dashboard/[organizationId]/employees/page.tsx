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
import { usePathname, useRouter } from "next/navigation";
import { RootState } from "@/lib/store";
import Spinner from "@/app/components/ui/Spinner";
import { useToast } from "@/app/hooks/useToast";
import { Toast } from "@/app/components/toasts/Toast";

export default function Page() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [employeeStats, setEmployeeStats] = useState<EmployeeData | null>(null);
  const [buttonLoading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const loading = useSelector((state: RootState) => state.spinner.isLoading);
  const { toast, showToast } = useToast();
  const router = useRouter();
  const organizationId = pathname.split("/")[2];

  React.useEffect(() => {
    setPageLoading(true);
    async function fetchData() {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
      try {
        const [employeesResponse, statsResponse] = await Promise.all([
          axios.get(`${backendUrl}/employees?organizationId=${organizationId}`),
          axios.get(`${backendUrl}/aggregate?organizationId=${organizationId}`),
        ]);

        if (employeesResponse?.data === null || statsResponse?.data === null) {
          console.log("Sorry something went wrong");
        }
        setEmployees(employeesResponse?.data);
        setEmployeeStats(statsResponse?.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setPageLoading(false);
      }
    }

    fetchData();
  }, [loading, organizationId, pathname]);

  if (loading || pageLoading) {
    return <Spinner />;
  }

  if (employees === null || employees === undefined) {
    return (
      <AddEmployee
        organizationName={employeeStats?.OrganizationName || ""}
        organizationId={organizationId}
      />
    );
  }

  async function generatePayroll() {
    try {
      setLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
      const response = await axios.get(
        `${backendUrl}/calculate-payroll?organizationId=${organizationId}`,
      );
      if (response.status === 200) {
        showToast("Payroll generated successfully", "success");
      }
    } catch (err) {
      console.log(err);
      showToast("Error generating payroll", "error");
    } finally {
      setLoading(false);
    }
  }

  async function deleteOrganization() {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
      const access_token = localStorage.getItem("access_token");
      const response = await axios.post(
        `${backendUrl}/delete-organization`,
        {
          organizationId: organizationId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      if (response.status === 200) {
        showToast("Organization deleted successfully", "success");
        const organizationId = response.data.organizationId;
        router.push(`/dashboard/${organizationId}/employees`);
      }
    } catch (err) {
      console.log(err);
      showToast("Error deleting organization", "error");
    }
  }

  async function downloadSampleCsv() {
    try {
      setLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
      const response = await axios.get(
        `${backendUrl}/csv-file?key=${organizationId}`,
      );
      if (response.status === 200) {
        const presignedUrl = response.data.presigned_url;
        const link = document.createElement("a");
        link.href = presignedUrl;
        link.download = "sample.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.log("Error downloading file:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <React.Fragment>
      <div className="flex flex-col w-full h-full">
        {toast && <Toast message={toast.message} type={toast.type} />}
        <div className="bg-white border p-2 lg:p-4 h-16 flex justify-between items-center">
          <div className="font-medium text-xl flex items-center gap-4">
            <div className="text-2xl font-semibold">
              {employeeStats?.OrganizationName}
            </div>

            <button onClick={() => deleteOrganization()}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a3/Delete-button.svg"
                alt=""
              />
            </button>
            <button
              onClick={() => {
                downloadSampleCsv();
              }}
            >
              <img
                src="https://media.istockphoto.com/id/844294300/vector/download-icon-isolated-vector.jpg?s=612x612&w=0&k=20&c=VCmvy8uEoTQnt9W0kZzjEBplN_opDkGKF_eQTLfkivs="
                alt=""
                className="h-8"
              />
            </button>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-lime-green rounded-lg px-4 gap-2 items-center py-2 flex"
              onClick={() => {
                dispatch(openModal());
              }}
            >
              <img src="/images/employees/person.svg" alt="" />
              <div className="text-white">Add Employee</div>
            </button>
            <button
              className="bg-lime-green rounded-lg gap-2 px-4 items-center flex"
              onClick={generatePayroll}
              disabled={buttonLoading}
            >
              {buttonLoading ? (
                <ButtionSpinner buttonType="primary" />
              ) : (
                <>
                  <img src="/images/employees/payroll.svg" alt="" />
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
