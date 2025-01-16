/* eslint-disable @next/next/no-img-element */
import React from "react";
import { EmploymentType } from "../../types/dashboard";

interface EmployeeStatisticsProps {
  title: string;
  description: string;
  employeeType: EmploymentType | null;
}

const colors = ["#fac905", "#b3bebe", "#02b9b0", "#b774fc"];

function LineChart({ portions }: { portions: number[] }) {
  return (
    <div className="flex w-full h-2 gap-1">
      {portions.map((portion, index) => (
        <div
          key={index}
          className={`h-full rounded-md`}
          style={{
            width: `${portion * 100}%`,
            backgroundColor: colors[index % colors.length],
          }}
        />
      ))}
    </div>
  );
}

export default function EmployeeLine({
  title,
  description,
  employeeType,
}: EmployeeStatisticsProps) {
  if (!employeeType) {
    return null;
  }

  const total =
    employeeType.FullTime +
    employeeType.PartTime +
    employeeType.Contract +
    employeeType.Intern;

  const portions = [
    employeeType.FullTime / total,
    employeeType.PartTime / total,
    employeeType.Contract / total,
    employeeType.Intern / total,
  ];
  if (total === 0) {
    portions.forEach(() => 0);
  }

  return (
    <div className="bg-white border p-4 py-6 rounded-xl h-full w-2/5 flex flex-col">
      <div className="h-2/3 flex justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-sm">{title}</div>
          <div className="font-medium text-2xl">{employeeType?.FullTime}</div>
          <div>{description}</div>
        </div>
      </div>
      <div>
        <LineChart portions={portions} />
      </div>
      <div className="h-1/3">
        <div className="flex text-gray-600 items-center gap-4 flex-wrap p-4 rounded-md">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-cyan-500 mr-2 rounded-full"></div>
            <span className="font-medium">
              {employeeType.FullTime} Full Timer
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-1 h-6 bg-yellow-500 mr-2 rounded-full"></div>
            <span className="font-medium">
              {employeeType.PartTime} Part Timer
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-1 h-6 bg-purple-500 mr-2 rounded-full"></div>
            <span className="font-medium">
              {employeeType.Contract} Contract
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-1 h-6 bg-gray-300 mr-2 rounded-full"></div>
            <span className="font-medium">{employeeType.Intern} Intern</span>
          </div>
        </div>
      </div>
    </div>
  );
}
