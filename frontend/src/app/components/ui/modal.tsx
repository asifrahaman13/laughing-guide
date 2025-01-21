/* eslint-disable @next/next/no-img-element */
import { closeModal } from "@/lib/features/modalSlice";
import { RootState } from "@/lib/store";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/lib/features/spinnerSlice";
import ButtionSpinner from "./Buttons";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useToast } from "@/app/hooks/useToast";
import Toast from "../toasts/Toast";

export default function Modal() {
  const dispath = useDispatch();
  const pathname = usePathname();
  const modal = useSelector((state: RootState) => state.modal);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [progress, setProgress] = useState<number>(0);

  async function startProgress() {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 1000);
  }

  const uploadFile = async (file: File) => {
    startProgress();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("organizationId", pathname.split("/")[2]);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        `${backendUrl}/files/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch {
      console.log("Error uploading file:");
    }
  };

  const UploadFile = async (file: File | null) => {
    if (file === null) {
      alert("No file selected");
    }
    if (file) {
      try {
        dispath(startLoading());
        const response = await uploadFile(file);
        if (response === true) {
          setProgress(100);
        }
      } catch {
        showToast(
          "Something went wrong. Please make sure your CSV file is no currupted.",
          "error",
        );
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      await UploadFile(e.target.files[0]);
    }
  };
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      await UploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  async function DownloadSampleCsv() {
    try {
      setLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
      const key = "sample";
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${backendUrl}/files/csv-file?key=${key}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        const presignedUrl = response.data.presigned_url;
        const link = document.createElement("a");
        link.href = presignedUrl;
        link.download = "sample.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch {
      showToast("Error downloading file", "error");
    } finally {
      setLoading(false);
    }
  }

  async function processFile(e: React.MouseEvent) {
    e.preventDefault();
    if (file === null) {
      alert("No file selected");
    }
    if (file) {
      try {
        dispath(startLoading());
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
        const token = localStorage.getItem("access_token");
        const response = await axios.post(
          `${backendUrl}/files/process-file`,
          {
            organizationId: pathname.split("/")[2],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.data === true) {
          dispath(closeModal());
          router.push(`/dashboard/${pathname.split("/")[2]}/employees`);
        }
      } catch {
        showToast(
          "Something went wrong. Please make sure your CSV file is no currupted.",
          "error",
        );
      } finally {
        dispath(closeModal());
        dispath(stopLoading());
      }
    }
  }

  return (
    <React.Fragment>
      {toast && <Toast message={toast.message} type={toast.type} />}
      {modal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Upload File</h2>
            <div>
              {progress === 100 || progress === 0 ? (
                <div
                  className="flex flex-col items-center border-2 border-dashed bg-lime-gray border-gray-300 rounded-lg py-10 px-8 text-center"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
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
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div className="w-full bg-white">
                  <div
                    className={`bg-lime-green h-8 rounded-md w-[${progress}%]`}
                  ></div>
                </div>
              )}

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
                  <h3 className="text-lg font-semibold text-gray-800">
                    Table Example
                  </h3>
                  <p className="text-sm text-gray-500">
                    You can download the attached example and use them as a
                    <br />
                    starting point for your own file.
                  </p>
                </div>

                {loading ? (
                  <ButtionSpinner buttonType="secondary" />
                ) : (
                  <button
                    className="bg-gray-100 border-2 flex  gap-2 items-center text-gray-800 font-medium py-2 px-4 rounded-xl mt-2"
                    onClick={() => DownloadSampleCsv()}
                  >
                    <img src="/images/dashboard/download.svg" alt="" />
                    <div> Download XLSX</div>
                  </button>
                )}
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
                  onClick={(e) => {
                    processFile(e);
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
