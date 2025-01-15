/* eslint-disable @next/next/no-img-element */

import React from "react";
import HeroSection from "./components/homepage/HeroSection";
import Banner from "./components/homepage/Banner";
import Overview from "./components/homepage/Overview";
import UseCase from "./components/homepage/UseCase";
import FooterComponent from "./components/homepage/FooterComponent";

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      <HeroSection />

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-6xl py-24 sm:py-48 lg:py-6">
          <div className="text-center flex  flex-col items-center gap-8">
            <div className="max-w-2xl  py-3 -rotate-3">
              <h1 className="text-4xl font-bold rotate-3  text-Pri-Dark sm:text-6xl font-sans transform ">
                Blazing fast HR payroll system.⚡⚡
              </h1>
            </div>
            <div className="w-full bg-green-200">
              <div className="bg-white p-12 w-full shadow-2xl">
                <img src="/ss.png" alt="" className="w-3xl" />
              </div>
            </div>

            <p className="max-w-xl mt-6 text-medium font-medium leading-8 text-black">
              Out main objective is to make you 10x more productive. We are here
              to help you to automate HR payroll system with ease.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#"
                className="rounded-md px-3.5 py-2.5 text-sm font-semibold  shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 0"
              >
                Get started
              </a>
              <a
                href="#"
                className="rounded-md  text-black px-3.5 py-2.5 text-sm font-semibold  shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Banner />
      </div>
      <div className="flex flex-col items-center">
        <Overview />
      </div>
      <div>
        <UseCase />
      </div>
      <div>
        <FooterComponent />
      </div>
    </div>
  );
}
