/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import AddEmployee from "@/app/components/ui/AddEmployee";
import { useDispatch, useSelector } from "react-redux";
import { Employee, EmployeeData } from "@/app/types/dashboard";
import axios from "axios";
import { openModal } from "@/lib/features/modalSlice";
import EmployeeStatistics from "@/app/components/charts/EmployeeStatistics";
import EmployeeStatus from "@/app/components/charts/EmployeeStatus";
import EmployeeLine from "@/app/components/charts/EmployeeLine";
import EmployeeTable from "@/app/components/ui/EmployeeTable";
import ButtonSpinner from "@/app/components/ui/Buttons";
import { usePathname, useRouter } from "next/navigation";
import { RootState } from "@/lib/store";
import Spinner from "@/app/components/ui/Spinner";
import { useToast } from "@/app/hooks/useToast";
import Toast from "@/app/components/toasts/Toast";

const Page: React.FC = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [employeeStats, setEmployeeStats] = useState<EmployeeData | null>(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const loading = useSelector((state: RootState) => state.spinner.isLoading);
  const { toast, showToast } = useToast();
  const router = useRouter();
  const organizationId = pathname.split("/")[2];

  useEffect(() => {
    const fetchData = async () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
      setPageLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const [employeesResponse, statsResponse] = await Promise.all([
          axios.get(`${backendUrl}/employees/employees`, {
            params: { organizationId },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${backendUrl}/employees/aggregate`, {
            params: { organizationId },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setEmployees(employeesResponse.data);
        setEmployeeStats(statsResponse.data);
      } catch {
        showToast("Sorry something went wrong", "error");
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [loading, organizationId, showToast]);

  const handleActionError = (action: string) => {
    showToast(`Error ${action}`, "error");
  };

  const handlePayrollGeneration = async () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
    setButtonLoading(true);
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.get(
        `${backendUrl}/employees/calculate-payroll`,
        {
          params: { organizationId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        showToast("Payroll generated successfully", "success");
      }
    } catch {
      handleActionError("generating payroll");
    } finally {
      setButtonLoading(false);
    }
  };

  const handleOrganizationDeletion = async () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
    const access_token = localStorage.getItem("access_token");
    try {
      const response = await axios.post(
        `${backendUrl}/organizations/delete-organization`,
        { organizationId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (response.status === 200) {
        showToast("Organization deleted successfully", "success");
        router.push(`/dashboard/${response.data.organizationId}/employees`);
      }
    } catch {
      handleActionError("deleting organization");
    }
  };

  const handleCsvDownload = async () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
    setButtonLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`${backendUrl}/files/csv-file`, {
        params: { key: organizationId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const presignedUrl = response.data.presigned_url;
        const link = document.createElement("a");
        link.href = presignedUrl;
        link.download = "sample.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch {
      handleActionError("downloading CSV");
    } finally {
      setButtonLoading(false);
    }
  };

  if (loading || pageLoading) {
    return <Spinner />;
  }

  if (!employees) {
    return (
      <AddEmployee
        organizationName={employeeStats?.OrganizationName || ""}
        organizationId={organizationId}
      />
    );
  }

  return (
    <>
      <div className="flex flex-col w-full h-full">
        {toast && <Toast message={toast.message} type={toast.type} />}
        <div className="bg-white border p-2 lg:p-4 lg:px-8 h-16 flex justify-between items-center">
          <div className="font-medium text-xl flex items-center gap-4">
            <div className="text-2xl font-semibold">
              {employeeStats?.OrganizationName}
            </div>
            <button onClick={handleOrganizationDeletion}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a3/Delete-button.svg"
                alt="Delete"
              />
            </button>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-lime-green rounded-lg px-4 gap-2 items-center py-2 flex"
              onClick={() => dispatch(openModal())}
            >
              <img src="/images/employees/person.svg" alt="Add Employee" />
              <div className="text-white">Add Employee</div>
            </button>
            <button
              className="bg-lime-green rounded-lg gap-2 px-4 items-center flex"
              onClick={handlePayrollGeneration}
              disabled={buttonLoading}
            >
              {buttonLoading ? (
                <ButtonSpinner buttonType="primary" />
              ) : (
                <>
                  <img
                    src="/images/employees/payroll.svg"
                    alt="Generate Payroll"
                  />
                  <div className="text-white">Generate Payroll</div>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex w-full justify-between py-6  px-8">
          <div className="text-xl font-medium">Team Overview</div>
          <div className="rounded-lg border px-2 py-2">
            <button
              className="flex gap-2 items-center"
              onClick={handleCsvDownload}
            >
              <img
                src="https://media.istockphoto.com/id/844294300/vector/download-icon-isolated-vector.jpg?s=612x612&w=0&k=20&c=VCmvy8uEoTQnt9W0kZzjEBplN_opDkGKF_eQTLfkivs="
                alt=""
                className="h-6"
              />
              <div>Export Employee Data</div>
            </button>
          </div>
        </div>
        <div className="mx-8 flex gap-4">
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
    </>
  );
};

export default Page;
