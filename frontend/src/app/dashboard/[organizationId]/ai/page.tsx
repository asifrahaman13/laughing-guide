"use client";
import React, { useRef, useState } from "react";
import { Status } from "@/constants/types/type.query";

import RenderConversation from "./RenderConversation";
import { useDispatch } from "react-redux";

import { setHistory } from "@/lib/features/conversationSlice";
import axios from "axios";
import { useToast } from "@/app/hooks/useToast";
import Toast from "@/app/components/toasts/Toast";

export default function Chat() {
  const db = "sqlite";
  const websocketRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<Status>({
    message: "",
    status: false,
  });
  const { toast, showToast } = useToast();

  const dispatch = useDispatch();

  React.useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_SOCKET || "";
    const accessToken = localStorage.getItem("access_token");
    const websocket = new WebSocket(
      `${backendUrl}/query/sqlite-query/${accessToken}`,
    );
    websocketRef.current = websocket;
    websocket.onopen = () => {
      console.log("Connected to websocket");
    };

    websocket.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      if (parsedData.status === true) {
        setStatus({
          message: parsedData.message,
          status: true,
        });
        return;
      }
      if (parsedData.answer_type === "sql_query") {
        setStatus({
          message: parsedData.sql_query,
          status: false,
        });
      } else {
        setStatus({
          message: "Error in the query",
          status: false,
        });
      }

      dispatch(
        setHistory({
          message: parsedData?.message,
          sql_query: parsedData?.sql_query,
          messageFrom: "chatbot",
          answer_type: parsedData?.answer_type,
        }),
      );
    };

    websocket.onclose = () => {
      console.log("Disconnected from websocket");
    };

    return () => {
      websocket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [trainValue, setTrainValue] = useState({
    user_query: "",
    sql_query: "",
    source: "source1",
  });

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setTrainValue({
      ...trainValue,
      [e.target.name]: e.target.value,
    });
  }

  async function SubmitForTrain() {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_AI_BACKEND_URL}/train/data`,
        trainValue,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        showToast("Data added to be trained successfully", "success");
        setTimeout(() => {}, 1500);
      }
    } catch {
      console.log("Error in training the model");
    }
  }

  return (
    <React.Fragment>
      {toast && <Toast message={toast.message} type={toast.type} />}
      <div className="flex flex-col h-screen overflow-y-hidden">
        <div className="bg-white px-6 py-6">
          <div className="text-2xl font-medium text-gray-700">Kelick AI</div>
        </div>
        <div className="w-full flex-row items-left py-4 justify-left h-screen overflow-y-hidden flex gap-6 bg-gray-100">
          <div className="w-1/3">
            <RenderConversation
              websocketRef={websocketRef}
              status={status}
              db={db}
            />
          </div>

          <div className="w-1/3 flex py-4 flex-col items-center gap-8 px-6 flex-grow bg-white rounded-xl">
            <div className="flex justify-center  w-full">
              {" "}
              <div className="text-xl font-semibold  text-gray-700 ">
                Train the system
              </div>
            </div>

            <div className="w-full">
              <div className="font-semibold text-lg px-4">
                Enter the user query
              </div>
              <textarea
                name="user_query"
                placeholder="How many distinct organizations are there?"
                rows={3}
                className="w-full placeholder:text-status-gray  shadow-sm outline-none rounded-lg p-4"
                id=""
                onChange={(e) => handleChange(e)}
              ></textarea>
            </div>
            <div className="w-full">
              <div className="font-semibold text-lg px-4">
                Enter the correct sql query
              </div>
              <textarea
                name="sql_query"
                placeholder="SELECT COUNT(DISTINCT organization_id) FROM organizations"
                rows={6}
                className="w-full shadow-sm placeholder:text-status-gray outline-none rounded-lg p-4"
                id=""
                onChange={(e) => handleChange(e)}
              ></textarea>
            </div>
            <div>
              <button
                className="text-Pri-Dark bg-lime-green text-white px-6 py-2 rounded-lg"
                onClick={SubmitForTrain}
              >
                Submit
              </button>
            </div>
          </div>

          <div className="w-1/3 bg-white flex flex-col items-center rounded-lg p-4">
            <div className="flex w-full  justify-center text-lg text-gray-700 font-semibold py-4">
              How to use it?
            </div>
            <div className="space-y-12 lg:space-y-10">
              <div className="flex gap-x-5 sm:gap-x-8">
                <span className="shrink-0 inline-flex justify-center items-center size-[46px] rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm mx-auto dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200">
                  <svg
                    className="shrink-0 size-5"
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
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </span>
                <div className="grow">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 ">
                    Industry-leading documentation
                  </h3>
                  <p className="mt-1 text-gray-600 dark:text-neutral-400">
                    Our documentation and extensive Client libraries contain
                    everything a business needs to build a custom integration in
                    a fraction of the time.
                  </p>
                </div>
              </div>

              <div className="flex gap-x-5 sm:gap-x-8">
                <span className="shrink-0 inline-flex justify-center items-center size-[46px] rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm mx-auto dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200">
                  <svg
                    className="shrink-0 size-5"
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
                    <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                    <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                  </svg>
                </span>
                <div className="grow">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 ">
                    Developer community support
                  </h3>
                  <p className="mt-1 text-gray-600 dark:text-neutral-400">
                    We actively contribute to open-source projects—giving back
                    to the community through development, patches, and
                    sponsorships.
                  </p>
                </div>
              </div>

              <div className="flex gap-x-5 sm:gap-x-8">
                <span className="shrink-0 inline-flex justify-center items-center size-[46px] rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm mx-auto dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200">
                  <svg
                    className="shrink-0 size-5"
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
                    <path d="M7 10v12" />
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                  </svg>
                </span>
                <div className="grow">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                    Simple and affordable
                  </h3>
                  <p className="mt-1 text-gray-600 dark:text-neutral-400">
                    From boarding passes to movie tickets, there is pretty much
                    nothing you can not store with Preline.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
