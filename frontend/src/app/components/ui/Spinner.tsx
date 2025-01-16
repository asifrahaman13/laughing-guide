import React from "react";

export default function Spinner() {
  return (
    <React.Fragment>
      <div className="flex items-center justify-center h-screen">
        <div
          className="h-16 w-16 animate-spin rounded-full border-4 border-transparent"
          style={{
            borderTopColor: "rgba(173,216,230,1)",
            borderRightColor: "rgba(173,216,230,0.7)",
            borderBottomColor: "rgba(173,216,230,0.5)",
            borderLeftColor: "rgba(173,216,230,0.3)",
          }}
        ></div>
      </div>
    </React.Fragment>
  );
}
