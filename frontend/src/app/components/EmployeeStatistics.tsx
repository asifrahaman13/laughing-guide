/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Nationality } from "../types/dashboard";

interface EmployeeStatisticsProps {
  title: string;
  description: string;
  nationality: Nationality | null;
}

interface ArcProps {
  portions: number[];
}

const colors = ["#02b9b0", "#b3bebe", "#b774fc", "#fac905"];

function HollowCircle({ portions }: ArcProps) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  const getArcLength = (portion: number) => portion * circumference;

  let offset = circumference;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="10"
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

export default function EmployeeStatistics({
  title,
  description,
  nationality,
}: EmployeeStatisticsProps) {
  if (!nationality) {
    return null;
  }

  const total =
    nationality?.Singaporean +
    nationality?.Foreigner +
    nationality?.Others +
    nationality?.PR;

  if (total === 0) {
    return null;
  }
  const portions = [
    nationality?.Singaporean / total,
    nationality?.PR / total,
    nationality?.Foreigner / total,
    nationality?.Others / total,
  ];

  console.log("The portions", portions);

  return (
    <div className="bg-white border p-4 py-6 rounded-xl h-full w-2/5 flex flex-col">
      <div className="h-2/3 flex justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-sm">{title}</div>
          <div className="font-medium text-2xl">{nationality?.Singaporean}</div>
          <div>{description}</div>
        </div>
        <div>
          <HollowCircle portions={portions} />
        </div>
      </div>
      <div className="h-1/3">
        <div className="flex text-gray-600 items-center gap-4 flex-wrap p-4 rounded-md">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-cyan-500 mr-2 rounded-full"></div>
            <span className="font-medium">
              {nationality?.Singaporean} Singaporean
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-1 h-6 bg-yellow-500 mr-2 rounded-full"></div>
            <span className="font-medium">{nationality?.PR} PR</span>
          </div>
          <div className="flex items-center">
            <div className="w-1 h-6 bg-purple-500 mr-2 rounded-full"></div>
            <span className="font-medium">
              {nationality?.Foreigner} Foreigner
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-1 h-6 bg-gray-300 mr-2 rounded-full"></div>
            <span className="font-medium">{nationality?.Others} Others</span>
          </div>
        </div>
      </div>
    </div>
  );
}
