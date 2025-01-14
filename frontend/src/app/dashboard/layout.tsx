"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { ReactNode } from "react";
import { MANAGE } from "@/constants/dashboard";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "@/lib/features/modalSlice";

interface LayoutProps {
  children: ReactNode;
}

import axios from "axios";
import { RootState } from "@/lib/store";

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
    const response = await axios.post(`${backendUrl}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export default function Layout({ children }: LayoutProps) {
  const dispath = useDispatch();
  const modal = useSelector((state: RootState) => state.modal);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      try {
        const response = await uploadFile(file);
        console.log("File uploaded successfully:", response);
        dispath(closeModal());
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

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
            <div className="flex gap-2 items-center p-4 justify-center">
              <div>
                <img src="/images/dashboard/icon.svg" alt="" className="h-12" />
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
        {modal.isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Upload File</h2>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center border-2 border-dashed bg-lime-gray border-gray-300 rounded-lg py-10 px-8 text-center">
                  <img
                    src="/images/dashboard/upload.svg"
                    alt=""
                    className="h-20"
                  />
                  <p className="text-sm text-gray-500">
                    Drag and drop your files here
                  </p>

                  <label
                    htmlFor="fileInput"
                    className="mt-2 inline-block px-4 py-2 cursor-pointer"
                  >
                    or Click to upload
                  </label>
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={(e) => {
                      handleFileChange(e);
                    }}
                  />
                </div>

                <div className="mt-4 flex justify-between">
                  <p className="text-sm text-gray-500">
                    Supported formats: XLS, CSV
                  </p>
                  <p className="text-sm text-gray-500">
                    Maximum file size: 25MB
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-4">
                  <div>
                    <img src="/images/employees/excel.svg" alt="" />
                  </div>
                  <div className="flex flex-col ">
                    <h3 className="text-lg font-semibold">Table Example</h3>
                    <p className="text-sm text-gray-500">
                      You can download the attached example and use them as a
                      <br />
                      starting point for your own file.
                    </p>
                  </div>
                  <button className="bg-gray-100 border-2 flex  gap-2 items-center text-gray-800 font-medium py-2 px-4 rounded-xl mt-2">
                    <img src="/images/dashboard/download.svg" alt="" />
                    <div> Download XLSX</div>
                  </button>
                </div>
                <div className="mt-6  flex justify-end">
                  <button
                    type="button"
                    className="bg-gray-100  text-gray-800 font-semibold py-2 px-4 rounded-xl border-2 mr-4"
                    onClick={() => {
                      dispath(closeModal());
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-lime-green text-white font-semibold py-2 px-4 rounded-xl"
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
