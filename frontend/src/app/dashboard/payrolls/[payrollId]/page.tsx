"use client";
import React, { useEffect } from "react";

export default function Page({ params }: { params: { payrollId: string } }) {
  const [payroll, setPayroll] = React.useState<string | null>(null);
  useEffect(() => {
    async function getParams() {
      const { payrollId } = await params;
      setPayroll(payrollId);
    }
    getParams();
  }, [params]);
  return (
    <div>
      <h1>{payroll}</h1>
    </div>
  );
}
