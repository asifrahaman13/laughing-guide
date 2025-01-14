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
        <div className="w-1/6  lg:text-xl  h-full border-2 items-center flex flex-col gap-4">
          <div className="flex  gap-2 items-center p-4 justify-center">
            <div>
              <img src="/images/dashboard/icon.svg" alt="" className="h-12 " />
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
          <div></div>
          <div></div>
        </div>
        <div className="w-5/6 h-full">{children}</div>
      </div>
    </React.Fragment>
  );
}
