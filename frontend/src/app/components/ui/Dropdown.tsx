/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { selectEmployeeStatus } from "@/lib/features/selectionSlice";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { CheckIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const EMPLOYMENT_TYPES = [
  { id: 0, name: "All" },
  { id: 1, name: "Active" },
  { id: 2, name: "Invite Sent" },
  { id: 3, name: "Payroll Only" },
];

const ROLES = [
  { id: 0, name: "All" },
  { id: 1, name: "Full Time" },
  { id: 2, name: "Contract" },
  { id: 3, name: "Part Time" },
  { id: 4, name: "Intern" },
];

type DropDownProps = {
  dropDownType: string;
};

export default function DropDownBox({ dropDownType }: DropDownProps) {
  const [selected, setSelected] = useState(EMPLOYMENT_TYPES[0]);
  React.useEffect(() => {
    if (dropDownType === "roles") {
      setSelected(ROLES[0]);
    } else if (dropDownType === "employment") {
      setSelected(EMPLOYMENT_TYPES[0]);
    }
  }, [dropDownType]);
  const dispatch = useDispatch();

  const handleSelectionChange = (
    selectedOption: (typeof EMPLOYMENT_TYPES)[0],
  ) => {
    setSelected(selectedOption);
    dispatch(selectEmployeeStatus({ employeeStatus: selectedOption.name }));
  };

  const ListboxButton = () => (
    <Listbox.Button className="grid w-48 cursor-default grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 sm:text-sm/6">
      <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
        <span className="block truncate">{selected.name}</span>
      </span>
      <ChevronUpDownIcon
        aria-hidden="true"
        className="col-start-1 row-start-1 h-5 w-5 justify-self-end text-gray-500 sm:h-4 sm:w-4"
      />
    </Listbox.Button>
  );

  const ListboxOptions = () => (
    <Listbox.Options
      className={`${dropDownType === "roles" ? "right-0" : ""}  absolute z-10 mt-1 max-h-56 w-64 overflow-auto rounded-md  bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm`}
    >
      {EMPLOYMENT_TYPES.map((option) => (
        <Listbox.Option
          key={option.id}
          value={option}
          className={({ active, selected }) =>
            `relative cursor-default select-none py-2 pl-3 pr-9 ${
              active ? "bg-lime-green text-white" : "text-gray-900"
            }`
          }
        >
          {({ selected }) => (
            <>
              <div className="flex items-center">
                <span
                  className={`ml-3 block truncate ${
                    selected ? "font-semibold" : "font-normal"
                  }`}
                >
                  {option.name}
                </span>
              </div>
              {selected && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-white">
                  <CheckIcon aria-hidden="true" className="h-5 w-5" />
                </span>
              )}
            </>
          )}
        </Listbox.Option>
      ))}
    </Listbox.Options>
  );

  return (
    <Listbox value={selected} onChange={handleSelectionChange}>
      <div className="relative">
        <ListboxButton />
        <ListboxOptions />
      </div>
    </Listbox>
  );
}
