/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  selectEmployeeStatus,
  setEmployeeRole,
} from "@/lib/features/selectionSlice";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { CheckIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

type DataTypes = {
  id: number;
  name: string;
};

type DropDownProps = {
  dropDownType: string;
  data: DataTypes[];
};

export default function DropDownBox({ dropDownType, data }: DropDownProps) {
  const [selected, setSelected] = useState(data[0]);
  React.useEffect(() => {
    console.log(dropDownType);
    if (dropDownType === "roles") {
      setSelected(data[0]);
    } else if (dropDownType === "employment") {
      setSelected(data[0]);
    }
  }, [data, dropDownType]);
  const dispatch = useDispatch();

  const handleSelectionChange = (selectedOption: (typeof data)[0]) => {
    setSelected(selectedOption);
    if (dropDownType === "roles") {
      dispatch(setEmployeeRole({ employeeRole: selectedOption.name }));
    } else if (dropDownType === "employment") {
      dispatch(selectEmployeeStatus({ employeeStatus: selectedOption.name }));
    }
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
      {data?.map((option) => (
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
