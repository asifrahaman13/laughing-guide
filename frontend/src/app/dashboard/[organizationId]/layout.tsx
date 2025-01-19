"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { ReactNode } from "react";
import { MANAGE } from "@/constants/dashboard";
import Link from "next/link";
import Modal from "../../components/ui/modal";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { useParams, usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { useToast } from "@/app/hooks/useToast";
import { Toast } from "@/app/components/toasts/Toast";

interface LayoutProps {
  children: ReactNode;
}

type UserAgent = {
  email: string;
  name: string;
};

type Organization = {
  organizationId: string;
  organizationName: string;
  organizationEmail: string;
};

export default function Layout({ children }: LayoutProps) {
  const { organizationId } = useParams<{ organizationId: string }>();
  const modal = useSelector((state: RootState) => state.modal);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organizationName, setOrganizationName] = useState<string>("");
  const [organizationModal, setOrganizationModal] = useState<boolean>(false);
  const { toast, showToast } = useToast();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    async function getOrganizations() {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
      const access_token = localStorage.getItem("access_token");
      try {
        const response = await axios.get(
          `${backendUrl}/organizations?token=${access_token}`,
        );
        if (response.status === 200) {
          setOrganizations(response.data);
        }
      } catch (error) {
        console.log("Error fetching organizations:", error);
        showToast("Error fetching organizations", "error");
      }
    }
    getOrganizations();
  }, []);

  const [userAgent, setUserAgent] = useState<UserAgent>({
    email: "",
    name: "",
  });

  useEffect(() => {
    async function ValidateToken() {
      const access_token = localStorage.getItem("access_token");
      console.log(access_token);
      if (access_token) {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
        try {
          const response = await axios.get(
            `${backendUrl}/api/auth/login?token=${access_token}`,
          );
          if (response.status === 200) {
            setUserAgent({
              email: response.data.email,
              name: response.data.name,
            });
          }
        } catch (error) {
          console.log("Error validating token:", error);
        }
      }
    }
    ValidateToken();
  }, []);

  function Logout() {
    localStorage.removeItem("access_token");
    router.push("/");
  }

  async function addOrganization() {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
      const access_token = localStorage.getItem("access_token");
      const response = await axios.post(
        `${backendUrl}/add-organization`,
        {
          organizationName: organizationName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      if (response.status === 200) {
        console.log("Organization added successfully:", response.data);
        setOrganizations([...organizations, response.data]);
        showToast("Organization added successfully", "success");
      }
    } catch (error) {
      console.log("Error adding organization:", error);
    } finally {
      setOrganizationModal(false);
    }
  }

  return (
    <React.Fragment>
      {toast && <Toast message={toast.message} type={toast.type} />}
      <div
        className={`w-screen h-screen overflow-y-hidden sm:flex-col md:flex md:flex-row ${
          modal.isOpen ? "overflow-hidden" : ""
        }`}
      >
        {/* Sidebar */}
        <div className=" flex-col lg:flex lg:w-1/6  lg:px-4 lg:text-lg h-full border-2 justify-between flex  gap-4">
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
            <div className="w-full">
              <div className="flex items-center justify-between w-full text-left">
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
                <div>
                  <button
                    className="bg-white shadow-md rounded-full h-6 w-6 flex justify-center items-center"
                    onClick={() => {
                      setOrganizationModal(true);
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Dropdown Menu */}
              </div>
              {isOpen && (
                <div className=" left-0 z-10 w-full mt-2   rounded-md ">
                  {organizations?.map((org, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setIsOpen(false);
                        router.push(
                          `/dashboard/${org?.organizationId}/employees`,
                        );
                      }}
                      className="flex items-center w-full  px-6"
                    >
                      <img src="/images/dashboard/organization.svg" alt="" />
                      <div className=" px-4 py-2 w-full  text-left text-lack text-base font-md ">
                        {org?.organizationName}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="w-full">
              <div className="text-gray-600 px-4">MANAGE</div>
              <div className="flex flex-col gap-2 w-full ">
                {MANAGE?.map((item) => (
                  <Link
                    href={`/dashboard/${organizationId}/${item.link}`}
                    className={`${pathname.split("/").at(-1) === item.link ? " bg-light-gray rounded-2xl border border-gray-800" : ""} hover:bg-slate-100 w-full flex gap-4 justify-start items-center py-2 px-4`}
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    Logout();
                  }}
                >
                  <img
                    src="/images/employees/circle.svg"
                    alt=""
                    className="h-8 w-8"
                  />
                </button>
                <div>
                  <p className="text-sm text-gray-800">{userAgent?.name}</p>
                  <p className="text-sm text-gray-500">{userAgent?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-5/6 h-full overflow-y-scroll bg-lime-gray">
          {children}
        </div>

        {/* Add Organization Modal */}
        {organizationModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
              <div className="w-full  flex  justify-end">
                <button onClick={() => setOrganizationModal(false)}>
                  Cancel
                </button>
              </div>
              <div className="grid gap-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-md mb-2 font-semibold text-gray-700"
                  >
                    Enter organization name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="text"
                      name="text"
                      placeholder="organization_a"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  text-gray-800  dark:placeholder-neutral-500 border dark:focus:ring-neutral-600"
                      required
                      aria-describedby="email-error"
                      onChange={(e) => {
                        setOrganizationName(e.target.value);
                      }}
                    />
                    <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                      <svg
                        className="size-5 text-red-500"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                      </svg>
                    </div>
                  </div>
                  <p
                    className="hidden text-xs text-red-600 mt-2"
                    id="email-error"
                  >
                    Please include a valid email address so we can get back to
                    you
                  </p>
                </div>

                <div className="flex items-center">
                  <div className="ms-3">
                    <label className="text-sm dark:text-white">
                      Remember me
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-lime-green text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  onClick={() => {
                    addOrganization();
                  }}
                >
                  <span>Submit</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        <Modal />
      </div>
    </React.Fragment>
  );
}
