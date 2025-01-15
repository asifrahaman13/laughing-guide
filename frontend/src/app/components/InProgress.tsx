/* eslint-disable @next/next/no-img-element */
import React from "react";

export default function InProgress() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
        <img
          src="/images/dashboard/search.svg"
          alt="Under Development"
          className="mb-8"
        />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Sorry, this page is under development!
        </h1>
        <p className="text-gray-600">
          We are working hard to bring this page to you soon. Please check back
          later.
        </p>
      </div>
    </>
  );
}
