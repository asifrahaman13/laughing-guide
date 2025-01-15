"use client";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";
import { SetStateAction, useState } from "react";
import { useDispatch } from "react-redux";
import { setEmployeeRole } from "@/lib/features/selectionSlice";

const people = [
  {
    id: 0,
    name: "All",
  },
  {
    id: 1,
    name: "Full Time",
  },
  {
    id: 2,
    name: "Contract",
  },
  {
    id: 3,
    name: "Part Time",
  },
  {
    id: 4,
    name: "Intern",
  },
];

export default function RolesDropDownBox() {
  const [selected, setSelected] = useState(people[0]);
  const dispatch = useDispatch();

  const handleSelectionChange = (
    person: SetStateAction<{ id: number; name: string }>,
  ) => {
    setSelected(person);
    dispatch(setEmployeeRole({ employeeRole: person.name }));
  };

  return (
    <Listbox value={selected} onChange={handleSelectionChange}>
      <div className="relative">
        <Listbox.Button className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
          <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
            <span className="block truncate">{selected.name}</span>
          </span>
          <ChevronUpDownIcon
            aria-hidden="true"
            className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
        </Listbox.Button>

        <Listbox.Options
          transition
          className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
        >
          {people.map((person) => (
            <Listbox.Option
              key={person.id}
              value={person}
              className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none"
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
  );
}
