"use client";
import React from "react";
import AddEmployee from "@/app/components/AddEmployee";

export default function Page() {
  const [employees, setEmployees] = React.useState([]);

  React.useEffect(() => {
    setEmployees([]);
  }, []);

  return (
    <React.Fragment>
      <div className="w-full h-full">
        {employees.length === 0 ? <AddEmployee /> : <>hi</>}
      </div>
    </React.Fragment>
  );
}
