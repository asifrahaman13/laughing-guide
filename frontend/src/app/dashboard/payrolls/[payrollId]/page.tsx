import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ payrollId: string }>;
}) {
  const payrollId = (await params)?.payrollId;
  return (
    <div>
      <h1>{payrollId}</h1>
    </div>
  );
}
