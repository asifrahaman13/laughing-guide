/* eslint-disable @next/next/no-img-element */
import React from "react";

type InProgressProps = {
  title?: string;
  message?: string;
};

export default function InProgress({ title, message }: InProgressProps) {
  return (
    <>
      <div className="flex   flex-col items-center justify-center h-screen bg-gray-100 text-center">
        <img
          src="/images/dashboard/search.svg"
          alt="Under Development"
          className="mb-8"
        />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {title || "Under Development"}
        </h1>
        <p className="text-gray-600 max-w-xl">
          {message ||
            "This page is under development. Please check back later."}
        </p>
      </div>
    </>
  );
}
