/* eslint-disable @next/next/no-img-element */
import React from "react";

const Banner = () => {
  return (
    <React.Fragment>
      <div className="w-full  flex flex-row items-center justify-center py-16 text-Pri-Dark">
        <div className="w-1/2 flex flex-col items-center justify-center gap-6">
          <h1 className="text-4xl font-bold text-center">
            Free your HR team to focus on talent, <br />
            not tasks
          </h1>
          <p className="text-md font-medium text-center text-black">
            rm. Your HR team should be developing people, not drowning in
            paperwork. We are here to make that happen.
          </p>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Banner;
