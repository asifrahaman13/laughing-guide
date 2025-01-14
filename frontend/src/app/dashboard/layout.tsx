/* eslint-disable @next/next/no-img-element */
import React from "react";

import { ReactNode } from "react";
import { MANAGE } from "@/constants/dashboard";
import Link from "next/link";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <React.Fragment>
      <div className="w-screen h-screen flex">
        <div className="w-1/6 lg:px-4  lg:text-lg  h-full border-2 justify-between flex flex-col gap-4">
          <div className="  flex flex-col items-start rounded-lg">
            <div className="flex  gap-2 items-center p-4 justify-center">
              <div>
                <img
                  src="/images/dashboard/icon.svg"
                  alt=""
                  className="h-12 "
                />
              </div>
              <div className="font-normal text-xl">Kelick</div>
            </div>
            <div className="flex gap-4 items-center p-4 justify-center">
              <div>
                <img src="/images/dashboard/home.svg" alt="" />
              </div>
              <div>Dashboard</div>
            </div>
            <div>
              <div className="text-gray-600 px-4">Manage</div>

              {MANAGE.map((item) => (
                <Link
                  href={`/dashboard/${item.link}`}
                  className="flex gap-4  justify-start items-center p-4 "
                  key={item.title}
                >
                  <div>
                    <img src={item.icon} alt="" className="h-8 w-auto" />
                  </div>
                  <div>{item.title}</div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="p-4 lg:text-xl  bg-white  rounded-lg w-64">
            <hr className="my-4 " />
              <div className="mb-6">
                <div className="flex items-center mb-2 gap-4">
                  <img src="/images/dashboard/folder.svg" alt="" />
                  <span className=" text-gray-800">Free Plan</span>
                </div>
                <p className="text-sm text-gray-800">1/10 Employees</p>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                  <div
                    className="h-2 bg-teal-500 rounded-full"
                    style={{ width: "10%" }}
                  ></div>
                </div>
              </div>

              <hr className="my-4 " />

              <div className="mb-6 text-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <img src="/images/dashboard/bell.svg" alt="" />
                    <span className=" text-gray-800">Notifications</span>
                  </div>
                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                </div>

                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm text-gray-800">John Doe</p>
                    <p className="text-sm text-gray-500">johndoe@asure.pro</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-5/6 h-full">{children}</div>
      </div>
    </React.Fragment>
  );
}
