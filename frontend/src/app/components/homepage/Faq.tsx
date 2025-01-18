"use client";
import React, { useState } from "react";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-10 lg:mb-14">
          <h2 className="text-2xl font-bold md:text-4xl md:leading-tight">
            Your questions, answered
          </h2>
          <p className="mt-1 text-gray-600">
            Answers to the most frequently asked questions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="hs-accordion-group">
            {[
              {
                question: "Can I cancel at anytime?",
                answer:
                  "Yes, you can cancel anytime no questions are asked while you cancel but we would highly appreciate if you will give us some feedback.",
              },
              {
                question: "My team has credits. How do we use them?",
                answer:
                  "Once your team signs up for a subscription plan. This is where we sit down, grab a cup of coffee and dial in the details.",
              },
              {
                question: "How does Prelines pricing work?",
                answer:
                  "Our subscriptions are tiered. Understanding the task at hand and ironing out the wrinkles is key.",
              },
              {
                question: "How secure is Preline?",
                answer:
                  "Protecting the data you trust to Preline is our first priority. This part is really crucial in keeping the project in line to completion.",
              },
              {
                question: "How do I get access to a theme I purchased?",
                answer:
                  "If you lose the link for a theme you purchased, don’t panic! We’ve got you covered. You can login to your account, tap your avatar in the upper right corner, and tap Purchases. If you didn’t create a login or can’t remember the information, you can use our handy Redownload page, just remember to use the same email you originally made your purchases with.",
              },
              {
                question: "Upgrade License Type",
                answer:
                  "To upgrade your license type, please visit the licensing section of your account dashboard.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`hs-accordion ${
                  openIndex === index ? "hs-accordion-active:bg-gray-100" : ""
                } rounded-xl p-6`}
              >
                <button
                  className="hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-gray-800 rounded-lg transition hover:text-gray-500 focus:outline-none focus:text-gray-500"
                  onClick={() => toggleAnswer(index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`hs-basic-collapse-${index}`}
                >
                  {item.question}
                  <svg
                    className={`hs-accordion-active:hidden block shrink-0 size-5 text-gray-600 group-hover:text-gray-500 ${
                      openIndex === index ? "hidden" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                  <svg
                    className={`hs-accordion-active:block hidden shrink-0 size-5 text-gray-600 group-hover:text-gray-500 ${
                      openIndex === index ? "" : "hidden"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m18 15-6-6-6 6" />
                  </svg>
                </button>
                <div
                  id={`hs-basic-collapse-${index}`}
                  className={`hs-accordion-content w-full overflow-hidden transition-[height] duration-300 ${
                    openIndex === index ? "block" : "hidden"
                  }`}
                  role="region"
                  aria-labelledby={`hs-basic-with-title-and-arrow-stretched-heading-${index}`}
                >
                  <p className="text-gray-800">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
