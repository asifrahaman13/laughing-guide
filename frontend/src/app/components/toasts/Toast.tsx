/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";

type ToastProps = {
  message: string;
  type: "success" | "error";
};

function ErrorToast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-16 flex items-center gap-2 left-1/2 transform -translate-x-1/2 px-4 py-2 shadow-lg text-gray-800 z-50 bg-white border rounded-lg transition-transform duration-5000 ease-out">
      <img src="/images/employees/tick.svg" alt="" />
      <div>{message}</div>
    </div>
  );
}

function SuccessToast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-16 flex items-center gap-2 left-1/2 transform -translate-x-1/2 px-4 py-2 shadow-lg text-gray-800 z-50 bg-white border rounded-lg transition-transform duration-5000 ease-out">
      <img src="/images/employees/tick.svg" alt="" />
      <div>{message}</div>
    </div>
  );
}

export default function Toast({ message, type }: ToastProps) {
  const [visible, setVisible] = useState<boolean>(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <React.Fragment>
      {type === "error" && <SuccessToast message={message} />}
      {type === "success" && <ErrorToast message={message} />}
    </React.Fragment>
  );
}
