/* eslint-disable @next/next/no-img-element */
import React from "react";

interface EmployeeStatisticsProps {
  title: string;
  count: number;
  description: string;
  chartSrc: string;
  chartAlt: string;
}

export default function EmployeeStatus({
  title,
  count,
  description,
  chartSrc,
  chartAlt,
}: EmployeeStatisticsProps) {
  return (
    <div className="bg-white p-4 py-6 rounded-xl h-full w-2/5 flex flex-col">
      <div className="h-2/3 flex justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-sm">{title}</div>
          <div className="font-medium text-2xl">{count}</div>
          <div>{description}</div>
        </div>
        <div>
          <img src={chartSrc} alt={chartAlt} className="h-22" />
        </div>
      </div>
      <div className="h-1/3">
        <div className="flex text-gray-600 items-center gap-4 flex-wrap p-4 rounded-md">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-cyan-500 mr-2 rounded-full"></div>
            <span className="font-medium">25 Full-Timer</span>
          </div>
          <div className="flex items-center">
            <div className="w-1 h-6 bg-yellow-500 mr-2 rounded-full"></div>
            <span className="font-medium">10 Part-Timer</span>
          </div>
          <div className="flex items-center">
            <div className="w-1 h-6 bg-purple-500 mr-2 rounded-full"></div>
            <span className="font-medium">5 Contract</span>
          </div>
          <div className="flex items-center">
            <div className="w-1 h-6 bg-gray-300 mr-2 rounded-full"></div>
            <span className="font-medium">6 Intern</span>
          </div>
        </div>
      </div>
    </div>
  );
}
