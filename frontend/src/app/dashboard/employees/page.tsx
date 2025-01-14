/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import AddEmployee from "@/app/components/AddEmployee";
import EmployeeList from "@/app/components/EmployeeList";

export default function Page() {
  const [employees, setEmployees] = React.useState([]);

  React.useEffect(() => {
    setEmployees([]);
  }, []);

  return (
    <React.Fragment>
      <div className="w-full h-full">
        {employees.length !== 0 ? <AddEmployee /> : <EmployeeList />}
      </div>
    </React.Fragment>
  );
}
