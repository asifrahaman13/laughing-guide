/* eslint-disable @next/next/no-img-element */
import React from "react";

export default function AddEmployee() {
  return (
    <div className="flex flex-col w-full h-full bg-gray-100">
      <div className="bg-white p-2 lg:p-4 h-16 flex justify-between items-center">
        <div className="font-medium text-xl">Employees</div>
      </div>
      <div className="h-full">
        <div className="bg-white h-full flex flex-col items-center justify-center lg:h-3/5 border-2 rounded-lg p-4 lg:p-8 m-4 lg:m-8">
          <div>
            <img src="/images/employees/employees.svg" alt="" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="font-medium text-2xl">Start building your team</div>
            <div className="text-gray-500">
              Add your first team member or import your entire team.
            </div>
          </div>
          <div className="flex gap-4 py-4">
            <div>
              <button className="bg-white border-2 rounded-lg px-4 gap-2 items-center py-2 flex">
                <img src="/images/employees/bulk.svg" alt="" />
                <div>Bulk upload</div>
              </button>
            </div>
            <div>
              <div>
                <button className="bg-lime-green rounded-lg px-4 gap-2 items-center py-2 flex">
                  <img src="/images/employees/person.svg" alt="" />
                  <div className="text-white">Bulk Employee</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
