"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { ReactNode } from "react";
import { MANAGE } from "@/constants/dashboard";
import Link from "next/link";
import Modal from "../../components/ui/modal";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";

interface LayoutProps {
  children: ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  const {organizationId} = useParams<{ organizationId: string }>();
  const modal = useSelector((state: RootState) => state.modal);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const organizations = ["Kelick", "Organization1", "Organization3"];

  return (
    <React.Fragment>
      <div
        className={`w-screen h-screen overflow-y-hidden flex ${
          modal.isOpen ? "overflow-hidden" : ""
        }`}
      >
        {/* Sidebar */}
        <div className="w-1/6 lg:px-4 lg:text-lg h-full border-2 justify-between flex flex-col gap-4">
          <div className="flex flex-col items-start rounded-lg">
            <Link
              href="/"
              className="flex gap-2 items-center p-4 justify-center"
            >
              <div>
                <img src="/images/dashboard/icon.svg" alt="" className="h-12" />
              </div>
              <div className="font-normal text-xl">Kelick</div>
            </Link>
            <div className="flex gap-4 items-center p-4 justify-center">
              <div>
                <img src="/images/dashboard/home.svg" alt="" />
              </div>
              <div>Dashboard</div>
            </div>
            <div>
              <div className="relative   text-left">
                {/* Dropdown Button */}
                <button
                  onClick={toggleDropdown}
                  className="flex border-none items-center gap-2 px-4 py-2 text-gray-800 "
                >
                  <span>ORGANIZATION</span>
                  <svg
                    className={`w-4 h-4 transform transition-transform ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div className=" left-0 z-10 w-56 mt-2 bg-white   rounded-md ">
                    {organizations.map((org, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          console.log(`${org} selected`);
                          setIsOpen(false);
                          router.push(`/dashboard/${org}/employees`);
                        }}
                        className="flex items-center  px-6"
                      >
                        <img src="/images/dashboard/organization.svg" alt="" />
                        <div className=" px-4 py-2 text-left text-lack text-base font-md ">
                          {" "}
                          {org}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="text-gray-600 px-4">MANAGE</div>
              {MANAGE.map((item) => (
                <Link
                  href={`/dashboard/${organizationId}/${item.link}`}
                  className="flex gap-4 justify-start items-center p-4"
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

          {/* Plan Info */}
          <div className="p-4 lg:text-xl bg-white rounded-lg w-64">
            <hr className="my-4" />
            <div className="mb-6">
              <div className="flex items-center mb-2 gap-4">
                <img src="/images/dashboard/folder.svg" alt="" />
                <span className="text-gray-800">Free Plan</span>
              </div>
              <p className="text-sm text-gray-800">1/10 Employees</p>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                <div
                  className="h-2 bg-teal-500 rounded-full"
                  style={{ width: "10%" }}
                ></div>
              </div>
            </div>
            <hr className="my-4" />
            <div className="mb-6 text-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <img src="/images/dashboard/bell.svg" alt="" />
                  <span className="text-gray-800">Notifications</span>
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

        {/* Main Content */}
        <div className="w-5/6 h-full overflow-y-scroll bg-lime-gray">
          {children}
        </div>

        {/* Modal */}
        <Modal />
      </div>
    </React.Fragment>
  );
}
