import React from "react";
import InProgress from "./components/InProgress";

export default function Custom404() {
  return (
    <>
      <InProgress
        title="No page found"
        message="Sorry this page does not exists Please visit our home page"
      />
    </>
  );
}
