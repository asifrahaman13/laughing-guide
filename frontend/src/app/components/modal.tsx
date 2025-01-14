/* eslint-disable @next/next/no-img-element */
import { closeModal } from "@/lib/features/modalSlice";
import { RootState } from "@/lib/store";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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

export default function Modal() {
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
    <>
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
                <p className="text-sm text-gray-500">Maximum file size: 25MB</p>
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
    </>
  );
}
