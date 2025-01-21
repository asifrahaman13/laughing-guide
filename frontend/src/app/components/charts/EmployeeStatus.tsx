import React from "react";
import { EmployeeStatusType } from "../../types/dashboard";

type EmployeeStatisticsProps = {
  title: string;
  description: string;
  employmentStatus: EmployeeStatusType | null;
};

type ArcProps = {
  portions: number[];
};

const colors = ["#02b9b0", "#fac905", "#b774fc"];

function HalfCircle({ portions }: ArcProps) {
  const radius = 50;
  const circumference = Math.PI * radius;

  const getArcLength = (portion: number) => portion * circumference;

  let offset = circumference;

  return (
    <svg width="120" height="60" viewBox="0 0 120 60">
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="10"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={circumference}
        transform="rotate(-90 60 60)"
      />
      {portions.map((portion, index) => {
        const arcLength = getArcLength(portion);
        const strokeDasharray = `${arcLength} ${circumference - arcLength}`;
        const strokeDashoffset = offset;
        offset -= arcLength;

        return (
          <circle
            key={index}
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={colors[index % colors.length]}
            strokeWidth="10"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 60 60)"
          />
        );
      })}
    </svg>
  );
}

export default function EmployeeStatus({
  title,
  description,
  employmentStatus,
}: EmployeeStatisticsProps) {
  if (!employmentStatus) {
    return null;
  }

  const total =
    employmentStatus?.Active +
    employmentStatus?.["Invite Sent"] +
    employmentStatus?.["Payroll Only"];

  const portions = [
    employmentStatus?.Active / total,
    employmentStatus?.["Invite Sent"] / total,
    employmentStatus?.["Payroll Only"] / total,
  ];

  if (total === 0) {
    portions.forEach(() => 0);
  }

  return (
    <div className="bg-white p-4 border py-6 rounded-xl h-full w-2/5 flex flex-col">
      <div className="h-2/3 flex justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-sm text-status-gray">{title}</div>
          <div className="font-medium text-2xl">{employmentStatus?.Active}</div>
          <div>{description}</div>
        </div>
        <div>
          <HalfCircle portions={portions} />
        </div>
      </div>
      <div className="h-1/3">
        <div className="flex text-gray-600 items-center gap-4 flex-wrap p-4 rounded-md">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-cyan-500 mr-2 rounded-full"></div>
            <span className="flex items-center gap-1">
              <div className="font-medium text-gray-800">
                {employmentStatus?.Active}
              </div>
              <div>Active</div>
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-1 h-6 bg-yellow-500 mr-2 rounded-full"></div>
            <span className="flex items-center gap-1">
              <div className="font-medium text-gray-800">
                {employmentStatus?.["Invite Sent"]}
              </div>
              <div>Invite Sent</div>
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-1 h-6 bg-purple-500 mr-2 rounded-full"></div>
            <span className="flex items-center gap-1">
              <div className="font-medium text-gray-800">
                {employmentStatus?.["Payroll Only"]}
              </div>
              <div>Payroll Only</div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
