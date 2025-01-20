"use client";
import { RootState } from "@/lib/store";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import React, { SetStateAction, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateemploeeData } from "@/lib/features/employeeDataSlice";
import axios from "axios";
import Toast from "../toasts/Toast";
import { useToast } from "@/app/hooks/useToast";
import { closeModal } from "@/lib/features/employeeUpdate";
import { usePathname } from "next/navigation";

const people = [
  {
    id: 0,
    name: "All",
  },
  {
    id: 1,
    name: "Active",
  },
  {
    id: 2,
    name: "Invite Sent",
  },
  {
    id: 3,
    name: "Payroll Only",
  },
];

export default function UpdateEmployeeModal() {
  const employeeModal = useSelector((state: RootState) => state.employee);
  const employeeData = useSelector((state: RootState) => state.employeeData);
  const [selected, setSelected] = useState(people[0]);
  const dispatch = useDispatch();
  const { toast, showToast } = useToast();
  const pathname = usePathname();

  const handleSelectionChange = (
    person: SetStateAction<{ id: number; name: string }>,
  ) => {
    setSelected(person);
    dispatch(updateemploeeData({ key: "EmployeeStatus", value: person.name }));
  };

  async function updateEmployeeData() {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
      const data = { ...employeeData, organizationId: pathname.split("/")[2] };
      const response = await axios.post(`${backendUrl}/update-employees`, {
        organizationId: pathname.split("/")[2],
        EmployeeId: data.employeeData.EmployeeId,
        EmployeeProfile: data.employeeData.EmployeeProfile,
        EmployeeEmail: data.employeeData.EmployeeEmail,
        EmployeeRole: data.employeeData.EmployeeeRole,
        EmployeeStatus: data.employeeData.EmployeeStatus,
      });
      console.log("response: ", response);

      if (response?.status === 200) {
        showToast("Employee data updated successfully", "success");
        dispatch(closeModal());
      }
    } catch {
      console.log("Something went wrong");
    }
  }
  return (
    <React.Fragment>
      {toast && <Toast message={toast.message} type={toast.type} />}
      {employeeModal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-1/3 p-4 h-3/4 flex flex-col gap-4 overflow-scroll no-scrollbar rounded-lg">
            <div className="flex    justify-end">
              <button
                className="bg-white shadow-md  h-6 w-6 rounded-full flex justify-center items-center"
                onClick={() => dispatch(closeModal())}
              >
                x
              </button>
            </div>
            <div className="flex w-full  justify-center">
              <div className="text-xl font-semibold text-gray-700">
                Update employee data
              </div>
            </div>
            <div className="w-full">
              <div
                id=""
                className="w-full h-12 border rounded-md outline-none px-2"
              >
                {employeeData.employeeData.EmployeeId}
              </div>
            </div>
            <div className="w-full">
              <input
                type="text"
                className="w-full h-12 border rounded-md outline-none px-2"
                placeholder="Employee Role"
                value={employeeData?.employeeData.EmployeeeRole}
                onChange={(e) =>
                  dispatch(
                    updateemploeeData({
                      key: "EmployeeeRole",
                      value: e.target.value,
                    }),
                  )
                }
              />
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="Employee Email"
                className="w-full h-12 border rounded-md outline-none px-2"
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
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="Employee Profile"
                className="w-full h-12 border rounded-md outline-none px-2"
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
            </div>
            <div>
              <Listbox value={selected} onChange={handleSelectionChange}>
                <div className="relative">
                  <Listbox.Button className="grid w-48 cursor-default grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 sm:text-sm/6">
                    <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                      <span className="block truncate">{selected?.name}</span>
                    </span>
                    <ChevronUpDownIcon
                      aria-hidden="true"
                      className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                    />
                  </Listbox.Button>

                  <Listbox.Options
                    transition
                    className="absolute z-10 mt-1 max-h-56 w-64 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                  >
                    {people.map((person) => (
                      <Listbox.Option
                        key={person.id}
                        value={person}
                        className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-lime-green data-[focus]:text-white data-[focus]:outline-none"
                      >
                        <div className="flex items-center">
                          <span className="ml-3 block  font-normal group-data-[selected]:font-semibold">
                            {person.name}
                          </span>
                        </div>

                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
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
                onClick={() => updateEmployeeData()}
                className="bg-lime-green rounded-lg w-full px-4 py-2 text-white"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
