"use client";
/* eslint-disable @next/next/no-img-element */
import { useToast } from "@/app/hooks/useToast";
import { openModal } from "@/lib/features/modalSlice";
import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { Toast } from "../toasts/Toast";
import { useRouter } from "next/navigation";

export default function AddEmployee({
  organizationName,
  organizationId,
}: {
  organizationName: string;
  organizationId: string;
}) {
  const { toast, showToast } = useToast();
  const dispatch = useDispatch();
  const router = useRouter();

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
    } catch {
      showToast("Error deleting organization", "error");
    }
  }

  return (
    <React.Fragment>
      {toast && <Toast message={toast.message} type={toast.type} />}
      <div className="flex flex-col w-full h-full bg-gray-100">
        <div className="bg-white p-2 lg:p-4 h-16 flex justify-between items-center">
          <div className="font-medium text-xl flex items-center gap-4">
            <div className="text-2xl font-semibold">{organizationName}</div>

            <button onClick={() => deleteOrganization()}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a3/Delete-button.svg"
                alt=""
              />
            </button>
          </div>
        </div>
        <div className="h-full">
          <div className="bg-white h-full flex flex-col items-center justify-center lg:h-3/5 border-2 rounded-lg p-4 lg:p-8 m-4 lg:m-8">
            <div>
              <img src="/images/employees/employees.svg" alt="" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="font-medium text-2xl">
                Start building your team
              </div>
              <div className="text-gray-500">
                Add your first team member or import your entire team.
              </div>
            </div>
            <div className="flex gap-4 py-4">
              <div>
                <button
                  className="bg-white border-2 rounded-lg px-4 gap-2 items-center py-2 flex"
                  onClick={() => {
                    dispatch(openModal());
                  }}
                >
                  <img src="/images/employees/bulk.svg" alt="" />
                  <div>Bulk upload</div>
                </button>
              </div>
              <div>
                <div>
                  <button
                    className="bg-lime-green rounded-lg px-4 gap-2 items-center py-2 flex"
                    onClick={() => {
                      dispatch(openModal());
                    }}
                  >
                    <img src="/images/employees/person.svg" alt="" />
                    <div className="text-white">Bulk Employee</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
