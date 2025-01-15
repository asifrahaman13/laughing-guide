/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useDispatch } from "react-redux";
import { selectEmployeeName } from "@/lib/features/selectionSlice";

export default function SearchBox() {
  const dispatch = useDispatch();
  return (
    <div className="bg-red-50">
      <div className="">
        <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 ">
          <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">
            <img src="/images/employees/search.svg" alt="" />
          </div>
          <input
            id="price"
            name="price"
            type="text"
            placeholder="Search Employee"
            className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
            onChange={(e) => {
              dispatch(selectEmployeeName({ employeeName: e.target.value }));
            }}
          />
        </div>
      </div>
    </div>
  );
}
