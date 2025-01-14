"use client";
import { useParams } from "next/navigation";
import React from "react";

export default function Page() {
  const params = useParams<{ payrollid: string }>();

  return (
    <div>
      <h1>{params.payrollid}</h1>
    </div>
  );
}
