/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import axios from "axios";

export default function HeroSection() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [email, setEmail] = useState<string>("");

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
            console.log("Token is valid");
            console.log(response.data);
            setEmail(response.data.email);
            setIsSignedIn(true);
          }
        } catch (error) {
          console.log("Error validating token:", error);
        }
      }
    }
    ValidateToken();
  }, []);

  return (
    <header className="sticky bg-white backdrop-filter backdrop-blur-xl inset-x-0 top-0 z-50">
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt=""
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden justify-center items-center lg:flex lg:gap-x-12">
          <div className="inline-flex outline-none items-center gap-x-1 text-sm font-semibold leading-6 text-gray-90">
            <Link href="/">Why Kelick?</Link>
          </div>
          <div></div>

          <div className="inline-flex outline-none items-center gap-x-1 text-sm font-semibold leading-6 text-gray-90">
            <Link href="#about-section">About</Link>
          </div>
          <div className="inline-flex outline-none items-center gap-x-1 text-sm font-semibold leading-6 text-gray-90">
            <Link href="/dashboard/MyOrg/employees">Dashboard</Link>
          </div>
          <Link
            className="bg-black rounded-md font-semibold text-sm gap-2 text-white py-2 px-4 flex items-center"
            href="https://github.com/asifrahaman13/laughing-guide"
            target="_blank"
          >
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
              className="h-5 w-5 fill-white"
            >
              <path
                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                clipRule="evenodd"
                fillRule="evenodd"
              />
            </svg>
            Star us on github 🌟
          </Link>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {isSignedIn === true ? (
            <div className="text-lg font-medium">{email}</div>
          ) : (
            <Link
              href="/callback"
              className="bg-Lime-Green p-2 rounded-md font-medium text-gray-800"
            >
              Signup{" "}
            </Link>
          )}
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6"></div>
              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
