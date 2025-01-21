"use client";

import React, { useState } from "react";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Toast from "../toasts/Toast";
import { useToast } from "@/app/hooks/useToast";
import { closeModal } from "@/lib/features/employeeUpdate";
import { updateemploeeData } from "@/lib/features/employeeDataSlice";
import { RootState } from "@/lib/store";
import { usePathname } from "next/navigation";

const people = [
  { id: 1, name: "Active" },
  { id: 2, name: "Invite Sent" },
  { id: 3, name: "Payroll Only" },
];

const EmployeeInput = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) => (
  <div className="py-1 gap-2 flex flex-col">
    <div className="text-sm text-gray-700 font-medium px-2">{placeholder}</div>
    <input
      type="text"
      className="w-full h-12 border rounded-md outline-none px-2"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

const UpdateEmployeeModal = () => {
  const employeeModal = useSelector((state: RootState) => state.employee);
  const employeeData = useSelector((state: RootState) => state.employeeData);
  const [selected, setSelected] = useState(people[0]);
  const dispatch = useDispatch();
  const { toast, showToast } = useToast();
  const pathname = usePathname();

  React.useEffect(() => {
    setSelected({ id: 1, name: employeeData.employeeData.EmployeeStatus });
  }, [employeeData]);

  const handleSelectionChange = (
    person: React.SetStateAction<{ id: number; name: string }>,
  ) => {
    setSelected(person);
    dispatch(updateemploeeData({ key: "EmployeeStatus", value: person.name }));
  };

  const updateEmployeeData = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
      const data = {
        ...employeeData,
        organizationId: pathname.split("/")[2],
      };
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        `${backendUrl}/employees/update-employees`,
        {
          organizationId: data.organizationId,
          EmployeeId: data.employeeData.EmployeeId,
          EmployeeName: data.employeeData.EmployeeName,
          EmployeeProfile: data.employeeData.EmployeeProfile,
          EmployeeEmail: data.employeeData.EmployeeEmail,
          EmployeeRole: data.employeeData.EmployeeRole,
          EmployeeStatus: data.employeeData.EmployeeStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        showToast("Employee data updated successfully", "success");
        dispatch(closeModal());
      }
    } catch (error) {
      console.error("Error updating employee data:", error);
      showToast("Something went wrong", "error");
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} />}
      {employeeModal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-1/3 p-4 h-4/5 flex flex-col gap-4 overflow-scroll no-scrollbar rounded-lg">
            <div className="flex justify-end">
              <button
                className="bg-white shadow-md h-6 w-6 rounded-full flex justify-center items-center"
                onClick={() => dispatch(closeModal())}
              >
                x
              </button>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 text-center">
              Update Employee Data
            </h2>
            <div className="w-full">
              <div className="w-full h-12 border rounded-md outline-none px-2">
                {employeeData.employeeData.EmployeeId}
              </div>
            </div>
            <EmployeeInput
              placeholder="Employee Role"
              value={employeeData?.employeeData.EmployeeRole}
              onChange={(e) =>
                dispatch(
                  updateemploeeData({
                    key: "EmployeeRole",
                    value: e.target.value,
                  }),
                )
              }
            />
            <EmployeeInput
              placeholder="Employee Email"
              value={employeeData?.employeeData?.EmployeeEmail}
              onChange={(e) =>
                dispatch(
                  updateemploeeData({
                    key: "EmployeeEmail",
                    value: e.target.value,
                  }),
                )
              }
            />
            <EmployeeInput
              placeholder="Employee Name"
              value={employeeData?.employeeData?.EmployeeName}
              onChange={(e) =>
                dispatch(
                  updateemploeeData({
                    key: "EmployeeName",
                    value: e.target.value,
                  }),
                )
              }
            />

            <EmployeeInput
              placeholder="Employee Profile"
              value={employeeData?.employeeData?.EmployeeProfile}
              onChange={(e) =>
                dispatch(
                  updateemploeeData({
                    key: "EmployeeProfile",
                    value: e.target.value,
                  }),
                )
              }
            />
            <div>
              <div className="text-sm px-2 text-gray-700 font-medium">
                Status
              </div>
              <Listbox value={selected} onChange={handleSelectionChange}>
                <div className="relative">
                  <Listbox.Button className="grid w-48 cursor-default grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 sm:text-sm/6">
                    <span className="block truncate">{selected?.name}</span>
                    <ChevronUpDownIcon
                      aria-hidden="true"
                      className="size-5 self-center justify-self-end text-gray-500 sm:size-4"
                    />
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-64 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none">
                    {people.map((person) => (
                      <Listbox.Option
                        key={person.id}
                        value={person}
                        className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-lime-green hover:text-white"
                      >
                        <span className="ml-3 block font-normal group-data-[selected]:font-semibold">
                          {person.name}
                        </span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white">
                          <CheckIcon aria-hidden="true" className="size-5" />
                        </span>
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
            <div className="w-full justify-center flex">
              <button
                onClick={updateEmployeeData}
                className="bg-lime-green rounded-lg w-full px-4 py-2 text-white"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateEmployeeModal;
