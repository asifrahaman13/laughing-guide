"use client";
import { useParams } from "next/navigation";
import React from "react";

export default function Page() {
  const params = useParams<{ payrollId: string }>();

  return (
    <div>
      <h1>Person with id {params.payrollId}</h1>
    </div>
  );
}
