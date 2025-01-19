"use client";
import React, { useRef, useState } from "react";
import { conversationStaticTexts } from "@/constants/static/staticTexts/staticTexts";
import { Status } from "@/constants/types/type.query";

import RenderConversation from "./RenderConversation";
import { useDispatch } from "react-redux";

import { setHistory } from "@/lib/features/conversationSlice";
import axios from "axios";
import SuccessAlert from "@/app/components/SuccessAlert";

export default function Chat() {
  const db = "sqlite";
  const websocketRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<Status>({
    message: "",
    status: false,
  });

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
      console.log("############ The parsed data is :", parsedData);
      if (parsedData.status === true) {
        setStatus({
          message: parsedData.message,
          status: true,
        });
        return;
      }
      if (parsedData.answer_type === "sql_query") {
        console.log("############ Triggered The parsed data is :", parsedData);
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

      console.log("##########################", status);
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
    console.log("The value is :", e.target.value);
    setTrainValue({
      ...trainValue,
      [e.target.name]: e.target.value,
    });
  }

  const [dataAdded, setDataAdded] = useState<boolean>(false);

  async function SubmitForTrain() {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_AI_BACKEND_URL}/train/data`,
        trainValue,
      );
      if (response.status === 200) {
        console.log("The response is :", response.data);
        setDataAdded(true);
        setTimeout(() => {
          setDataAdded(false);
        }, 1500);
      }
    } catch (err) {
      console.log("The error is :", err);
      setDataAdded(false);
    }
  }

  return (
    <React.Fragment>
      {dataAdded && <SuccessAlert />}
      <div className="flex flex-col h-screen overflow-y-hidden">
        <div className="bg-white px-6 py-6">
          <div className="text-xl font-medium text-gray-800">Kelick AI</div>
        </div>
        <div className="w-full flex-row items-left py-4 justify-left h-screen overflow-y-hidden flex gap-6 bg-gray-100">
          <RenderConversation
            websocketRef={websocketRef}
            texts={conversationStaticTexts}
            status={status}
            db={db}
          />
          <div className="flex py-4 flex-col items-center gap-8 px-6 flex-grow bg-white rounded-xl">
            <div className="flex justify-center  w-full">
              {" "}
              <div className="text-xl font-medium text-Pri-Dark ">
                Train the system to give more accurate response.
              </div>
            </div>

            <div className="w-full">
              <div className="font-medium">Enter the user query</div>
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
              <div className="font-medium">Enter the correct sql query</div>
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
        </div>
      </div>
    </React.Fragment>
  );
}
